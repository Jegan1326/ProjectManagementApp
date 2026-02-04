const Project = require('../models/Project');
const Task = require('../models/Task');
const Issue = require('../models/Issue');
const Timesheet = require('../models/Timesheet');

// @desc    Get dashboard statistics
// @route   GET /api/reports/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        // Parallel execution for performance
        const [
            totalProjects,
            activeProjects,
            completedProjects,
            totalTasks,
            completedTasks,
            totalIssues,
            openIssues,
            timesheets
        ] = await Promise.all([
            Project.countDocuments(),
            Project.countDocuments({ status: 'Active' }),
            Project.countDocuments({ status: 'Completed' }),
            Task.countDocuments(),
            Task.countDocuments({ status: 'Completed' }),
            Issue.countDocuments(),
            Issue.countDocuments({ status: { $ne: 'Closed' } }), // Assuming 'Closed' is the final state
            Timesheet.find({}, 'hours') // Fetch only hours field
        ]);

        const totalHours = timesheets.reduce((acc, curr) => acc + curr.hours, 0);
        const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        res.json({
            projects: {
                total: totalProjects,
                active: activeProjects,
                completed: completedProjects
            },
            tasks: {
                total: totalTasks,
                completed: completedTasks,
                rate: taskCompletionRate
            },
            issues: {
                total: totalIssues,
                pending: openIssues
            },
            hours: {
                total: Math.round(totalHours * 100) / 100
            }
        });
    } catch (error) {
        console.error('Error fetching report stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get detailed project progress
// @route   GET /api/reports/projects
// @access  Private
exports.getProjectProgress = async (req, res) => {
    try {
        const projects = await Project.find({}, 'name status startDate endDate');

        // Calculate progress for each project based on tasks
        const projectProgress = await Promise.all(projects.map(async (project) => {
            const totalTasks = await Task.countDocuments({ project: project._id });
            const completedTasks = await Task.countDocuments({ project: project._id, status: 'Completed' });
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return {
                _id: project._id,
                name: project.name,
                status: project.status,
                startDate: project.startDate,
                endDate: project.endDate,
                totalTasks,
                completedTasks,
                progress
            };
        }));

        res.json(projectProgress);
    } catch (error) {
        console.error('Error fetching project progress:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
