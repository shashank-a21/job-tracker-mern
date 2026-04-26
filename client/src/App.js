import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/jobs"; // 🔁 change this after deployment

function App() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.log(err));
  };

  const addJob = (e) => {
    e.preventDefault();

    if (!company || !role) return; // 🚫 prevent empty

    fetch(API_URL, {
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
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    }).then(() => fetchJobs());
  };

  const updateStatus = (id, newStatus) => {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    }).then(() => fetchJobs());
  };

  // 🔍 Search + Filter
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.role?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || job.status === filter;

    return matchesSearch && matchesFilter;
  });

  // 📊 Stats
  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "Applied").length,
    interview: jobs.filter((j) => j.status === "Interview").length,
    offer: jobs.filter((j) => j.status === "Offer").length,
    rejected: jobs.filter((j) => j.status === "Rejected").length,
  };

  // 🧱 Kanban grouping (IMPORTANT: use filteredJobs)
  const groupedJobs = {
    Applied: filteredJobs.filter((j) => j.status === "Applied"),
    Interview: filteredJobs.filter((j) => j.status === "Interview"),
    Offer: filteredJobs.filter((j) => j.status === "Offer"),
    Rejected: filteredJobs.filter((j) => j.status === "Rejected"),
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Job Tracker</h1>

        {/* 📊 STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow text-center">
            <p>Total</p>
            <h2 className="font-bold">{stats.total}</h2>
          </div>
          <div className="bg-blue-100 p-4 rounded text-center">
            Applied: {stats.applied}
          </div>
          <div className="bg-yellow-100 p-4 rounded text-center">
            Interview: {stats.interview}
          </div>
          <div className="bg-green-100 p-4 rounded text-center">
            Offer: {stats.offer}
          </div>
          <div className="bg-red-100 p-4 rounded text-center">
            Rejected: {stats.rejected}
          </div>
        </div>

        {/* ➕ FORM */}
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
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add
          </button>
        </form>

        {/* 🔍 FILTER */}
        <div className="flex gap-3 justify-center mb-6">
          <input
            className="border p-2 rounded w-1/3"
            placeholder="Search..."
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

        {/* 🧱 KANBAN */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.keys(groupedJobs).map((status) => (
            <div key={status} className="bg-gray-200 p-3 rounded">
              <h2 className="font-bold text-center mb-3">{status}</h2>

              {groupedJobs[status].map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-3 mb-2 rounded shadow hover:shadow-lg transition"
                >
                  <h3 className="font-semibold">
                    {job.company || "No Company"}
                  </h3>
                  <p>{job.role || "No Role"}</p>

                  <select
                    className="border mt-2 p-1 w-full"
                    value={job.status}
                    onChange={(e) =>
                      updateStatus(job._id, e.target.value)
                    }
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>

                  <button
                    onClick={() => deleteJob(job._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 mt-2 w-full rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;