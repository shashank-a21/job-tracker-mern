const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const auth = require("../middleware/auth");

// GET all jobs for this user
router.get("/", auth, async (req, res) => {
  const jobs = await Job.find({ user: req.user.id }).sort({ date: -1 });
  res.json(jobs);
});

// CREATE job for this user
router.post("/", auth, async (req, res) => {
  const { company, role } = req.body;
  const job = await Job.create({
    company,
    role,
    user: req.user.id, // 👈 attach owner
  });
  res.json(job);
});

// UPDATE job (only if it belongs to this user)
router.put("/:id", auth, async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id }, // 👈 ownership check
    req.body,
    { new: true }
  );
  if (!job) return res.status(404).json({ msg: "Not found" });
  res.json(job);
});

// DELETE job (only if it belongs to this user)
router.delete("/:id", auth, async (req, res) => {
  const job = await Job.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id, // 👈 ownership check
  });
  if (!job) return res.status(404).json({ msg: "Not found" });
  res.json({ msg: "Deleted" });
});

module.exports = router;