import { Mail, Phone, MapPin } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";

export const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Mail className="mx-auto h-16 w-16 text-purple-600 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            We'd love to hear from you! Reach out with any questions or
            feedback.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-600">
                Our team is here to help. Contact us through any of the channels
                below.
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Email</h3>
                <p className="text-gray-600">support@gigconnect.example.com</p>
                <p className="text-gray-600">press@gigconnect.example.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Phone</h3>
                <p className="text-gray-600">+212 624114569</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Office</h3>
                <p className="text-gray-600">
                  123 Freelance Ave, Suite 100
                  <br />
                  Agadir City, 54321
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              Send a Message
            </h2>
            <form className="space-y-4">
              <Input
                label="Your Name"
                name="name"
                placeholder="John Doe"
                required
              />
              <Input
                label="Your Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
              />
              <Input
                label="Message"
                type="textarea"
                name="message"
                placeholder="Your message..."
                required
                rows={5}
              />
              <Button type="submit" variant="primary" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
