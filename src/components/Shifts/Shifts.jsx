// src/components/Shifts/Shifts.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "../../Axios/axios"; // your configured instance
import TokenContext from "../../context/TokenContext";

export default function Shifts() {
  const { userToken, user } = useContext(TokenContext);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
      setError(null);

      if (!userToken || !user?._id) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("/shifts", {
          params: { userId: user._id },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        // sort shifts chronologically
        const sorted = data.sort((a, b) => {
          const aStart = new Date(`${a.date}T${a.startTime}`);
          const bStart = new Date(`${b.date}T${b.startTime}`);
          return aStart - bStart;
        });

        setShifts(sorted);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || err.message || "Failed to load shifts"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [userToken, user]);

  // Shift status
  const buildDateTime = (dateStr, timeStr) => {
  const d = new Date(dateStr); // base date (e.g. 2025-12-25)
  const [h, m] = timeStr.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d;
};

const getStatus = (shift) => {
  const now = new Date();
  const start = buildDateTime(shift.date, shift.startTime);
  const end = buildDateTime(shift.date, shift.finishTime);

  if (now < start) return "Scheduled";
  if (now >= start && now <= end) return "In Progress";
  return "Completed";
};


  if (loading) return <p>Loading shifts…</p>;
  if (error)
    return <p style={{ color: "red" }}>Error loading shifts: {error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Your Shifts</h2>
      <p>
        Your shifts in chronological order
      </p>
     
      <button
        onClick={() => (window.location.href = "/create-shift")}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Create Shift
      </button>

      {shifts.length === 0 ? (
        <p>No shifts found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Date</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Shift</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Time</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Location</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Status</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift._id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "0.5rem" }}>
                  {new Date(shift.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric",})}
                </td>
                <td style={{ padding: "0.5rem" }}>{shift.title}</td>
                <td style={{ padding: "0.5rem" }}>
                  {shift.startTime} – {shift.finishTime}
                </td>
                <td style={{ padding: "0.5rem" }}>
                  {shift.location?.name || "N/A"}{" "}
                  {shift.location?.postCode ? `(${shift.location.postCode})` : ""}
                </td>
            <td style={{ padding: "0.5rem" }}>
                  {getStatus(shift)}
                </td>
                <td style={{ padding: "0.5rem" }}>
                  <button
                    onClick={() => (window.location.href = `/shifts/${shift._id}`)}
                    style={{
                      padding: "0.25rem 0.5rem",
                      border: "1px solid #2563eb",
                      borderRadius: "4px",
                      background: "white",
                      color: "#2563eb",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
