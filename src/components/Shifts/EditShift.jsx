// src/components/Shifts/EditShift.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Axios/axios";
import TokenContext from "../../context/TokenContext";

export default function EditShift() {
  const { id } = useParams();
  const { userToken, user } = useContext(TokenContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    role: "",
    typeOfShift: "",
    startTime: "",
    finishTime: "",
    date: "",
    location: "", // location ID
    locationName: "",
    locationPostCode: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing shift + location
  useEffect(() => {
    const fetchShift = async () => {
      try {
        const { data } = await axios.get(`/shifts/${id}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        setForm({
          title: data.title || "",
          role: data.role || "",
          typeOfShift: data.typeOfShift?.[0] || "",
          startTime: data.startTime || "",
          finishTime: data.finishTime || "",
          date: data.date ? data.date.split("T")[0] : "",
          location: data.location?._id || "",
          locationName: data.location?.name || "",
          locationPostCode: data.location?.postCode || "",
        });
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || err.message || "Failed to load shift"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchShift();
  }, [id, userToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Update the shift itself
      await axios.put(
        `/shifts/${id}`,
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
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      // Update the location document
      if (form.location) {
        await axios.put(
          `/shifts/locations/${form.location}`,
          {
            name: form.locationName,
            postCode: form.locationPostCode,
          },
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
      }

      navigate(`/shifts/${id}`); // go back to details page
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update shift");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading shift data…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="mt-10 max-w-xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Shift</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Shift fields */}
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

        {/* Location fields */}
        <div>
          <label className="block text-sm font-medium">Location Name</label>
          <input
            type="text"
            name="locationName"
            value={form.locationName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Location Postcode</label>
          <input
            type="text"
            name="locationPostCode"
            value={form.locationPostCode}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Location ID</label>
          <input
            type="text"
            name="location"
            value={form.location}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update Shift"}
        </button>
      </form>
    </div>
  );
}
