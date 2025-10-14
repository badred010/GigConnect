import { ShieldCheck } from "lucide-react";

export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto prose prose-purple lg:prose-xl bg-white p-8 md:p-12 rounded-xl shadow-2xl">
        <div className="not-prose text-center mb-10">
          <ShieldCheck className="mx-auto h-16 w-16 text-purple-600 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: June 8, 2025
          </p>
        </div>
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you
          create an account, post a gig, or communicate with us. This may
          include your name, email address, payment information, and any
          messages or files you send through our platform.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to: (a) provide, maintain, and
          improve our services; (b) process transactions and send related
          information; (c) communicate with you about products, services,
          offers, and events; (d) monitor and analyze trends, usage, and
          activities in connection with our services.
        </p>

        <h2>3. Information Sharing</h2>
        <p>
          We do not share your personal information with third parties except as
          described in this Privacy Policy. We may share information with
          vendors, consultants, and other service providers who need access to
          such information to carry out work on our behalf.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We take reasonable measures to help protect information about you from
          loss, theft, misuse, and unauthorized access, disclosure, alteration,
          and destruction.
        </p>

        <h2>5. Your Choices</h2>
        <p>
          You may update, correct, or delete information about you at any time
          by logging into your online account or emailing us at
          support@gigconnect.example.com. If you wish to delete or deactivate
          your account, please email us, but note that we may retain certain
          information as required by law or for legitimate business purposes.
        </p>
      </div>
    </div>
  );
};
