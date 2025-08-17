import Postitem from "../Components/Postitem";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import React from "react";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  console.log(searchParamsObj);

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 10, ...searchParamsObj },
  });
  return res.data;
};

const Post = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  // if (status === "loading") return "Loading...";
  if (isFetching) return "Loading...";
  

  // if (status === "error") return "Something went wrong!";
  if (error) return "Something went wrong!";

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];
  
  // Debug: Log posts with user data issues
  allPosts.forEach(post => {
    if (!post.user || !post.user.username) {
      console.log('Post with user issue:', {
        postId: post._id,
        title: post.title,
        user: post.user,
        hasUser: !!post.user,
        username: post.user?.username
      });
    }
  });
  
  // Filter out posts with null users to prevent errors and ensure valid usernames
  const validPosts = allPosts.filter(post => {
    if (!post || !post.user) return false;
    
    // Ensure username is valid and not empty
    if (!post.user.username || 
        post.user.username.trim() === '' || 
        post.user.username === 'no-email' ||
        post.user.username === 'unnamed_user' ||
        post.user.username === 'Unknown User') {
      return false;
    }
    
    return true;
  });

  // If no valid posts, show a message
  if (validPosts.length === 0 && allPosts.length > 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">No posts with valid author information found.</p>
        <p className="text-gray-400 text-sm">This might be due to missing or invalid user data.</p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={validPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h4>Loading more posts...</h4>}
      endMessage={
        <p className="text-center justify-center">
          <b>All posts loaded!</b>
        </p>
      }
    >
      {validPosts.map((post) => (
        <Postitem key={post._id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default Post;