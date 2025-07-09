import React, { useState, useEffect } from "react";
import { FaRegThumbsUp, FaRegComment, FaHeart, FaRegHeart, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from "../api/api"; // Pastikan api.js berfungsi untuk mengambil data dari API
import { getTimeAgo } from "../utils/timeUtils"; // Import fungsi untuk menghitung waktu relatif
import CommentSection from "./CommentSection"; // Import komponen CommentSection
import PostForm from "./PostForm"; // Import komponen PostForm

const Feed = () => {
  const [posts, setPosts] = useState([]); // State untuk menyimpan data post
  const [loading, setLoading] = useState(true); // State untuk menunjukkan status loading
  const [userToken, setUserToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [commentCounts, setCommentCounts] = useState({}); // State untuk jumlah komentar per post

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // Number of posts per page

  // Fetch data dari API ketika komponen pertama kali dimuat
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.fetchPosts(); // Memanggil API untuk mengambil posts
        setPosts(data); // Menyimpan data ke state
        // Setelah posts didapat, fetch jumlah komentar untuk setiap post
        const counts = {};
        await Promise.all(
          data.map(async (post) => {
            try {
              const comments = await api.fetchCommentsForPost(post._id);
              counts[post._id] = comments.length;
            } catch {
              counts[post._id] = 0;
            }
          })
        );
        setCommentCounts(counts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // Mengubah status loading setelah data diambil
      }
    };

    // Ambil user data dari localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.userId);
      setUserData(user);
    }

    fetchPosts(); // Memanggil fungsi fetchPosts
  }, []); // Hanya dijalankan sekali saat komponen dimuat

  // Fungsi untuk handle like/unlike post
  const handleLike = async (post) => {
    if (!userToken) {
      alert('Silakan login terlebih dahulu untuk like post');
      return;
    }

    try {
      const isLiked = post.likedBy && post.likedBy.includes(userId); // Cek apakah user sudah like
      
      if (isLiked) {
        // Unlike post
        await api.unlikePost(post._id, userToken);
      } else {
        // Like post
        await api.likePost(post._id, userToken);
      }
      
      // Refresh posts setelah like/unlike
      const updatedPosts = await api.fetchPosts();
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error handling like:", error);
      alert('Gagal melakukan like/unlike post');
    }
  };

  // Cek apakah user bisa edit/delete post ini
  const canEditDeletePost = (post) => {
    if (!userData || !post) return false;
    
    // Admin bisa edit/delete semua post
    if (userData.role === 'admin') return true;
    
    // User biasa hanya bisa edit/delete post miliknya sendiri
    // Cek berbagai kemungkinan struktur data author
    const postAuthorId = post.author?._id || post.author;
    return userData.userId === postAuthorId;
  };

  // Fungsi untuk handle delete post
  const handleDeletePost = async (post) => {
    if (!userToken) {
      alert('Silakan login terlebih dahulu untuk menghapus post');
      return;
    }

    if (!canEditDeletePost(post)) {
      alert('Anda tidak memiliki izin untuk menghapus post ini');
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin menghapus post ini?')) {
      try {
        await api.deletePost(post._id, userToken);
        
        // Refresh posts setelah delete
        const updatedPosts = await api.fetchPosts();
        setPosts(updatedPosts);
        
        alert('Post berhasil dihapus');
      } catch (error) {
        console.error("Error deleting post:", error);
        alert('Gagal menghapus post');
      }
    }
  };

  // Fungsi untuk refresh posts setelah edit post
  const handlePostUpdated = async () => {
    try {
      const updatedPosts = await api.fetchPosts();
      setPosts(updatedPosts);
      setEditingPost(null);
      // Reset to first page when posts are updated
      setCurrentPage(1);
    } catch (error) {
      console.error("Error refreshing posts:", error);
    }
  };

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Go to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Show first 3 pages + ellipsis + last page
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page + ellipsis + last 3 pages
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show first page + ellipsis + current page + ellipsis + last page
        pageNumbers.push(1);
        pageNumbers.push('...');
        pageNumbers.push(currentPage);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Jika data masih dalam proses loading
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-0 pb-20 lg:pt-0 lg:pb-0">
      {/* Render setiap post yang diterima dari API */}
      {currentPosts.map((post, index) => (
        <div key={index} className="max-w-lg mx-auto bg-white dark:bg-gray-800 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {post.author.username ? post.author.username.charAt(0).toUpperCase() : "?"}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {post.author.username|| "Unknown Author"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(post.createdAt)}</p>
              </div>
            </div>
            {canEditDeletePost(post) && (
              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <FaEdit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeletePost(post)}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                  >
                    <FaTrash className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Image */}
          <div className="relative group overflow-hidden">
            <img
              src={post.imageUrl}
              alt="Pet"
              className="w-full h-80 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300 bg-gray-100 dark:bg-gray-700"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x320/e5e7eb/6b7280?text=Pet+Image";
              }}
            />
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(post)}
                  className="flex items-center space-x-2 group transition-all duration-200"
                >
                  {post.likedBy && post.likedBy.includes(userId) ? (
                    <FaHeart className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                  ) : (
                    <FaRegThumbsUp className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-red-500 group-hover:scale-110 transition-all duration-200" />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {post.likes || 0}
                  </span>
                </button>

                <button className="flex items-center space-x-2 group transition-all duration-200">
                  <FaRegComment className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-200" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {commentCounts[post._id] ?? 0}
                  </span>
                </button>
              </div>

              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>

            {/* Pet Name */}
            <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 cursor-pointer">
              {post.petName}
            </h5>

            {/* Caption */}
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
              {post.caption}
            </p>

            {/* Comment Section */}
            <CommentSection postId={post._id} />
          </div>
        </div>
      ))}

      {/* PostForm Modal untuk Edit */}
      {editingPost && (
        <PostForm
          post={editingPost}
          onPostUpdated={handlePostUpdated}
          onClose={() => setEditingPost(null)}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-1 mt-8">
          {getPageNumbers().map((number, idx) =>
            number === "..." ? (
              <span key={idx} className="w-9 h-9 flex items-center justify-center text-gray-400">...</span>
            ) : (
              <button
                key={idx}
                onClick={() => paginate(number)}
                className={`w-9 h-9 flex items-center justify-center transition
                  ${currentPage === number
                    ? "bg-blue-500 text-white shadow"
                    : "bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-600"}`}
              >
                {number}
              </button>
            )
          )}
         
        </div>
      )}
    </div>
  );
};

export default Feed;
