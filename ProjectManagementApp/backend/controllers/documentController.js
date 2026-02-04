const Document = require('../models/Document');
const Project = require('../models/Project');

// @desc    Get documents for a project
// @route   GET /api/projects/:projectId/documents
// @access  Private
exports.getDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ project: req.params.projectId })
            .populate('uploader', 'name email')
            .sort({ createdAt: -1 });
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new document record
// @route   POST /api/projects/:projectId/documents
// @access  Private
exports.createDocument = async (req, res) => {
    try {
        // The provided Code Edit for createDocument seems to be a mix of file upload and direct body data.
        // Assuming the intent is to use req.file for file details if a file is uploaded,
        // and req.body for other metadata like 'tags'.
        // If req.file is present, it implies a file upload middleware has processed it.
        // If not, it might be a metadata-only creation or an error.

        const { name, originalName, fileUrl, fileType, size, tags } = req.body;
        const projectId = req.params.projectId; // Define projectId from params

        let docData = {
            project: projectId,
            uploader: req.user._id,
            tags: tags // Tags always from body
        };

        if (req.file) {
            // If a file was uploaded via multer
            docData.name = req.file.originalname;
            docData.originalName = req.file.originalname;
            docData.fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; // Construct fileUrl
            docData.fileType = req.file.mimetype;
            docData.size = req.file.size;
        } else {
            // If no file was uploaded, assume file details come from req.body
            docData.name = name;
            docData.originalName = originalName;
            docData.fileUrl = fileUrl;
            docData.fileType = fileType;
            docData.size = size;
        }

        const newDoc = await Document.create(docData);

        const populatedDoc = await Document.findById(newDoc._id)
            .populate('uploader', 'name email');

        res.status(201).json(populatedDoc);
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ message: error.message }); // Changed error message as per instruction
    }
};

exports.uploadVersion = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ message: 'Document not found' });

        // Push current main file to history
        document.versions.push({
            fileUrl: document.fileUrl,
            originalName: document.originalName,
            size: document.size,
            uploadedBy: document.uploader,
            createdAt: document.updatedAt, // or now
            versionNumber: document.version
        });

        // Update main file to new one
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        document.fileUrl = fileUrl;
        document.originalName = req.file.originalname; // keeping name same? or updating?
        document.size = req.file.size;
        document.uploader = req.user._id; // Updated by new uploader
        document.version = (document.version || 1) + 1; // Initialize if not present, then increment

        await document.save();
        res.json(document);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Ideally we should delete the actual file too, but for now we just delete metadata
        await document.deleteOne();
        res.json({ message: 'Document removed' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
