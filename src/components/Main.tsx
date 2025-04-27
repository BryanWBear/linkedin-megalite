import { useEffect, useRef, useState } from "react";
import { WriteNewPostCard } from "./WriteNewPostCard";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./primitives/DropdownMenu";
import { Separator } from "./primitives/Separator";
import FeedWithClaude from "./FeedWithClaude";
import { useScrollContext } from "./Sidebar";

// Helper function to generate a random permutation of numbers 0 to n-1
const generateRandomPermutation = (n: number) => {
  // Create array from 0 to n-1
  const array = Array.from({ length: n }, (_, i) => i);
  
  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  
  return array;
};

const SortByDivider = () => {
  return (
    <div className="flex flex-row mt-2">
      <div className="pt-2 w-full">
        <Separator className="bg-zinc-300" />
      </div>
      <span className="text-zinc-500 text-xs w-24 pl-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className="cursor-pointer">
              Sort by: <span className="font-semibold text-zinc-800">Top</span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-24">
            <DropdownMenuItem>
              <span>Top</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Recent</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
    </div>
  );
};

export const Main = () => {
  const [visibleCount, setVisibleCount] = useState(5);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [postIds, setPostIds] = useState([]);
  const { setScrolledPosts } = useScrollContext();


  // Generate and cache the random permutation on initial render
  useEffect(() => {
    // Only generate permutation if not already done
    if (postIds.length === 0) {
      const randomIds = generateRandomPermutation(50);
      setPostIds(randomIds);
    }
  }, [postIds.length]);

  // Set up the intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 2, 50)); // Limit to 100 items
          setScrolledPosts(prev => Math.min(prev + 2, 50));
        }
      },
      {
        root: null, // observe in viewport
        rootMargin: "200px", // triggers earlier
        threshold: 0.1,
      }
  );

    const currentRef = loaderRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      style={{ gridArea: "main" }}
      className="flex flex-col gap-2 pb-20"
    >
      <WriteNewPostCard />
      <SortByDivider />

      {postIds.slice(0, visibleCount).map((postId) => (
        <FeedWithClaude key={postId} postId={postId} />
      ))}

      {/* This invisible div triggers more loading */}
      <div ref={loaderRef} className="h-1 w-full" />
    </div>
  );
};
