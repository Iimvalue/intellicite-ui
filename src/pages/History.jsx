import FilterDropdown from "../components/filter-dropdown/FilterDropdown";
// import HistoryCard from "../components/history-card/HistoryCard";
import SearchBar from "../components/searchbar/SearchBar";
import Footer from "../components/footer/Footer";
import { useState, useEffect } from "react";
import { fetchUserHistory } from "../services/userHistoryService";

export default function History() {
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [historyItems, setHistoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // خيارات الفلترة حسب التاريخ
  const dateOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Last year', value: '1y' },
    { label: 'All time', value: 'all' }
  ];

  const footerNavigation = [
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' }
  ];

  // جلب بيانات السجل من السيرفر
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchUserHistory();
        setHistoryItems(data);
        setFilteredItems(data);
      } catch (err) {
        setError(err.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  // دالة البحث والفلترة مبدئياً على البيانات الموجودة في المتغير state
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = historyItems.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  // دالة فلترة حسب التاريخ (مثال مبسط)
  const handleDateFilter = (value) => {
    setSelectedDate(value);
    if (value === "all") {
      setFilteredItems(historyItems);
      return;
    }

    // احسب التاريخ المطلوب بناء على القيمة
    const now = new Date();
    let cutoffDate = new Date();
    if (value === "7d") cutoffDate.setDate(now.getDate() - 7);
    else if (value === "30d") cutoffDate.setDate(now.getDate() - 30);
    else if (value === "90d") cutoffDate.setDate(now.getDate() - 90);
    else if (value === "1y") cutoffDate.setFullYear(now.getFullYear() - 1);

    const filtered = historyItems.filter(item => {
      const itemDate = new Date(item.dateHistory);
      return itemDate >= cutoffDate;
    });

    setFilteredItems(filtered);
  };

  const handleDownload = (itemId) => {
    // حسب متطلبات التحميل، يمكن هنا استدعاء API أو فتح رابط
    console.log('Downloading item:', itemId);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-700">Loading history...</div>;

  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-40">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Filter */}
          <div className="w-full lg:w-80 lg:flex-shrink-0 order-2 lg:order-1">
            <FilterDropdown
              label="Filter"
              placeholder="Select an option"
              options={dateOptions}
              value={selectedDate}
              onValueChange={setSelectedDate}
              onFilter={handleDateFilter}
              filterButtonText="Filter"
              className="lg:sticky lg:top-4"
            />
          </div>

          {/* Right Content Area */}
          <div className="flex-1 space-y-6 sm:space-y-8 order-1 lg:order-2">
            {/* Search Bar */}
            <SearchBar
              placeholder="Search about your history"
              onSearch={handleSearch}
              onInputChange={setSearchQuery}
              initialValue={searchQuery}
              className="w-full"
            />

            {/* Results Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">History</h2>
              
              {/* History Items List */}
              {filteredItems.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {filteredItems.map((item) => (
                    <HistoryCard
                      key={item.id}
                      dateHistory={item.dateHistory}
                      title={item.title}
                      description={item.description}
                      onDownload={() => handleDownload(item.id)}
                      className="w-full"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No history found.</p>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-8 sm:mt-12">
                <button className="p-2 text-gray-400 hover:text-gray-600 touch-manipulation">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex space-x-1 sm:space-x-2">
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                        page === 1 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 touch-manipulation">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer navigation={footerNavigation} />
    </div>
  );
}