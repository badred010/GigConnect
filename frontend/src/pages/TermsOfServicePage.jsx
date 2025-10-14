import { FileText } from "lucide-react";

export const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto prose prose-purple lg:prose-xl bg-white p-8 md:p-12 rounded-xl shadow-2xl">
        <div className="not-prose text-center mb-10">
          <FileText className="mx-auto h-16 w-16 text-purple-600 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: June 8, 2025
          </p>
        </div>
        <h2>1. Introduction</h2>
        <p>
          Welcome to GigConnect! These Terms of Service ("Terms") govern your
          use of our website and services. By accessing or using our platform,
          you agree to be bound by these Terms.
        </p>

        <h2>2. User Accounts</h2>
        <p>
          To access most features, you must register for an account. You agree
          to provide accurate, current, and complete information during the
          registration process. You are responsible for safeguarding your
          password and for all activities that occur under your account.
        </p>

        <h2>3. Gig Postings and Orders</h2>
        <p>
          Sellers are responsible for the accuracy and legality of the services
          they offer. Buyers agree to provide clear requirements and timely
          feedback. All transactions are processed through our secure payment
          system. GigConnect reserves a commission on each completed order.
        </p>

        <h2>4. Code of Conduct</h2>
        <p>
          You agree not to engage in any of the following prohibited activities:
          (a) violating any laws; (b) posting any false, misleading, or
          fraudulent content; (c) harassing, threatening, or spamming other
          users; (d) distributing viruses or any other harmful computer code.
        </p>

        <h2>5. Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior
          notice or liability, for any reason whatsoever, including without
          limitation if you breach the Terms. Upon termination, your right to
          use the Service will immediately cease.
        </p>
      </div>
    </div>
  );
};
