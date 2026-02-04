const express = require('express');
const { getUsers, updateUserProfile, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getUsers); // Should protect + admin ideally, but for now protect
router.put('/profile', protect, updateUserProfile);
router.put('/:id/role', protect, updateUserRole);
router.delete('/:id', protect, deleteUser);

module.exports = router;
