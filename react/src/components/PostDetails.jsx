import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

const PostDetails = () => {
  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${id}`
        );
        if (!res.ok) throw new Error('Failed to fetch post data');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchPost();
  }, [id]);   // 1. Fixed: Component will now correctly refetch if the URL ID changes

  if (loading) return <p className="text-center p-10 text-gray-500">Loading...</p>;
  if (error)   return <p className="text-center p-10 text-red-500">Error: {error}</p>;
  
  // 2. Fixed: Safety guard condition ensures we don't try to render null data
  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition shadow-sm self-start max-w-xs"
      >
        ← Go Back
      </button>

      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-md p-8 md:p-12">
        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-wide mb-4">
          Post ID #{post.id}
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 capitalize mb-6 leading-tight">
          {post.title}
        </h2>
        <hr className="border-gray-100 mb-6" />
        <p className="text-gray-600 text-base md:text-lg leading-relaxed first-letter:capitalize">
          {post.body}
        </p>
      </div>
    </div>
  );
}

export default PostDetails;