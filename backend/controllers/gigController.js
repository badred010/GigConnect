import Gig from "../models/Gig.js";
import { cloudinary } from "../config/cloudinaryConfig.js";


// function to handle image uploads
const uploadImages = async (images) => {
  const uploadedImages = [];
  for (const image of images) {
    try {
      const result = await cloudinary.uploader.upload(image, {
        folder: "fiverr-clone/gigs",
        quality: "auto:low",
        fetch_format: "auto",
      });
      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  }
  return uploadedImages;
};

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Private/Seller
const createGig = async (req, res) => {
  const { title, description, category, price, deliveryTime, images } =
    req.body;

  if (req.user.role !== "seller" && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only sellers or admins can create gigs" });
  }

  const requiredFields = { title, description, category, price, deliveryTime };
  const missingFields = Object.entries(requiredFields)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Please fill all required fields: ${missingFields.join(", ")}`,
    });
  }

  // Validate price is a positive number
  if (isNaN(price) || parseFloat(price) <= 0) {
    return res.status(400).json({ message: "Price must be a positive number" });
  }

  try {
    let uploadedImages = [];
    if (images && images.length > 0) {
      uploadedImages = await uploadImages(images);
    }

    const gig = await Gig.create({
      seller: req.user._id,
      title,
      description,
      category,
      price: parseFloat(price),
      deliveryTime,
      images: uploadedImages,
    });

    res.status(201).json(gig);
  } catch (error) {
    console.error("Error creating gig:", error);
    res.status(500).json({
      message: error.message.includes("upload")
        ? "Image upload failed"
        : "Server error while creating gig",
      error: error.message,
    });
  }
};

// @desc    Get all gigs (with search/filter capabilities)
// @route   GET /api/gigs
// @access  Public
const getGigs = async (req, res) => {
  try {
    const { keyword, category, priceRange, sort } = req.query;
    const filter = {};

    if (keyword) {
      const keywordRegex = { $regex: keyword, $options: "i" };
      filter.$or = [
        { title: keywordRegex },
        { description: keywordRegex },
        { category: keywordRegex },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (priceRange) {
      const priceRangeString = priceRange;
      const priceFilterConditions = {};

      if (priceRangeString.endsWith("+")) {
        // Handle "200+" case (e.g., priceRange=200+)
        const minVal = parseFloat(priceRangeString.slice(0, -1));
        if (!isNaN(minVal)) {
          priceFilterConditions.$gte = minVal;
        }
      } else {
        // Handle "0-50", "50-100", "100-200" cases
        const [minPriceStr, maxPriceStr] = priceRangeString.split("-");
        const minVal = parseFloat(minPriceStr);
        const maxVal = parseFloat(maxPriceStr);

        if (!isNaN(minVal) && !isNaN(maxVal)) {
          priceFilterConditions.$gte = minVal;
          priceFilterConditions.$lte = maxVal;
        }
      }

      if (Object.keys(priceFilterConditions).length > 0) {
        filter.price = priceFilterConditions;
      }
    }

    const sortOptions = {};
    if (sort) {
      if (sort === "price-asc") sortOptions.price = 1;
      else if (sort === "price-desc") sortOptions.price = -1;
      else if (sort === "newest") sortOptions.createdAt = -1;
      else if (sort === "oldest") sortOptions.createdAt = 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const gigs = await Gig.find(filter)
      .populate("seller", "username profilePicture email")
      .sort(sortOptions);

    res.json(gigs);
  } catch (error) {
    console.error("Error fetching gigs:", error);
    res.status(500).json({
      message: "Server error while fetching gigs",
      error: error.message,
    });
  }
};

// @desc    Get single gig by ID
// @route   GET /api/gigs/:id
// @access  Public
const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate(
      "seller",
      "username profilePicture email"
    );

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.json(gig);
  } catch (error) {
    console.error("Error fetching gig:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Gig not found" });
    }
    res.status(500).json({
      message: "Server error while fetching gig",
      error: error.message,
    });
  }
};

// @desc    Update a gig
// @route   PUT /api/gigs/:id
// @access  Private/Seller
const updateGig = async (req, res) => {
  const { title, description, category, price, deliveryTime, images } =
    req.body;

  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (
      gig.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this gig" });
    }

    let uploadedImages = gig.images;
    if (images && images.length > 0) {
      // Delete old images from Cloudinary
      for (const img of gig.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
      // Upload new images
      uploadedImages = await uploadImages(images);
    }

    // Create an updates object
    const updates = {
      title: title || gig.title,
      description: description || gig.description,
      category: category || gig.category,
      deliveryTime: deliveryTime || gig.deliveryTime,
      images: uploadedImages,
    };

    // Only update price if provided and valid
    if (price !== undefined && !isNaN(price)) {
      updates.price = parseFloat(price);
      if (updates.price <= 0) {
        return res
          .status(400)
          .json({ message: "Price must be a positive number" });
      }
    } else {
      updates.price = gig.price;
    }

    Object.assign(gig, updates);
    const updatedGig = await gig.save();

    res.json(updatedGig);
  } catch (error) {
    console.error("Error updating gig:", error);
    res.status(500).json({
      message: "Server error while updating gig",
      error: error.message,
    });
  }
};

// @desc    Delete a gig
// @route   DELETE /api/gigs/:id
// @access  Private/Seller/Admin
const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (
      gig.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this gig" });
    }

    // Delete images from Cloudinary
    for (const image of gig.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await gig.deleteOne();
    res.json({ message: "Gig removed successfully" });
  } catch (error) {
    console.error("Error deleting gig:", error);
    res.status(500).json({
      message: "Server error while deleting gig",
      error: error.message,
    });
  }
};

// @desc    Get logged in user's gigs
// @route   GET /api/gigs/mygigs
// @access  Private/Seller
const getMyGigs = async (req, res) => {
  try {
    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to view this resource" });
    }

    const gigs = await Gig.find({ seller: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(gigs);
  } catch (error) {
    console.error("Error fetching user gigs:", error);
    res.status(500).json({
      message: "Server error while fetching user gigs",
      error: error.message,
    });
  }
};

export { createGig, getGigs, getGigById, updateGig, deleteGig, getMyGigs };
