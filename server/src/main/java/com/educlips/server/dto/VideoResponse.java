package com.educlips.server.dto;

public class VideoResponse {

    private Long id;
    private String title;
    private String description;
    private String videoUrl;
    private Long courseId;
    private boolean published;

    public VideoResponse(
            Long id,
            String title,
            String description,
            String videoUrl,
            Long courseId,
            boolean published
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.videoUrl = videoUrl;
        this.courseId = courseId;
        this.published = published;
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
}