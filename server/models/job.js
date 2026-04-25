const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: String,
  role: String,
  status: {
    type: String,
    enum: ["Applied", "Interview", "Offer", "Rejected"],
    default: "Applied"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Job", jobSchema);