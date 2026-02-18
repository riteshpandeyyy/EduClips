package com.educlips.server.dto;

public class VideoResponse {

    private Long id;
    private String title;
    private String description;
    private String videoUrl;
    private Long courseId;
    private boolean published;
    private long likeCount;
    private boolean likedByCurrentUser;
    private int score;
    private long commentCount;
    private long viewCount;

    public VideoResponse(
            Long id,
            String title,
            String description,
            String videoUrl,
            Long courseId,
            boolean published,
            long likeCount,
            boolean likedByCurrentUser,
            int score,
            long commentCount,
            long viewCount
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.videoUrl = videoUrl;
        this.courseId = courseId;
        this.published = published;
        this.likeCount = likeCount;
        this.likedByCurrentUser = likedByCurrentUser;
        this.score = score;
        this.commentCount = commentCount;
        this.viewCount = viewCount;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public Long getCourseId() {
        return courseId;
    }

    public boolean isPublished() {
        return published;
    }

    public long getLikeCount() {
        return likeCount;
    }

    public boolean isLikedByCurrentUser() {
        return likedByCurrentUser;
    }

    public int getScore() {
        return score;
    }

    public long getCommentCount() {
        return commentCount;
    }

    public long getViewCount() {
        return viewCount;
    }
}