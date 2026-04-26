import React, { useState } from "react";

const BASE_URL = "https://job-tracker-mern-e5tj.onrender.com/api/auth";

function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? "/login" : "/register";

    try {
      const res = await fetch(`${BASE_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // 👇 IMPORTANT CHECK
        if (!res.ok) {
            const text = await res.text();
            console.log("Server error:", text);
            alert("Server error. Check backend.");
            return;
        }

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        alert(data.msg || "Check credentials");
      }
    } catch (err) {
        console.log("ERROR:", err);
        alert("Error: " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          className="text-center mt-3 text-blue-500 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create account" : "Already have an account?"}
        </p>
      </form>
    </div>
  );
}

export default Auth;