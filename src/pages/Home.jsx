import FilterDropdown from "../components/filter-dropdown/FilterDropdown";
import HomeCard from "../components/home-card/HomeCard";
import { useState } from "react";
import SearchBar from "../components/searchbar/SearchBar";
import Footer from "../components/footer/Footer";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for demonstration
  const dateOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Last year', value: '1y' },
    { label: 'All time', value: 'all' }
  ];


  const samplePapers = [
    {
      id: 1,
      relevancePercentage: 95,
      citationCount: 12333,
      title: "Deep Learning for Image Recognition",
      description: "A comprehensive study on the application of deep learning techniques in image recognition, exploring various architectures and their performance on benchmark datasets.",
      authors: ["Authors Name"],
      downloadable: true,
      initialSaved: false
    },
    {
      id: 2,
      relevancePercentage: 88,
      citationCount: 12333,
      title: "Reinforcement Learning for Robotics",
      description: "An investigation into the use of reinforcement learning algorithms for controlling robotic systems, focusing on applications in navigation and manipulation.",
      authors: ["Authors Name"],
      downloadable: false,
      initialSaved: true
    },
    {
      id: 3,
      relevancePercentage: 92,
      citationCount: 12333,
      title: "Natural Language Processing with Transformers",
      description: "An in-depth analysis of transformer models and their impact on natural language processing tasks, including machine translation and text summarization.",
      authors: ["Authors Name"],
      downloadable: true,
      initialSaved: false
    }
  ];

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Implement search logic
  };

  const handleDateFilter = (value) => {
    console.log('Filtering by date:', value);
    // Implement filter logic
  };

  const handleSavePaper = async (paperId) => {
    console.log('Saving paper:', paperId);
    // Implement save logic
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleDownload = (paperId) => {
    console.log('Downloading paper:', paperId);
    // Implement download logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-40">
        <div className="flex gap-8">
          {/* Left Sidebar - Filter */}
          <div className="w-80 flex-shrink-0">
            <FilterDropdown
              label="Filter"
              placeholder="Select an option"
              options={dateOptions}
              value={selectedDate}
              onValueChange={setSelectedDate}
              onFilter={handleDateFilter}
              filterButtonText="Filter"
            />
          </div>

          {/* Right Content Area */}
          <div className="flex-1 space-y-8">
            {/* Search Bar */}
            <SearchBar
              placeholder="Enter Your Research Topic"
              onSearch={handleSearch}
              onInputChange={setSearchQuery}
              initialValue={searchQuery}
            />

            {/* Results Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Results</h2>
              
              {/* Papers List */}
              <div className="space-y-6">
                {samplePapers.map((paper) => (
                  <HomeCard
                    key={paper.id}
                    relevancePercentage={paper.relevancePercentage}
                    citationCount={paper.citationCount}
                    title={paper.title}
                    description={paper.description}
                    authors={paper.authors}
                    downloadable={paper.downloadable}
                    initialSaved={paper.initialSaved}
                    onSavePaper={() => handleSavePaper(paper.id)}
                    onDownload={() => handleDownload(paper.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center space-x-2 mt-12">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${
                      page === 1 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





// import FilterDropdown from "../components/filter-dropdown/FilterDropdown";
// import HomeCard from "../components/home-card/HomeCard";
// import { useState } from "react";
// import SearchBar from "../components/searchbar/SearchBar";
// import Footer from "../components/footer/Footer";

// export default function Home() {
//   //   const [selectedDate, setSelectedDate] = useState("");

//   //   const dateOptions = [
//   //     { label: "Last 7 days", value: "7d" },
//   //     { label: "Last 30 days", value: "30d" },
//   //     { label: "Last 90 days", value: "90d" },
//   //     { label: "Last year", value: "1y" },
//   //   ];

//   //   const handleDateFilter = (value) => {
//   //     console.log("Filtering by date:", value);
//   //     // Send to server or apply filter logic
//   //   };

//   // const [query, setQuery] = useState("");

//   // const handleSearch = (searchTerm) => {
//   //   console.log("Searching for:", searchTerm);
//   //   // Send to server or perform search logic
//   // };

//   // const handleInputChange = (value) => {
//   //   console.log("Input changed:", value);
//   //   // Optional: Real-time search or validation
//   // };

//   const footerNavigation = [
//     { label: "About", path: "/about" },
//     { label: "Contact", path: "/contact" },
//     { label: "Terms of Service", path: "/terms" },
//     { label: "Privacy Policy", path: "/privacy" },
//   ];

//   return (
//     <>
//       <div>
//         {/* Your main content */}

//         <Footer
//           navigationItems={footerNavigation}
//           copyrightText="© 2025 IntelliCite. All rights reserved."
//         />
//       </div>

//       {/* <div className="p-8">
//         <SearchBar
//           placeholder="Enter Your Research Topic"
//           onSearch={handleSearch}
//           onInputChange={handleInputChange}
//           initialValue=""
//           className="mb-8"
//         />

//         <SearchBar
//           placeholder="Search papers, authors, or keywords..."
//           onSearch={(term) => console.log("Custom search:", term)}
//           className="mb-4"
//         />
//       </div> */}

//       {/* <div className="space-y-6">
//         <FilterDropdown
//           label="Date"
//           placeholder="Select an option"
//           options={dateOptions}
//           value={selectedDate}
//           onValueChange={setSelectedDate}
//           onFilter={handleDateFilter}
//           filterButtonText="Filter"
//         />

//       </div> */}

//       {/* <HomeCard
//         relevancePercentage={95}
//         citationCount={12333}
//         title="Deep Learning for Image Recognition"
//         description="A comprehensive study on the application of deep learning techniques in image recognition, exploring various architectures and their performance on benchmark datasets."
//         authors={["John Smith", "Jane Doe", "Alex Johnson"]}
//         downloadable={true}
//         onSavePaper={() => {
//           // Your save logic here
//           console.log("Saving paper...");
//           return Promise.resolve();
//         }}
//         onDownload={() => {
//           // Your download logic here
//           console.log("Downloading paper...");
//         }}
//       />
//       <HomeCard
//         relevancePercentage={87}
//         citationCount={5420}
//         title="Machine Learning in Healthcare"
//         description="An analysis of machine learning applications in healthcare systems."
//         authors={["Dr. Sarah Wilson"]}
//         downloadable={false}
//         onSavePaper={() => console.log("Saving...")}
//       /> */}
//     </>
//   );
// }



