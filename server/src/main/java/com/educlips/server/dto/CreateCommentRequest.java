package com.educlips.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateCommentRequest {

    @NotNull
    private Long videoId;

    @NotBlank
    private String content;

    // getters

    public Long getVideoId() {
        return videoId;
    }

    public String getContent() {
        return content;
    }

    // setters

    public void setVideoId(Long videoId) {
        this.videoId = videoId;
    }

    public void setContent(String content) {
        this.content = content;
    }
}