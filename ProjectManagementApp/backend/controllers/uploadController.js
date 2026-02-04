const path = require('path');

// @desc    Upload a file
// @route   POST /api/upload
// @access  Private
exports.uploadFile = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return file info including URL (assuming we serve static files)
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        res.json({
            message: 'File uploaded successfully',
            filePath: req.file.path,
            fileUrl: fileUrl,
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
