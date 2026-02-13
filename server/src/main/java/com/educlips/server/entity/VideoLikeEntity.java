package com.educlips.server.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "video_likes",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"user_id", "video_id"}
    )
)
public class VideoLikeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "video_id")
    private VideoEntity video;

    // ===== Getters & Setters =====

    public Long getId() {
        return id;
    }

    public UserEntity getUser() {
        return user;
    }

    public VideoEntity getVideo() {
        return video;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public void setVideo(VideoEntity video) {
        this.video = video;
    }
}