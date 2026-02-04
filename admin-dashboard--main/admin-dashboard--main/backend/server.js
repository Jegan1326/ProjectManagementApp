const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dashboard").catch(err => console.error("MongoDB connection failed:", err));

const taskRoutes = require("./routes/taskroutes");

const app = express();
app.use(express.json());

app.use("/tasks", taskRoutes);

app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));