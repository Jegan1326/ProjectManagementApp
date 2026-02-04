const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Changed from 'name' to 'username' to match your Atlas data
  username: { 
    type: String, 
    required: [true, "Username is required"],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, "Password is required"] 
  },
  // Updated enums to match your Atlas roles: 'admin' and 'team'
  role: { 
    type: String, 
    enum: ['admin', 'team'], 
    default: 'team' 
  },
  avatar: { 
    type: String, 
    default: function() {
      // Changed to this.username to match the new field
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.username)}&background=random&color=fff`;
    }
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);