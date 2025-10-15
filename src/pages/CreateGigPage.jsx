import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { X, UploadCloud } from "lucide-react";
import apiService from "../services/apiService";
import useAuthStore from "../store/authStore";
import Button from "../components/Button";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";

const CreateGigPage = ({ navigate, gigId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { userInfo, isAuthenticated } = useAuthStore();

  const MAX_IMAGES = 3;

  useEffect(() => {
    if (
      !isAuthenticated ||
      (userInfo?.role !== "seller" && userInfo?.role !== "admin")
    ) {
      toast.error(
        "You must be a logged-in seller or admin to access this page."
      );
      navigate("login");
      return;
    }

    if (gigId) {
      setIsEditMode(true);
      setPageLoading(true);
      const fetchGigData = async () => {
        try {
          const data = await apiService.getGigById(gigId);

          if (data.seller._id !== userInfo._id && userInfo.role !== "admin") {
            toast.error("You are not authorized to edit this gig.");
            navigate("manageGigs");
            return;
          }
          setTitle(data.title);
          setDescription(data.description);
          setCategory(data.category);
          setPrice(data.price.toString());
          setDeliveryTime(data.deliveryTime.toString());

          setImagePreviews(data.images.map((img) => img.url));
          setImages([]);
        } catch (error) {
          toast.error(
            error.message || "Failed to load gig data. Redirecting..."
          );
          navigate("manageGigs");
        } finally {
          setPageLoading(false);
        }
      };
      fetchGigData();
    } else {
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
      setDeliveryTime("");
      setImages([]);
      setImagePreviews([]);
      setIsEditMode(false);
    }
  }, [isAuthenticated, userInfo, navigate, gigId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const currentImageCount = isEditMode ? 0 : imagePreviews.length;

    if (files.length + currentImageCount > MAX_IMAGES) {
      toast.error(
        `You can upload a maximum of ${MAX_IMAGES} images. ${
          isEditMode
            ? "Uploading new images will replace all current ones."
            : ""
        }`
      );
      e.target.value = null;
      return;
    }

    const newImageBase64s = [];
    const newImagePreviewUrls = [];

    if (isEditMode) {
      setImages([]);
      setImagePreviews([]);
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImageBase64s.push(reader.result);
        newImagePreviewUrls.push(reader.result);

        if (newImageBase64s.length === files.length) {
          setImages((prev) =>
            isEditMode ? [...newImageBase64s] : [...prev, ...newImageBase64s]
          );
          setImagePreviews((prev) =>
            isEditMode
              ? [...newImagePreviewUrls]
              : [...prev, ...newImagePreviewUrls]
          );
        }
      };
      reader.onerror = () => {
        toast.error("Error reading file.");
      };
      reader.readAsDataURL(file);
    });
    e.target.value = null;
  };

  const removeImage = (indexToRemove) => {
    const previewToRemove = imagePreviews[indexToRemove];

    if (previewToRemove.startsWith("data:image")) {
      const imageBase64Index = images.findIndex(
        (imgBase64) => imgBase64 === previewToRemove
      );
      if (imageBase64Index > -1) {
        setImages((prev) => prev.filter((_, i) => i !== imageBase64Index));
      }
    }

    setImagePreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category || !price || !deliveryTime) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!isEditMode && images.length === 0) {
      toast.error("Please upload at least one image for your new gig.");
      return;
    }
    if (parseFloat(price) < 1) {
      toast.error("Price must be at least $1.");
      return;
    }
    if (parseInt(deliveryTime) < 1) {
      toast.error("Delivery time must be at least 1 day.");
      return;
    }

    setLoading(true);
    try {
      const gigData = {
        title,
        description,
        category,
        price: parseFloat(price),
        deliveryTime: parseInt(deliveryTime),
      };

      if (images.length > 0) {
        gigData.images = images;
      }

      if (isEditMode) {
        await apiService.updateGig(gigId, gigData, userInfo.token);
        toast.success("Gig updated successfully!");
      } else {
        await apiService.createGig(gigData, userInfo.token);
        toast.success("Gig created successfully!");
      }
      navigate("manageGigs");
    } catch (error) {
      toast.error(
        error.message || `Failed to ${isEditMode ? "update" : "create"} gig.`
      );
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Web Development",
    "Graphic Design",
    "Writing & Translation",
    "Digital Marketing",
    "Video & Animation",
    "Music & Audio",
    "Programming & Tech",
    "Business",
    "Lifestyle",
    "Other",
  ];

  if (pageLoading) {
    return <LoadingSpinner message="Loading gig details..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-purple-700 mb-8 text-center">
          {isEditMode ? "Edit Your Gig" : "Create a New Gig"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Gig Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., I will design a stunning modern logo"
            required
          />

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description<span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your service in detail..."
              rows="5"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-colors"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category<span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-lg shadow-sm"
            >
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Price ($)"
              type="number"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 50"
              required
              min="1"
              step="0.01"
            />
            <Input
              label="Delivery Time (Days)"
              type="number"
              name="deliveryTime"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              placeholder="e.g., 3"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gig Images (up to {MAX_IMAGES})
              <span className="text-red-500">*</span>
              {isEditMode &&
                imagePreviews.length > 0 &&
                images.length === 0 && (
                  <span className="text-xs text-gray-500 ml-2">
                    Current images will be kept unless new ones are uploaded.
                  </span>
                )}
              {isEditMode && images.length > 0 && (
                <span className="text-xs text-blue-600 ml-2">
                  New images will replace all existing ones upon saving.
                </span>
              )}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-purple-400 transition-colors">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500 px-1"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleImageChange}
                      disabled={
                        imagePreviews.length >= MAX_IMAGES && !isEditMode
                      }
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
            </div>
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="h-32 w-full object-cover rounded-md shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-75 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-700"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full text-lg py-3"
            disabled={loading || pageLoading}
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : isEditMode ? (
              "Save Changes"
            ) : (
              "Create Gig"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
export default CreateGigPage;
