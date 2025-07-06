import React from "react";
import { Sparkles, Search, Bookmark, FileText } from "lucide-react";
import { Link } from "react-router";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5 py-10">
      <div className="max-w-6xl w-full text-center">
        {/* Website Name */}
        <h1 className="animate-typing text-xl sm:text-3xl md:text-4xl font-extrabold text-gray-700 mb-6 max-w-full">
          <span className="text-blue-800">IntelliCite</span>: Smarter Research
          Starts Here
        </h1>
        {/* Tagline */}
        <p className="text-lg sm:text-xl text-gray-600 mb-10">
          Discover, Evaluate, and Manage academic papers with AI. Your
          intelligent research companion.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Link to="/">
            <button className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg flex items-center transition">
              <Search className="w-5 h-5 mr-2" />
              Start Searching
            </button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mt-12">
          <FeatureCard
            icon={<Sparkles className="text-blue-800 w-6 h-6" />}
            title="AI Report"
            desc="Understand what each paper says and how it connects to your topic."
          />
          <FeatureCard
            icon={<Bookmark className="text-blue-800 w-6 h-6" />}
            title="Bookmark Papers"
            desc="Bookmark key papers and manage your research library easily."
          />
          <FeatureCard
            icon={<FileText className="text-blue-800 w-6 h-6" />}
            title="Citation Check"
            desc="Evaluate the credibility and relevance of papers using their DOI."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition duration-200">
      <div className="flex items-center mb-3">
        {icon}
        <h3 className="ml-3 text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
};

export default LandingPage;
