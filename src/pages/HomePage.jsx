import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllVideos } from "../redux/features/video.slice";
import HomeVideoCard from '../components/HomeVideoCard';

function HomePage() {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const {user} = useSelector(state=>state.user)
  const { videos, loading, totalVideos } = useSelector((state) => state.video);

  const loadMore = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  const observerOptions = useMemo(() => ({
    root: null,
    rootMargin: "20px",
    threshold: 1.0
  }), []);

  useEffect(() => {
    const observer = new IntersectionObserver(loadMore, observerOptions);
    const currentLoader = loader.current;
    
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMore, observerOptions]);

  useEffect(() => {
    let isMounted = true;

    const fetchVideos = async () => {
      const action = await dispatch(fetchAllVideos({ 
        page, 
        limit: 10,
        userId: user?._id || null,
        query: "", 
        sortBy: "createdAt", 
        sortType: "desc"
      }));
      
      if (isMounted && action.payload?.data?.totalVideos) {
        const total = action.payload.data.totalVideos;
        setHasMore(page * 10 < total); 
      }
    };

    fetchVideos();

    return () => {
      isMounted = false;
    };
  }, [dispatch, user?._id, page]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos?.map((video) => (
          <HomeVideoCard key={video._id} video={video} />
        ))}
      </div>
      
      {loading && (
        <div className="text-center py-4">
          Loading more videos...
        </div>
      )}
      
      {!loading && hasMore && (
        <div ref={loader} className="h-10" />
      )}
      
      {!hasMore && videos?.length > 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No more videos to load
        </div>
      )}
    </div>
  );
}

export default HomePage;