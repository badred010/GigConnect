import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Search, ShoppingCart, Star, ArrowRight } from "lucide-react";
import apiService from "../services/apiService";
import GigCard from "../components/GigCard";
import Button from "../components/Button";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage = ({ navigate }) => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setLoading(true);
        const data = await apiService.getGigs({ limit: 6 });
        setGigs(data);
      } catch (error) {
        toast.error(error.message || "Could not fetch featured gigs.");
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearching(true);

      setTimeout(() => {
        navigate("gigs", { initialSearchTerm: searchTerm });
      }, 300);
    } else {
      toast.error("Please enter a search term.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100">
      <section className="py-20 md:py-32 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Find Top <span className="text-yellow-400">Freelance</span> Services
          </h1>
          <p className="text-lg sm:text-xl text-purple-200 mb-10 max-w-2xl mx-auto">
            Connect with talented freelancers for your projects. Quality work,
            delivered on time.
          </p>
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center space-x-2 sm:space-x-3"
          >
            <Input
              type="search"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="E.g., modern website design, voice over..."
              className="flex-grow !mb-0"
              disabled={isSearching}
            />
            <Button
              type="submit"
              variant="secondary"
              className="text-lg font-semibold px-5 py-3"
              disabled={isSearching}
            >
              {isSearching ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2 hidden sm:inline-block" />
                  Search
                </>
              )}
            </Button>
          </form>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
            Featured Services
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner message="Loading services..." />
            </div>
          ) : gigs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {gigs.map((gig) => (
                <GigCard key={gig._id} gig={gig} navigate={navigate} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg py-10">
              No featured gigs available at the moment. Check back soon!
            </p>
          )}
          <div className="text-center mt-16">
            <Button
              onClick={() => navigate("gigs")}
              variant="primary"
              className="text-lg px-8 py-3 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-150 ease-in-out"
            >
              Explore All Services
              <ArrowRight className="w-5 h-5 ml-2 inline-block" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            How <span className="text-purple-600">FreelancePro</span> Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 text-center">
            <div className="p-6 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5 border-4 border-white shadow-md">
                <Search className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                1. Discover
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Browse through a wide variety of freelance services offered by
                talented individuals. Use our powerful search to find exactly
                what you need.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5 border-4 border-white shadow-md">
                <ShoppingCart className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                2. Order Securely
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Select the gig that fits your needs, provide your requirements,
                and securely place your order with our easy checkout process.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5 border-4 border-white shadow-md">
                <Star className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                3. Approve & Rate
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Once the work is delivered, review it, approve, and share your
                experience by rating the freelancer. Help build our community!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
