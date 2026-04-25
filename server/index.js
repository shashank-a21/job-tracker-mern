const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express(); // ✅ CREATE APP FIRST

app.use(express.json());

// ✅ THEN import routes
const jobRoutes = require("./routes/jobRoutes");

// ✅ THEN use routes
app.use("/api/jobs", jobRoutes);

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("API running...");
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});