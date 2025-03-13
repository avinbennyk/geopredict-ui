"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArcElement,
  Chart as ChartJS,
  Tooltip,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

interface ClimateDetail {
  title: string;
  value: string;
  icon: string;
}

export default function Result() {
  const router = useRouter();
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [climateDetails, setClimateDetails] = useState<ClimateDetail[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const data = localStorage.getItem("data");
    if (data) {
      const { prediction, confidence, weather_details } = JSON.parse(data);
      setPrediction(prediction);
      setConfidence(confidence);
      setClimateDetails([
        {
          title: "Temperature",
          value: `${weather_details.temperature || "--"}°C`,
          icon: "/icons/temperature.jpg",
        },
        {
          title: "Humidity",
          value: `${weather_details.humidity || "--"}%`,
          icon: "/icons/humidity.png",
        },
        {
          title: "Wind Speed",
          value: `${weather_details.wind_speed || "0"} km/h`,
          icon: "/icons/wind.png",
        },
        {
          title: "Rainfall",
          value: `${weather_details.rainfall || "0"} mm`,
          icon: "/icons/rainfall.png",
        },
        { title: "Air Quality", value: "Good", icon: "/icons/air.jpg" },
        {
          title: "Pressure",
          value: `${weather_details.pressure || "--"} hPa`,
          icon: "/icons/pressure.jpg",
        },
        { title: "UV Index", value: "Good", icon: "/icons/uv.png" },
        {
          title: "Visibility",
          value: `${weather_details.visibility || "--"} km`,
          icon: "/icons/visibility.png",
        },
      ]);
    }
    setLoading(false);
  }, []);


  if (loading && !confidence) {
    return <div>loading....</div>;
  }

  
  const confidencePercentage = confidence * 100; // Convert confidence to percentage

  const data: ChartData<"doughnut"> = {
    datasets: [
      {
        data: [confidencePercentage, 100 - confidencePercentage],
        backgroundColor: ["#4CAF50", "#FF3D00"],
        borderWidth: 0,
        rotation: 270,
        cutout: "80%",
        circumference: 180,
      },
    ],
  };
  const needlePlugin = {
    id: "needle",
    beforeDraw(chart: any) {
      const { ctx, chartArea } = chart;
      const centerX = chartArea.left + chartArea.width / 2;
      const centerY = chartArea.bottom - 40;
      console.log(confidence,"con")
      const angle = Math.PI * (1-confidence)
      console.log(angle);
      const needleLength = chartArea.height / 2.5;
      const needleX = centerX + needleLength * Math.cos(angle);
      const needleY = centerY - needleLength * Math.sin(angle);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(needleX, needleY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.restore();
    },
  };
  const options: ChartOptions<"doughnut"> = {
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-6 left-6">
        <Image
          src="/logo.png"
          alt="GeoPredict Logo"
          width={70}
          height={70}
          className="rounded-full border-4 border-white shadow-lg"
        />
      </div>
      <div className="relative bg-white/15 backdrop-blur-2xl text-white p-8 rounded-2xl shadow-2xl w-[750px] border border-white/30 transition-all duration-300 hover:scale-105">
        <h1 className="text-3xl font-bold text-center">Analysis Result</h1>
        <p
          className={`text-center text-3xl font-semibold mt-2 ${
            prediction === "Landslide" ? "text-red-500" : "text-green-400"
          }`}
        >
          {prediction}
        </p>
        <div className="relative w-44 mx-auto mt-6 transition-all duration-300 hover:scale-105">
          <Doughnut data={data} options={options} plugins={[needlePlugin]} />
          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold">
            {confidencePercentage}%
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {climateDetails.map((detail, index) => (
            <div
              key={index}
              className="bg-white/20 p-4 rounded-lg flex flex-col items-center space-y-2 border border-white/30 transition-all duration-300 hover:scale-105"
            >
              <Image
                src={detail.icon}
                alt={detail.title}
                width={40}
                height={40}
                className="rounded-md"
              />
              <h2 className="font-semibold text-center text-sm">
                {detail.title}
              </h2>
              <p className="text-lg">{detail.value}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            router.push("/");
            localStorage.removeItem("data");
          }}
          className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 focus:ring-4 focus:ring-blue-400"
        >
          Go Back
        </button>
      </div>
      <footer className="absolute bottom-4 text-white/80 text-sm">
        © {new Date().getFullYear()} GeoPredict. All rights reserved.
      </footer>
    </div>
  );
}
