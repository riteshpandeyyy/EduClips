package com.educlips.server.dto;

import java.time.LocalDateTime;

public class CommentResponse {

    private Long id;
    private String content;
    private String userName;
    private Long userId;
    private Long videoId;
    private LocalDateTime createdAt;

    public CommentResponse(
            Long id,
            String content,
            String userName,
            Long userId,
            Long videoId,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.content = content;
        this.userName = userName;
        this.userId = userId;
        this.videoId = videoId;
        this.createdAt = createdAt;
    }

    // getters

    public Long getId() { return id; }
    public String getContent() { return content; }
    public String getUserName() { return userName; }
    public Long getUserId() { return userId; }
    public Long getVideoId() { return videoId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}