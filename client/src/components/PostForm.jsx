import React, { useState, useEffect } from "react";
import { FaImage, FaTimes, FaSpinner } from "react-icons/fa";
import api from "../api/api";

const PostForm = ({ post, onPostCreated, onPostUpdated, onClose }) => {
  const [formData, setFormData] = useState({
    petName: "",
    category: "",
    caption: "",
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [userToken, setUserToken] = useState(localStorage.getItem('token'));
  const [userData, setUserData] = useState(null);

  // Cek apakah ini mode edit atau create
  const isEditMode = !!post;

  const categories = [
    "Dog", "Cat", "Bird", "Fish", "Rabbit", 
    "Hamster", "Guinea Pig", "Turtle", "Snake", "Other"
  ];

  // Load post data jika mode edit
  useEffect(() => {
    if (isEditMode && post) {
      setFormData({
        petName: post.petName || "",
        category: post.category || "",
        caption: post.caption || "",
        imageUrl: post.imageUrl || ""
      });
      setImagePreview(post.imageUrl || null);
    }

    // Ambil user data dari localStorage
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, [isEditMode, post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
    
    // Set preview jika URL valid
    if (url && isValidImageUrl(url)) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const isValidImageUrl = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null;
  };

  // Cek apakah user bisa edit post ini (untuk mode edit)
  const canEditPost = () => {
    if (!isEditMode || !userData || !post) return true; // Untuk create mode, selalu true
    
    // Admin bisa edit semua post
    if (userData.role === 'admin') return true;
    
    // User biasa hanya bisa edit post miliknya sendiri
    // Cek berbagai kemungkinan struktur data author
    const postAuthorId = post.author?._id || post.author;
    return userData.userId === postAuthorId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userToken) {
      setError(`Please login first to ${isEditMode ? 'edit' : 'create'} a post`);
      return;
    }

    if (isEditMode && !canEditPost()) {
      setError("You don't have permission to edit this post");
      return;
    }

    // Form validation
    if (!formData.petName.trim()) {
      setError("Pet name is required");
      return;
    }

    if (!formData.category) {
      setError("Category must be selected");
      return;
    }

    if (!formData.imageUrl.trim()) {
      setError("Image URL is required");
      return;
    }

    if (!isValidImageUrl(formData.imageUrl)) {
      setError("Invalid image URL. Use format: .jpg, .jpeg, .png, .gif, .webp");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isEditMode) {
        // Update post
        const response = await api.updatePost(post._id, formData, userToken);
        // Notify parent component
        if (onPostUpdated) {
          onPostUpdated();
        }
      } else {
        // Create new post
        await api.createPost(formData, userToken);
        // Reset form
        setFormData({
          petName: "",
          category: "",
          caption: "",
          imageUrl: ""
        });
        setImagePreview(null);
        // Notify parent component
        if (onPostCreated) {
          onPostCreated();
        }
      }
      // Close modal/form
      if (onClose) {
        onClose();
      }
    } catch (error) {
      setError(error.message || `Failed to ${isEditMode ? 'update' : 'create'} post`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // If edit mode and user cannot edit this post
  if (isEditMode && !canEditPost()) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have permission to edit this post.
            </p>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Post' : 'Create New Post'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Form fields */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Pet Name</label>
            <input
              type="text"
              name="petName"
              value={formData.petName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              placeholder="Enter pet name"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              disabled={loading}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Caption</label>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              placeholder="Write a caption..."
              rows={3}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">Image URL</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleImageUrlChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                placeholder="Paste image URL (jpg, png, gif, webp)"
                disabled={loading}
              />
              <FaImage className="w-5 h-5 text-gray-400" />
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  onError={() => setImagePreview(null)}
                />
              </div>
            )}
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
              disabled={loading}
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
