const Footer = ({ navigate }) => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-purple-400 mb-4">
              GigConnect
            </h3>
            <p className="text-sm">
              Your one-stop platform for freelance services. Find talent or
              offer your skills to the world.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate("about")}
                  className="hover:text-purple-300 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("contact")}
                  className="hover:text-purple-300 transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("terms")}
                  className="hover:text-purple-300 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("privacy")}
                  className="hover:text-purple-300 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-4">
              Connect With Us
            </h3>
            <p className="text-sm">support@gigconnect.gmail.com</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} GigConnect. All rights reserved.
            Crafted with <span className="text-purple-400">&hearts;</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
