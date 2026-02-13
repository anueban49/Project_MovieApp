import React, { useState, useEffect } from "react";

const RealTimeClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);
  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");

  // const formattedTime = currentTime.toLocaleTimeString([], {
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  // });

  return (
    <div className="text-white">
      <h1
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontWeight: "700",
          fontSize: "4em",
          fontStyle: "revert",
        }}
        className="animate-pulse"
      >
        {" "}
        {hours}:{minutes}:
        <span >{seconds}</span>
      </h1>
    </div>
  );
};

export default RealTimeClock;
