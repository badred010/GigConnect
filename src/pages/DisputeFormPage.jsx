import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ShieldAlert, Upload, File, X } from "lucide-react";
import apiService from "../services/apiService";
import useAuthStore from "../store/authStore";
import Button from "../components/Button";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";

const DisputeFormPage = ({ navigate, orderId }) => {
  const [reason, setReason] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userInfo, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to submit a dispute.");
      navigate("login");
    }
    if (!orderId) {
      toast.error("No order specified for dispute.");
      navigate(-1);
    }
  }, [isAuthenticated, orderId, navigate]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + evidenceFiles.length > 5) {
      toast.error("You can upload a maximum of 5 files.");
      return;
    }
    setEvidenceFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (indexToRemove) => {
    setEvidenceFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const convertFilesToBase64 = async (files) => {
    const filePromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    });
    return await Promise.all(filePromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a detailed reason for the dispute.");
      return;
    }

    setLoading(true);
    try {
      const evidenceBase64 = await convertFilesToBase64(evidenceFiles);
      const disputeData = {
        reason,
        evidence: evidenceBase64,
      };

      await apiService.raiseDispute(orderId, disputeData, userInfo.token);

      toast.success(
        "Dispute submitted successfully. An admin will review it shortly."
      );
      navigate("orderDetail", { orderId });
    } catch (error) {
      toast.error(error.message || "Failed to submit dispute.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-2xl border-t-4 border-red-500">
        <div className="text-center mb-8">
          <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4">
            Raise a Dispute
          </h1>
          <p className="mt-2 text-gray-600">
            Please provide details about the issue. An admin will review your
            case.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Reason for Dispute"
            type="textarea"
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain the problem in detail. E.g., 'The delivered work does not match the agreed requirements because...'"
            rows={8}
            required
            className="!mb-0"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attach Evidence (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  Images, PDFs, ZIP files up to 5MB each
                </p>
              </div>
            </div>
          </div>

          {evidenceFiles.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700">
                Selected files:
              </p>
              <ul className="mt-2 space-y-2">
                {evidenceFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
                  >
                    <div className="flex items-center text-sm text-gray-800">
                      <File className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="truncate max-w-xs">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("orderDetail", { orderId })}
            >
              Cancel
            </Button>
            <Button type="submit" variant="danger" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : "Submit Dispute"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisputeFormPage;
