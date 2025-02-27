"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [showBackgroundVideo, setShowBackgroundVideo] = useState(false); // State to track transition
  const [loading, setLoading] = useState(false); // Loading state
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!city && (!latitude || !longitude)) return;

    setLoading(true); // Show loading animation

    try {
      // Simulate API call to backend (replace with actual backend API)
      const response = await fetch(`/api/predict?city=${city}&latitude=${latitude}&longitude=${longitude}`);
      const data = await response.json();

      // Navigate to results page with prediction data
      router.push(`/result?city=${city}&latitude=${latitude}&longitude=${longitude}&confidence=${data.confidence}&status=${data.status}`);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false); // Hide loading animation
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Intro Video - Plays Once */}
      {!showBackgroundVideo && (
        <video 
          autoPlay 
          muted 
          className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000"
          onEnded={() => setShowBackgroundVideo(true)} // Switch to background video after playing once
        >
          <source src="/intro-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Background Video - Loops after intro video finishes */}
      {showBackgroundVideo && (
        <video 
          autoPlay 
          loop 
          muted 
          className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 opacity-100"
        >
          <source src="/background-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Logo in Top-Left (Circular) */}
      <div className="absolute top-6 left-6">
        <Image src="/logo.png" alt="GeoPredict Logo" width={80} height={80} className="rounded-full border-4 border-white shadow-lg" />
      </div>

      {/* Glassmorphism Form Container */}
      <div className="relative bg-white/15 backdrop-blur-2xl text-white p-10 rounded-2xl shadow-2xl w-[600px] border border-white/30 transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-bold text-center mb-6">GeoPredict</h1>
        <p className="text-center text-white/80 mb-6">Enter city details to analyze</p>

        {/* City Input */}
        <input type="text" placeholder="Enter City Name" className="w-full p-4 bg-white/20 border border-white/30 rounded-lg mb-3 focus:ring-2 focus:ring-white text-white placeholder-white/60"
          value={city} onChange={(e) => setCity(e.target.value)}
        />

        {/* OR Divider */}
        <div className="text-center text-white/80 my-3 font-semibold text-lg">OR</div>

        {/* Latitude & Longitude Inputs */}
        <div className="flex space-x-4">
          <input type="text" placeholder="Latitude" className="w-1/2 p-4 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white text-white placeholder-white/60"
            value={latitude} onChange={(e) => setLatitude(e.target.value)}
          />
          <input type="text" placeholder="Longitude" className="w-1/2 p-4 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white text-white placeholder-white/60"
            value={longitude} onChange={(e) => setLongitude(e.target.value)}
          />
        </div>

        {/* Analyze Button - Only Enabled if Either City Name or Latitude/Longitude is Entered */}
        <button 
          onClick={handleAnalyze} 
          disabled={loading || (!city && (!latitude || !longitude))}
          className={`w-full mt-8 flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-full text-xl font-semibold transition-all duration-300 shadow-lg ${
            loading || (!city && (!latitude || !longitude)) 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:shadow-blue-500/50 hover:scale-105 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 focus:ring-4 focus:ring-blue-400"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-white/80 text-sm">
        © {new Date().getFullYear()} GeoPredict. All rights reserved.
      </footer>
    </div>
  );
}
