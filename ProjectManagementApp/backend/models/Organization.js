const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    address: { type: String },
    logo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Organization', OrganizationSchema);
