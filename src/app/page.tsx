"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [showBackgroundImage, setShowBackgroundImage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Automatically switch to background image after 5 seconds
    const timer = setTimeout(() => {
      setShowBackgroundImage(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleAnalyze = () => {
    if (!city && (!latitude || !longitude)) return;
    router.push(`/result?city=${city}&latitude=${latitude}&longitude=${longitude}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Video Background */}
      {!showBackgroundImage && (
        <video
          autoPlay
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
      )}

      {/* Fading Background Image */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
          showBackgroundImage ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url('/background-image.jpg')` }}
      />

      {/* Logo in Top-Left (Larger and Circular) */}
      <div className="absolute top-6 left-6">
        <Image
          src="/logo.png"
          alt="GeoPredict Logo"
          width={80}
          height={80}
          className="rounded-full border-4 border-white shadow-lg"
        />
      </div>

      {/* Modern Glassmorphism Form Container (Increased Size) */}
      <div className="relative bg-white/15 backdrop-blur-2xl text-white p-12 rounded-2xl shadow-2xl w-[600px] border border-white/30 
        transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-bold text-center mb-6">GeoPredict</h1>
        <p className="text-center text-white/80 mb-6">Enter city details to analyze</p>

        {/* City Input */}
        <input
          type="text"
          placeholder="Enter City Name"
          className="w-full p-5 bg-white/20 border border-white/30 rounded-lg mb-4 focus:ring-2 focus:ring-white text-white placeholder-white/60"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        {/* OR Divider */}
        <div className="text-center text-white/80 my-3 font-semibold text-lg">OR</div>

        {/* Latitude & Longitude Inputs */}
        <div className="flex space-x-6">
          <input
            type="text"
            placeholder="Latitude"
            className="w-1/2 p-5 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white text-white placeholder-white/60"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
          <input
            type="text"
            placeholder="Longitude"
            className="w-1/2 p-5 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white text-white placeholder-white/60"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>

        {/* Elegant Analyze Button with Glow Effect */}
        <button
          onClick={handleAnalyze}
          className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-5 rounded-full text-xl font-semibold 
          transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105 
          hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 focus:ring-4 focus:ring-blue-400"
        >
          Analyze
        </button>
      </div>

      {/* Footer Section */}
      <footer className="absolute bottom-4 text-white/80 text-sm">
        © {new Date().getFullYear()} GeoPredict. All rights reserved.
      </footer>
    </div>
  );
}
