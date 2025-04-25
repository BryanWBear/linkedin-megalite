import React, { useEffect, useState } from "react";
import axios from "axios";
import { FeedItem } from "./FeedItem";

type Experience = {
  company: string;
  title: string;
};

type Profile = {
  full_name: string;
  first_name: string;
  last_name: string;
  occupation: string;
  profile_pic_url: string;
  headline: string;
  experiences?: Experience[];
};

type Author = {
  name: string;
  subtext: string;
  imageUrl: string;
  connectionDegree: string;
};

type Link = {
  title: string;
  thumbnail: string;
  href: string;
};

type Stats = {
  likes: number;
  comments: number;
  reposts: number;
};

type Post = {
  id: string;
  content: string;
  author: Author;
  link: Link;
  stats: Stats;
  created_at: string;
};

interface FeedWithClaudeProps {
  postId: number;
}

// Configuration
const API_BASE_URL = "https://linkedin-megalite-server-production.up.railway.app/api"

// process.env.SERVER_SERVICE_NAME
//   ? `https://${process.env.SERVER_SERVICE_NAME}/api` 
//   : 'http://127.0.0.1:5000/api';

const FeedWithClaude: React.FC<FeedWithClaudeProps> = ({ postId }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch post from Flask server
        const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        // If post not found or error, generate a new one
        console.log(err)
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) return <div className="p-4 bg-white rounded shadow">Loading post...</div>;
  if (error) return <div className="p-4 bg-white rounded shadow text-red-500">{error}</div>;
  if (!post) return <div className="p-4 bg-white rounded shadow">Post not available</div>;

  return (
    <FeedItem
      type="post"
      content={post.content}
      link={post.link}
      author={{
        ...post.author,
        imageUrl: `${API_BASE_URL}/images/${postId}` // Convert to full URL
      }}
      stats={post.stats}
    />
  );
};

export default FeedWithClaude;