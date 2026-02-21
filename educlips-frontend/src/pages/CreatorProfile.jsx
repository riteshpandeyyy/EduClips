import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axios";

function CreatorProfile() {
  const { id } = useParams();

  const [creator, setCreator] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      // Get creator profile
      const profileRes = await axios.get(`/users/creators/${id}`);
      setCreator(profileRes.data);
      setIsFollowing(profileRes.data.followedByCurrentUser);

      // Get all published courses
      const coursesRes = await axios.get("/users/courses");

      // Filter this creator's courses
      const creatorCourses = coursesRes.data.filter(
        (c) => c.creatorId === parseInt(id)
      );

      // Fetch videos for each course
      const coursesWithVideos = await Promise.all(
        creatorCourses.map(async (course) => {
          const videosRes = await axios.get(
            `/users/courses/${course.id}/videos`
          );

          return {
            ...course,
            videos: videosRes.data,
          };
        })
      );

      setCourses(coursesWithVideos);

    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.post(`/users/creators/${id}/unfollow`);
        setIsFollowing(false);
        setCreator((prev) => ({
          ...prev,
          followers: prev.followers - 1,
        }));
      } else {
        await axios.post(`/users/creators/${id}/follow`);
        setIsFollowing(true);
        setCreator((prev) => ({
          ...prev,
          followers: prev.followers + 1,
        }));
      }
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!creator) return <div className="container">Creator not found</div>;

  return (
    <div className="container">
      {/* Creator Info */}
      <div className="card">
        <h2>{creator.name}</h2>
        <p>{creator.bio}</p>
        <p><strong>Expertise:</strong> {creator.expertise}</p>
        <p><strong>Followers:</strong> {creator.followers}</p>

        <button className="button" onClick={handleFollowToggle}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>

      {/* Courses */}
      <h3 style={{ marginTop: "30px" }}>Published Courses</h3>

      {courses.length === 0 ? (
        <p>No courses yet</p>
      ) : (
        courses.map((course) => (
          <div key={course.id} className="card">
            <h4>{course.title}</h4>
            <p>{course.description}</p>

            {/* Videos under course */}
            {course.videos && course.videos.length === 0 ? (
              <p>No videos yet</p>
            ) : (
              course.videos &&
              course.videos.map((video) => (
                <div
                  key={video.id}
                  style={{
                    borderTop: "1px solid #ddd",
                    padding: "10px 0",
                  }}
                >
                  <p>{video.title}</p>
                  <Link to={`/video/${video.id}`}>
                    <button className="button">Watch</button>
                  </Link>
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CreatorProfile;