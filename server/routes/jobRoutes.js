const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// POST - Add Job
router.post("/", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;