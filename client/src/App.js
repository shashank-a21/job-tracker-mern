import React, { useEffect, useState } from "react";



function App() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchJobs = () => {
    fetch("http://localhost:8080/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.log(err));
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
      fetchJobs();
    });
  };

  const deleteJob = (id) => {
    fetch(`http://localhost:8080/api/jobs/${id}`, {
      method: "DELETE",
    }).then(() => fetchJobs());
  };

  const updateStatus = (id, newStatus) => {
    fetch(`http://localhost:8080/api/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    }).then(() => fetchJobs());
  };

  const filteredJobs = jobs.filter((job) => {
  const matchesSearch =
    job.company?.toLowerCase().includes(search.toLowerCase()) ||
    job.role?.toLowerCase().includes(search.toLowerCase());

  const matchesFilter =
    filter === "All" || job.status === filter;

  return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Job Tracker</h1>

      {/* FORM */}
      <form onSubmit={addJob} className="flex gap-3 justify-center mb-6">
        <input
          className="border p-2 rounded w-1/4"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          className="border p-2 rounded w-1/4"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add
        </button>
      </form>

      <div className="flex gap-3 justify-center mb-6">
        <input
          className="border p-2 rounded w-1/3"
          placeholder="Search by company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* JOB LIST */}
      <div className="max-w-2xl mx-auto">
        {filteredJobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-4 rounded shadow mb-3 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{job.company || "No Company"}</h3>
              <p className="text-gray-600">{job.role || "No Role"}</p>

              <select
                className="border mt-2 p-1 rounded"
                value={job.status}
                onChange={(e) => updateStatus(job._id, e.target.value)}
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>

            <button
              onClick={() => deleteJob(job._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;