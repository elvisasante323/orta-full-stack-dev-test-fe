// src/components/Shifts/CreateShift.jsx
import React, { useState, useContext } from "react";
import axios from "../../Axios/axios";
import TokenContext from "../../context/TokenContext";
import { useNavigate } from "react-router-dom";

export default function CreateShift() {
  const { userToken, user } = useContext(TokenContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    role: "",
    typeOfShift: "",
    startTime: "",
    finishTime: "",
    date: "",
    location: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axios.post(
        "/shifts",
        {
          title: form.title,
          role: form.role,
          typeOfShift: form.typeOfShift ? [form.typeOfShift] : [],
          user: user._id,
          startTime: form.startTime,
          finishTime: form.finishTime,
          date: form.date,
          location: form.location,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      navigate("/shifts"); // redirect to dashboard
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create shift");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 max-w-xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Shift</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Role</label>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Type of Shift</label>
          <input
            type="text"
            name="typeOfShift"
            value={form.typeOfShift}
            onChange={handleChange}
            placeholder="e.g. Day, Night"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Finish Time</label>
            <input
              type="time"
              name="finishTime"
              value={form.finishTime}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Location (ID)</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            placeholder="Enter Location ObjectId"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Shift"}
        </button>
      </form>
    </div>
  );
}
