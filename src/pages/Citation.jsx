import React from "react";
// import { useEffect } from "react";
// import { isAuthenticated } from "../services/authService";
// import { Navigate } from "react-routee";

function Citation() {

  // const navigate = useNavigate();


  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     navigate("/login");
  //   }
  // }, []);


  return (
    <div className="bg-white min-h-screen">
      {/* Seam-style border/shadow at the top */}
      <div className="w-full border-b border-gray-200 shadow-[0_2px_8px_0_rgba(0,0,0,0.03)] mb-8"></div>

      <div className="px-8 py-4 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Left Side */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Citation Evaluation</h1>
          <p className="text-gray-600 mb-6">
            Assess the credibility and relevance of your citations with our evaluation tool. Simply paste your citation below to receive a detailed analysis.
          </p>
          <textarea
            placeholder="Enter Your Citation Here..."
            className="w-full border rounded-md p-4 h-32 text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Evaluate
          </button>
        </div>

        {/* Right Side */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              The Impact of Social Media on Adolescent Mental Health
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              This study examines the correlation between social media usage and mental health outcomes in adolescents, finding a significant link between heavy social media use and increased rates of anxiety and depression.
            </p>
            <p className="text-gray-500 text-sm mt-1">Published in the Journal of Adolescent Psychology, 2022</p>
            <a href="#" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
              View Paper
            </a>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">Outdated</span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">Highly Recommended</span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">Weakly Cited</span>
          </div>

          {/* Download */}
          <div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition">
              Download Report
            </button>
          </div>

          {/* Citation Count Box */}
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-gray-500 text-sm">Citation Count</p>
            <p className="text-2xl font-bold text-gray-800">125</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Citation;