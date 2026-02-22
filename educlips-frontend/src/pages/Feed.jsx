import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Feed() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeSoundId, setActiveSoundId] = useState(null);
  const [viewedVideos, setViewedVideos] = useState(new Set());

  const navigate = useNavigate();
  const observer = useRef();

  useEffect(() => {
    loadVideos(0);
  }, []);

  const loadVideos = async (pageNumber) => {
    try {
      const res = await axios.get(
        `/users/feed?page=${pageNumber}&size=5`
      );

      if (pageNumber === 0) {
        setVideos(res.data.content);
      } else {
        setVideos((prev) => [...prev, ...res.data.content]);
      }

      setHasMore(!res.data.last);
      setPage(pageNumber);
    } catch (err) {
      console.error("Feed load error:", err);
    }
  };

  const lastVideoRef = (node) => {
    if (!hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadVideos(page + 1);
        }
      },
      { threshold: 1 }
    );

    if (node) observer.current.observe(node);
  };

  const extractVideoId = (url) => {
    if (!url) return null;

    if (url.includes("shorts/")) {
      return url.split("shorts/")[1].split("?")[0];
    }

    const regExp =
      /^.*(youtu.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

    const match = url.match(regExp);
    return match && match[2].length === 11
      ? match[2]
      : null;
  };

  const incrementView = async (videoId) => {
    if (viewedVideos.has(videoId)) return;

    try {
      await axios.get(`/users/videos/${videoId}`);

      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? { ...v, viewCount: Number(v.viewCount) + 1 }
            : v
        )
      );

      setViewedVideos((prev) => {
        const updated = new Set(prev);
        updated.add(videoId);
        return updated;
      });

    } catch (err) {
      console.error("View increment error:", err);
    }
  };

  const handleLikeToggle = async (videoId, liked) => {
    try {
      if (liked) {
        await axios.post(`/users/videos/${videoId}/unlike`);
      } else {
        await axios.post(`/users/videos/${videoId}/like`);
      }

      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? {
                ...v,
                likedByCurrentUser: !liked,
                likeCount: liked
                  ? v.likeCount - 1
                  : v.likeCount + 1,
              }
            : v
        )
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <div style={feedContainer}>
      {videos.map((v, index) => {
        const isLast = index === videos.length - 1;
        const videoId = extractVideoId(v.videoUrl);

        return (
          <VideoItem
            key={v.id}
            video={v}
            videoId={videoId}
            isLast={isLast}
            lastVideoRef={lastVideoRef}
            activeSoundId={activeSoundId}
            setActiveSoundId={setActiveSoundId}
            navigate={navigate}
            incrementView={incrementView}
            handleLikeToggle={handleLikeToggle}
            viewedVideos={viewedVideos}
          />
        );
      })}
    </div>
  );
}

function VideoItem({
  video,
  videoId,
  isLast,
  lastVideoRef,
  activeSoundId,
  setActiveSoundId,
  navigate,
  incrementView,
  handleLikeToggle,
  viewedVideos,
}) {
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {

            if (!viewedVideos.has(video.id)) {
              timerRef.current = setTimeout(() => {
                incrementView(video.id);
              }, 3000);
            }

          } else {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }

            if (activeSoundId === video.id) {
              setActiveSoundId(null);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [video.id, viewedVideos, activeSoundId]);

  return (
    <div
      ref={(node) => {
        videoRef.current = node;
        if (isLast) lastVideoRef(node);
      }}
      style={videoSection}
    >
      <div style={videoWrapper}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&${
            activeSoundId === video.id ? "mute=0" : "mute=1"
          }&controls=0&loop=1&playlist=${videoId}`}
          frameBorder="0"
          allow="autoplay"
          style={videoFrame}
          title={video.title}
        ></iframe>

        <div
          style={soundIcon}
          onClick={(e) => {
            e.stopPropagation();
            setActiveSoundId(
              activeSoundId === video.id ? null : video.id
            );
          }}
        >
          {activeSoundId === video.id ? "🔊" : "🔇"}
        </div>
      </div>

      <div style={gradientOverlay}></div>

      <div style={leftContent}>
        <Link
          to={`/creator/${video.creatorId}`}
          style={creatorLink}
        >
          @{video.creatorName}
        </Link>

        <h3>{video.title}</h3>
        <p>{video.description}</p>
      </div>

      <div style={rightActions}>
        <div
          style={actionItem}
          onClick={(e) => {
            e.stopPropagation();
            handleLikeToggle(
              video.id,
              video.likedByCurrentUser
            );
          }}
        >
          {video.likedByCurrentUser ? "❤️" : "🤍"}
          <span>{video.likeCount}</span>
        </div>

        <div
          style={actionItem}
          onClick={() => navigate(`/video/${video.id}`)}
        >
          💬
          <span>{video.commentCount}</span>
        </div>

        <div style={actionItem}>
          👁
          <span>{video.viewCount}</span>
        </div>
      </div>
    </div>
  );
}

/* styles same as before */

const feedContainer = {
  height: "100vh",
  overflowY: "scroll",
  scrollSnapType: "y mandatory",
  background: "black",
};

const videoSection = {
  height: "100vh",
  scrollSnapAlign: "start",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  background: "black",
};

const videoWrapper = {
  position: "relative",
  height: "100%",
  aspectRatio: "9 / 16",
};

const videoFrame = {
  width: "100%",
  height: "100%",
  border: "none",
};

const soundIcon = {
  position: "absolute",
  top: "15px",
  right: "15px",
  fontSize: "22px",
  zIndex: 10,
  background: "rgba(0,0,0,0.6)",
  padding: "6px 10px",
  borderRadius: "20px",
  color: "white",
  cursor: "pointer",
};

const gradientOverlay = {
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "50%",
  background:
    "linear-gradient(to top, rgba(0,0,0,0.95), transparent)",
};

const leftContent = {
  position: "absolute",
  bottom: "80px",
  left: "20px",
  color: "white",
  maxWidth: "70%",
  zIndex: 2,
};

const creatorLink = {
  color: "#ff2e63",
  fontWeight: "600",
  textDecoration: "none",
};

const rightActions = {
  position: "absolute",
  bottom: "140px",
  right: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "25px",
  alignItems: "center",
  color: "white",
  zIndex: 2,
  fontSize: "20px",
};

const actionItem = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
};

export default Feed;