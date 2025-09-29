// src/components/Shifts/ShiftDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Axios/axios";
import TokenContext from "../../context/TokenContext";

export default function ShiftDetails() {
  const { id } = useParams();
  const { userToken } = useContext(TokenContext);
  const navigate = useNavigate();

  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShift = async () => {
      try {
        const { data } = await axios.get(`/shifts/${id}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setShift(data);
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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this shift?")) return;

    try {
      await axios.delete(`/shifts/${id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      navigate("/shifts"); // back to dashboard
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete shift");
    }
  };

  if (loading) return <p>Loading shift…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!shift) return <p>Shift not found</p>;

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">{shift.title}</h2>
      <p className="text-gray-600 mb-4">
        {new Date(shift.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
        <br />
        {shift.startTime} – {shift.finishTime}
      </p>

      <div className="mb-4">
        <h3 className="font-medium">Location</h3>
        <p>{shift.location?.name || "N/A"}</p>
        <p>{shift.location?.postCode || ""}</p>
      </div>

      <div className="border rounded-md p-4 mb-4 text-center bg-gray-50">
        <h3 className="font-medium mb-2">Clock-in/out Panel</h3>
        <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">
          Clock In
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Clock Out
        </button>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => navigate(`/shifts/${id}/edit`)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit Shift
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Shift
        </button>
      </div>
    </div>
  );
}
