import React, { useState, useEffect } from "react";

const App = () => {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false); // Track check-in status

  useEffect(() => {
    // Load saved values from localStorage
    const savedName = localStorage.getItem("attendanceName");
    const savedDesignation = localStorage.getItem("attendanceDesignation");
    const savedCheckInStatus = localStorage.getItem("isCheckedIn");

    if (savedName) setName(savedName);
    if (savedDesignation) setDesignation(savedDesignation);
    if (savedCheckInStatus === "true") setIsCheckedIn(true);
  }, []);

  const handleInputChange = (setter, key, value) => {
    setter(value);
    localStorage.setItem(key, value);
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error fetching location:", error);
            reject(error);
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
        reject(new Error("Geolocation not supported"));
      }
    });
  };

  const handleAttendance = async (type) => {
    if (type === "check-in" && isCheckedIn) {
      alert("You have already checked in! Please check out first.");
      return;
    }

    try {
      const location = await getLocation();
      const data = { name, designation, type, ...location };

      const response = await fetch("http://localhost:5000/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      alert(`${type === "check-in" ? "Check-in" : "Check-out"}: ${result}`);

      if (type === "check-in") {
        setIsCheckedIn(true);
        localStorage.setItem("isCheckedIn", "true"); // Save check-in status
      } else {
        setIsCheckedIn(false);
        localStorage.setItem("isCheckedIn", "false"); // Reset check-in status
      }
    } catch (error) {
      alert("Failed to get location.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-500 to-gray-800 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Attendance System
        </h1>
        <p className="text-center text-gray-500 mb-4">Mark your check-in and check-out with location</p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => handleInputChange(setName, "attendanceName", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Enter your designation"
            value={designation}
            onChange={(e) => handleInputChange(setDesignation, "attendanceDesignation", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex space-x-4">
            <button
              onClick={() => handleAttendance("check-in")}
              className={`w-full text-white py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
                isCheckedIn ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
              disabled={isCheckedIn}
            >
              ✅ Check In
            </button>
            <button
              onClick={() => handleAttendance("check-out")}
              className={`w-full text-white py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
                !isCheckedIn ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              }`}
              disabled={!isCheckedIn}
            >
              ⏳ Check Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
