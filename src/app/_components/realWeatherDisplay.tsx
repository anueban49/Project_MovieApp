"use client";
import React, { useState, useEffect } from "react";

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=cb0a778e1efb43b68c601328250312&q=Ulaanbaatar&aqi=no`
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error("Error fetching weather:", err);
      }
    };

    fetchWeather();
  }, []);

  if (!weather) return <p>Loading weather...</p>;

  return (
    <div
      className="text-white p-4 rounded-lg animate-out"
      style={{
        fontFamily: "Orbitron, sans-serif",
      }}
    >
      <h2
        style={{
          fontWeight: "700",
          fontSize: "1em",
        }}
      >
        Weather in {weather.location.name}
      </h2>
      <p className="text-white">🌡 Temp: {weather.current.temp_c} °C</p>
      <p>💨 Wind: {weather.current.wind_kph} kph</p>
      <p>☁️ Condition: {weather.current.condition.text}</p>
      <img
        src={weather.current.condition.icon}
        alt={weather.current.condition.text}
        className="mt-2"
      />
    </div>
  );
};

export default WeatherWidget;
