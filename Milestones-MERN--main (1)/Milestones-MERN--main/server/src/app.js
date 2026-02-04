const express = require("express");
const cors = require("cors");

const milestoneRoutes = require("./routes/milestone.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API Running"));

app.use("/api/milestones", milestoneRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
const seedRoutes = require("./routes/seed.routes");
app.use("/api/seed", seedRoutes);
