import { Building, Users, Target } from "lucide-react";

export const AboutPage = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Building className="mx-auto h-16 w-16 text-purple-600 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            About GigConnect
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Connecting talent with opportunity, one gig at a time.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 space-y-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 text-center">
              <Users className="h-20 w-20 text-yellow-500 mx-auto" />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-purple-700 mb-3">
                Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to create a dynamic and reliable online
                marketplace where talented freelancers can showcase their skills
                and businesses can find the perfect professional for any
                project. We aim to break down barriers, foster collaboration,
                and empower economic growth for individuals and companies
                worldwide.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-10 flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/3 text-center">
              <Target className="h-20 w-20 text-yellow-500 mx-auto" />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-purple-700 mb-3">
                Our Vision
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We envision a world where freelance work is more accessible,
                secure, and rewarding. GigConnect strives to be the most trusted
                platform for freelance services, known for our commitment to
                quality, user success, and innovation in the ever-evolving gig
                economy. We believe in the power of connection to turn great
                ideas into reality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
