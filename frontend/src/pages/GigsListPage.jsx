import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Search } from "lucide-react";
import apiService from "../services/apiService"; 
import GigCard from "../components/GigCard";
import Button from "../components/Button";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";

const GigsListPage = ({ navigate, initialSearchTerm = "" }) => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const categories = [
    "Web Development",
    "Graphic Design",
    "Writing",
    "Digital Marketing",
    "Video Editing",
    "Music & Audio",
    "Programming & Tech",
    "Other", 
  ];

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setLoading(true);
        const params = {}; 

        
        if (searchTerm) {
          params.keyword = searchTerm;
        }
        
        if (category) {
          params.category = category;
        }
       
        if (priceRange) {
          params.priceRange = priceRange;
        }

        
        const data = await apiService.getGigs(params);
        setGigs(data);
      } catch (error) {
        
        toast.error(error.response?.data?.message || error.message || "Could not fetch gigs.");
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, [searchTerm, category, priceRange]); 

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-8 text-center">
          Explore Services
        </h1>

        <div className="mb-10 p-6 bg-white rounded-xl shadow-lg">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end"
          >
            <Input
              label="Search Gigs"
              type="search"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., modern logo design"
              className="md:col-span-2 !mb-0" 
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full md:w-auto"
            >
              <Search className="w-5 h-5 mr-2" /> Search
            </Button>
          </form>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
           
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-lg shadow-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

           
            <div>
              <label
                htmlFor="priceRange"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price Range
              </label>
              <select
                id="priceRange"
                name="priceRange"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-lg shadow-sm"
              >
                <option value="">Any Price</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200+">$200+</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : gigs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} navigate={navigate} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-xl py-10">
            No gigs found matching your criteria. Try adjusting your search or
            filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default GigsListPage;