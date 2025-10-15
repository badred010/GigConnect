import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import useAuthStore from "./store/authStore";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import GigsListPage from "./pages/GigsListPage";
import GigDetailPage from "./pages/GigDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateGigPage from "./pages/CreateGigPage";
import ManageGigsPage from "./pages/ManageGigsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import SellerOrdersPage from "./pages/SellerOrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProfilePage from "./pages/ProfilePage";
import ConversationsPage from "./pages/ConversationsPage";
import ChatPage from "./pages/ChatPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import DisputeFormPage from "./pages/DisputeFormPage";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [pageProps, setPageProps] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userInfo, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const navigate = (page, props = {}) => {
    setCurrentPage(page);
    setPageProps(props);
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  };

  let pageComponent;
  switch (currentPage) {
    case "home":
      pageComponent = <HomePage navigate={navigate} />;
      break;
    case "gigs":
      pageComponent = <GigsListPage navigate={navigate} {...pageProps} />;
      break;
    case "gigDetail":
      pageComponent = <GigDetailPage navigate={navigate} {...pageProps} />;
      break;
    case "checkout":
      pageComponent = <CheckoutPage navigate={navigate} {...pageProps} />;
      break;
    case "orderSuccess":
      pageComponent = <OrderSuccessPage navigate={navigate} {...pageProps} />;
      break;
    case "login":
      pageComponent = <LoginPage navigate={navigate} {...pageProps} />;
      break;
    case "register":
      pageComponent = <RegisterPage navigate={navigate} />;
      break;
    case "createGig":
      pageComponent = <CreateGigPage navigate={navigate} {...pageProps} />;
      break;
    case "manageGigs":
      pageComponent = <ManageGigsPage navigate={navigate} />;
      break;
    case "myOrders":
      pageComponent = <MyOrdersPage navigate={navigate} />;
      break;
    case "sellerOrders":
      pageComponent = <SellerOrdersPage navigate={navigate} />;
      break;
    case "orderDetail":
      pageComponent = <OrderDetailPage navigate={navigate} {...pageProps} />;
      break;
    case "profile":
      pageComponent = <ProfilePage navigate={navigate} />;
      break;
    case "messages":
      pageComponent = <ConversationsPage navigate={navigate} />;
      break;
    case "chat":
      pageComponent = <ChatPage navigate={navigate} {...pageProps} />;
      break;
    case "about":
      pageComponent = <AboutPage navigate={navigate} />;
      break;
    case "contact":
      pageComponent = <ContactPage navigate={navigate} />;
      break;
    case "terms":
      pageComponent = <TermsOfServicePage navigate={navigate} />;
      break;
    case "privacy":
      pageComponent = <PrivacyPolicyPage navigate={navigate} />;
      break;
    case "admin":
      if (userInfo?.role === "admin") {
        pageComponent = <AdminDashboardPage navigate={navigate} />;
      } else {
        useEffect(() => {
          toast.error("Access Denied: You are not an administrator.");
          navigate("home");
        }, [navigate]);
        pageComponent = <HomePage navigate={navigate} />;
      }
      break;

    case "disputeOrder":
      pageComponent = <DisputeFormPage navigate={navigate} {...pageProps} />;
      break;

    default:
      pageComponent = <HomePage navigate={navigate} />;
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "8px", background: "#333", color: "#fff" },
          success: {
            duration: 2000,
            iconTheme: { primary: "#8b5cf6", secondary: "white" },
          },
          error: { duration: 4000 },
        }}
      />
      <Navbar
        navigate={navigate}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <main className={`flex-grow ${isMobileMenuOpen ? "pt-0" : ""}`}>
        {pageComponent}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
};

export default App;
