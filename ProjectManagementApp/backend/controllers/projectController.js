const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    try {
        console.log('createProject called, user:', req.user?._id);
        console.log('Request body:', req.body);
        const project = await Project.create({
            ...req.body,
            admin: req.user._id,
        });
        console.log('Project created:', project._id);
        res.status(201).json(project);
    } catch (error) {
        console.error('Error in createProject:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        console.log('getProjects called, user:', req.user?._id);
        // Return all projects for now (can add filtering later)
        const projects = await Project.find({})
            .populate('admin', 'name email')
            .populate('team', 'name email');
        console.log('Projects found:', projects.length);
        res.json(projects);
    } catch (error) {
        console.error('Error in getProjects:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('admin team', 'name email')
            .populate('milestones');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        console.log('updateProject called');
        console.log('ID:', req.params.id);
        console.log('Body:', req.body);

        // Filter out fields that should not be updated directly
        const { _id, createdAt, updatedAt, __v, admin, ...updateData } = req.body;

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!project) {
            console.log('Project not found for update');
            return res.status(404).json({ message: 'Project not found' });
        }

        console.log('Project updated successfully:', project._id);
        res.json(project);
    } catch (error) {
        console.error('Error in updateProject:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit a project request (Extend Date / On Hold)
exports.submitProjectRequest = async (req, res) => {
    try {
        const { requestType, reason, newEndDate } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        project.requests.push({
            requestedBy: req.user._id,
            requestType,
            reason,
            newEndDate
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.handleProjectRequest = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const request = project.requests.id(requestId);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.requestStatus = status;

        // If approved, apply the changes to the project
        if (status === 'APPROVED') {
            if (request.requestType === 'EXTEND_DATE') {
                project.endDate = request.newEndDate;
            } else if (request.requestType === 'ON_HOLD') {
                project.status = 'On Hold';
            }
        }

        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTemplates = async (req, res) => {
    try {
        const templates = await Project.find({ isTemplate: true });
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createFromTemplate = async (req, res) => {
    try {
        const { templateId } = req.params;
        const { name, startDate, endDate } = req.body;

        const template = await Project.findById(templateId);
        if (!template) return res.status(404).json({ message: 'Template not found' });

        // Clone Project
        const newProject = await Project.create({
            name: name || `${template.name} (Copy)`,
            description: template.description,
            status: 'Active',
            startDate,
            endDate,
            admin: req.user._id,
            isTemplate: false
            // Milestones would need to be deep cloned here if we had full logic
        });

        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
