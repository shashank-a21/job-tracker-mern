import React, { useEffect, useState } from "react";

function App() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    fetch("http://localhost:8080/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data));
  };

  const addJob = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company, role }),
    }).then(() => {
      setCompany("");
      setRole("");
      fetchJobs(); // refresh list
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Job Tracker</h1>

      {/* FORM */}
      <form onSubmit={addJob}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <button type="submit">Add Job</button>
      </form>

      <hr />

      {/* JOB LIST */}
      {jobs.map((job) => (
        <div key={job._id}>
          <h3>{job.company || "No Company"}</h3>
          <p>{job.role || "No Role"}</p>
          <p>Status: {job.status}</p>
        </div>
      ))}
    </div>
  );
}

export default App;