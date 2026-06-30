import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // 1. Import the hook

const Post = () => {
  const [posts, setSaifulRehman] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  
  const navigate = useNavigate(); // 2. Initialize navigate

  useEffect(() => {
    const fetchPanda = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts`
        );
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setSaifulRehman(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPanda();
  }, []);

  if (loading) return <p className="text-center p-10 text-gray-500">Loading...</p>;
  if (error)   return <p className="text-center p-10 text-red-500">Error: {error}</p>;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 bg-gray-50 min-h-screen">
      {posts.map((post) => (
        <div 
          key={post.id} 
          onClick={() => navigate(`/posts/${post.id}`)} // 3. Add onClick handler to redirect
          className="flex flex-col gap-3 p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" // 4. Added 'cursor-pointer'
        >
          <span className="text-xs font-bold text-gray-400 tracking-wider">
            #{post.id}
          </span>
          <h2 className="text-lg font-semibold text-gray-800 capitalize line-clamp-2">
            {post.title}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
            {post.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Post;