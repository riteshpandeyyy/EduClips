package com.educlips.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateVideoRequest {

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String videoUrl;

    @NotNull
    private Long courseId;

    public CreateVideoRequest() {
    }

    public CreateVideoRequest(String title, String description, String videoUrl, Long courseId) {
        this.title = title;
        this.description = description;
        this.videoUrl = videoUrl;
        this.courseId = courseId;
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

}