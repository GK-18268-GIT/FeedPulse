"use client"

import { useEffect, useState } from "react";
import { API_URL } from "../../lib/api";
import "../../styles/adminDashboard.css";

interface Feedback {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  sentiment: string;
  priority_score: number;
  created_at: string;
  summary?: string;
  tags?: string[];
}

export default function AdminDashboard() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getAuthToken = () => {
      if (typeof window === "undefined") return null;
      return localStorage.getItem("token");
    };

    useEffect(() => {
      const token = getAuthToken();
      setIsLoggedIn(!!token);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError(null);
      setIsLoading(true);

      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });

        const data = await res.json();

        if (!res.ok) {
          setLoginError(data.message || "Login failed");
          return;
        }

        localStorage.setItem("token", data.data);
        setIsLoggedIn(true);
        setLoginEmail("");
        setLoginPassword("");
        fetchFeedbacks();
      } catch (e) {
        setLoginError((e as Error).message || "Login failed");
      } finally {
        setIsLoading(false);
      }
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setFeedbacks([]);
    };

    const fetchFeedbacks = async() => {
        const params = new URLSearchParams();

        if(category) params.append("category", category);
        if(status) params.append("status", status);
        if(sortBy) params.append("sortBy", sortBy);

        try {
          setError(null);
          const token = getAuthToken();
          const res = await fetch(`${API_URL}/admin/feedback?${params.toString()}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });

          if (!res.ok) {
            const text = await res.text().catch(() => "");
            setFeedbacks([]);
            setError(
              `Failed to load feedbacks (${res.status}). ${
                res.status === 401
                  ? "Missing/invalid admin token. Login first and store it in localStorage under 'token'."
                  : text
              }`
            );
            return;
          }

          const data = await res.json();
          if (data?.success) {
            setFeedbacks(data.data ?? []);
          } else {
            setFeedbacks([]);
            setError(data?.message ?? "Unexpected response from server.");
          }
        } catch (e) {
          setFeedbacks([]);
          setError((e as Error).message || "Failed to load feedbacks.");
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchFeedbacks();
        }
    }, [category, status, sortBy, isLoggedIn]);

    const updateFeedbackStatus = async(id: string, newStatus: string) => {
        const token = getAuthToken();
        await fetch(`${API_URL}/admin/feedback/${id}/status`,{
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ status: newStatus }),
        });
        fetchFeedbacks();
    };

    const deleteFeedback = async (id: string) => {
        const token = getAuthToken();
        await fetch(`${API_URL}/admin/feedback/${id}`, {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        fetchFeedbacks();
    };

    const filterFeedback = feedbacks.filter((f) =>
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase())
    );

    if (!isLoggedIn) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border">

            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Admin Login
            </h1>

            {loginError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>

                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>

                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

            </form>
          </div>
        </div>
      );
    }

    return (
  <div className="min-h-screen bg-gray-100 py-10 px-6">

    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Logout
        </button>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-5 mb-8 flex flex-wrap gap-4 items-center">

        <input
          type="text"
          placeholder="Search feedback..."
          className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select name="category" title="select feedback category"
          className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option>Bug</option>
          <option>Feature Request</option>
          <option>Improvement</option>
          <option>Other</option>
        </select>

        <select name="status" title="select status"
          className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option>New</option>
          <option>In Review</option>
          <option>Resolved</option>
        </select>

        <select name="sort" title="sortBy"
          className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="latest">Date</option>
          <option value="priority">Priority</option>
          <option value="sentiment">Sentiment</option>
        </select>

      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Feedback Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filterFeedback.map((feedback) => (

          <div
            key={feedback._id}
            className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-lg transition"
          >

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {feedback.title}
            </h2>

            <p className="text-gray-600 text-sm mb-4">
              {feedback.description}
            </p>

            <div className="space-y-2 text-sm">

              <div>
                <span className="font-semibold">Category:</span> {feedback.category}
              </div>

              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                  {feedback.status}
                </span>
              </div>

              <div>
                <span className="font-semibold">Sentiment:</span>{" "}
                <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700">
                  {feedback.sentiment}
                </span>
              </div>

              <div>
                <span className="font-semibold">Priority:</span>{" "}
                {feedback.priority_score}
              </div>

            </div>

            {/* AI Analysis */}
            {(feedback.summary || feedback.tags) && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                <div className="font-semibold text-yellow-800 mb-2">AI Analysis</div>
                {feedback.summary && (
                  <p className="text-yellow-700 mb-2">
                    <span className="font-medium">Summary:</span> {feedback.summary}
                  </p>
                )}
                {feedback.tags && feedback.tags.length > 0 && (
                  <div>
                    <span className="font-medium text-yellow-800">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {feedback.tags.map((tag, idx) => (
                        <span key={idx} className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status Actions */}
            <div className="mt-5 space-y-2">
              <div className="text-sm font-semibold">Change Status:</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateFeedbackStatus(feedback._id, "New")}
                  className={`py-1.5 rounded-md text-sm font-semibold transition ${
                    feedback.status === "New"
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                  }`}
                  disabled={feedback.status === "New"}
                >
                  New
                </button>
                <button
                  onClick={() => updateFeedbackStatus(feedback._id, "In Review")}
                  className={`py-1.5 rounded-md text-sm font-semibold transition ${
                    feedback.status === "In Review"
                      ? "bg-yellow-500 text-white cursor-not-allowed"
                      : "bg-yellow-300 text-yellow-900 hover:bg-yellow-400"
                  }`}
                  disabled={feedback.status === "In Review"}
                >
                  In Review
                </button>
                <button
                  onClick={() => updateFeedbackStatus(feedback._id, "Resolved")}
                  className={`py-1.5 rounded-md text-sm font-semibold transition ${
                    feedback.status === "Resolved"
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-green-400 text-green-900 hover:bg-green-500"
                  }`}
                  disabled={feedback.status === "Resolved"}
                >
                  Resolved
                </button>
              </div>
            </div>

            {/* Delete Action */}
            <div className="mt-4">
              <button
                onClick={() => deleteFeedback(feedback._id)}
                className="w-full bg-red-500 text-white py-1.5 rounded-md text-sm font-semibold hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>

          </div>

        ))}

      </div>

    </div>

  </div>
);
}