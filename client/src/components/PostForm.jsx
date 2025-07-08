import React, { useState } from "react";

const PostForm = ({
  mode = "add", // "add" or "edit"
  initialValues = {},
  onSubmit,
  onCancel,
  submitting,
}) => {
  const [petName, setPetName] = useState(initialValues.petName || "");
  const [category, setCategory] = useState(initialValues.category || "");
  const [imageUrl, setImageUrl] = useState(initialValues.imageUrl || "");
  const [caption, setCaption] = useState(initialValues.caption || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!petName.trim() || !category.trim() || !imageUrl.trim()) {
      alert("Pet name, category, and image URL are required.");
      return;
    }
    onSubmit({ petName, category, imageUrl, caption });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-black"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">
          {mode === "edit" ? "Edit Post" : "Add Post"}
        </h2>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Pet Name*</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Category*</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Image URL*</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Caption</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : mode === "edit"
              ? "Save Changes"
              : "Add Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
