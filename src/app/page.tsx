"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [showBackgroundVideo, setShowBackgroundVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState(""); // Input validation error
  const router = useRouter();

  const BACKEND_URL = "http://localhost:8000"; // Replace with actual backend URL

  const validateInputs = () => {
    if (city && (latitude || longitude)) {
      setError("Please enter either a city name or latitude and longitude, not both.");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleAnalyze = async () => {
    if (!validateInputs() || (!city && (!latitude || !longitude))) return;

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, latitude, longitude }),
      });

      if (!response.ok) throw new Error("Failed to fetch prediction data.");

      const data = await response.json();

      router.push(`/result?city=${city}&latitude=${latitude}&longitude=${longitude}&confidence=${data.confidence}&status=${data.status}&temperature=${data.temperature}&humidity=${data.humidity}&wind_speed=${data.wind_speed}&rainfall=${data.rainfall}&air_quality=${data.air_quality}&pressure=${data.pressure}&uv_index=${data.uv_index}&visibility=${data.visibility}`);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Intro Video - Plays Once */}
      {!showBackgroundVideo && (
        <video autoPlay muted className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000"
          onEnded={() => setShowBackgroundVideo(true)}
        >
          <source src="/intro-video.mp4" type="video/mp4" />
        </video>
      )}

      {/* Background Video - Loops after intro video finishes */}
      {showBackgroundVideo && (
        <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 opacity-100">
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
      )}

      {/* Logo in Top-Left */}
      <div className="absolute top-6 left-6">
        <Image src="/logo.png" alt="GeoPredict Logo" width={80} height={80} className="rounded-full border-4 border-white shadow-lg" />
      </div>

      {/* Glassmorphism Form Container */}
      <div className="relative bg-white/10 backdrop-blur-lg text-white p-12 rounded-2xl shadow-2xl w-[650px] border border-white/20 transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-bold text-center mb-6">GeoPredict</h1>
        <p className="text-center text-white/80 mb-6">Enter city details to analyze</p>

        {/* City Input */}
        <input type="text" placeholder="Enter City Name" className="w-full p-4 bg-white/10 border border-white/20 rounded-lg mb-3 focus:ring-2 focus:ring-white text-white placeholder-white/60"
          value={city} onChange={(e) => {
            setCity(e.target.value);
            setLatitude("");
            setLongitude("");
            validateInputs();
          }}
        />

        {/* OR Divider */}
        <div className="text-center text-white/80 my-3 font-semibold text-lg">OR</div>

        {/* Latitude & Longitude Inputs */}
        <div className="flex space-x-4">
          <input type="text" placeholder="Latitude" className="w-1/2 p-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white text-white placeholder-white/60"
            value={latitude} onChange={(e) => {
              setLatitude(e.target.value);
              setCity(""); 
              validateInputs();
            }}
          />
          <input type="text" placeholder="Longitude" className="w-1/2 p-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white text-white placeholder-white/60"
            value={longitude} onChange={(e) => {
              setLongitude(e.target.value);
              setCity(""); 
              validateInputs();
            }}
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        {/* Analyze Button */}
        <button onClick={handleAnalyze} disabled={loading || error || (!city && (!latitude || !longitude))}
          className={`w-full mt-8 flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-full text-xl font-semibold transition-all duration-300 shadow-lg ${
            loading || error || (!city && (!latitude || !longitude)) 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:shadow-blue-500/50 hover:scale-105 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 focus:ring-4 focus:ring-blue-400"
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin mr-3"></div>
              Analyzing...
            </>
          ) : (
            "Analyze"
          )}
        </button>
      </div>

      {/* Full-Page Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-semibold text-gray-800">Analyzing data...</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="absolute bottom-4 text-white/80 text-sm">
        © {new Date().getFullYear()} GeoPredict. All rights reserved.
      </footer>
    </div>
  );
}
