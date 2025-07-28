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
        setShifts(data);
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

  if (loading) return <p>Loading shifts…</p>;
  if (error)
    return <p style={{ color: "red" }}>Error loading shifts: {error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Your Shifts</h2>
      {shifts.length === 0 ? (
        <p>No shifts found.</p>
      ) : (
        <ul>
          {shifts.map((shift) => (
            <li key={shift._id} style={{ marginBottom: "1rem" }}>
              <strong>{shift.title || "Shift"}</strong> on{" "}
              {new Date(shift.date).toLocaleDateString()}
              <br />
              {shift.startTime} – {shift.finishTime}
              <br />
              {shift.location?.name}{" "}
              {shift.location?.postCode ? `(${shift.location.postCode})` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
