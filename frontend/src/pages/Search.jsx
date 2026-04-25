import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { videoService } from "../services/video.service";
import VideoCard from "../components/VideoCard";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); // Grabs the '?q=' from the URL
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      try {
        setLoading(true);
        // Pass the query to our updated service
        const response = await videoService.getAllVideos({ query });
        setVideos(response.data?.docs || response.data);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) return <div className="text-center mt-10 text-white">Searching for "{query}"...</div>;

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <h1 className="text-xl font-bold text-white mb-6">
        Search results for: <span className="text-brand-accent">"{query}"</span>
      </h1>
      
      {videos.length === 0 ? (
        <div className="text-center mt-20 text-brand-muted">
          <p className="text-xl">No videos found matching your search.</p>
          <p className="mt-2 text-sm">Try using different keywords or remove filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;