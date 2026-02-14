package com.educlips.server.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "videos")
public class VideoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String videoUrl;

    @Column(nullable = false)
    private int orderIndex;

    @Column(nullable = false)
    private boolean published = false;

    @Column(nullable = false)
    private java.time.LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private CourseEntity course;

    @PrePersist
    public void prePersist() {    
        this.createdAt = java.time.LocalDateTime.now();
    }

    //GETTERS

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

    public int getOrderIndex() {
        return orderIndex;
    }

    public boolean isPublished() {
        return published;
    }

    public CourseEntity getCourse() {
        return course;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    //SETTERS

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public void setCourse(CourseEntity course) {
        this.course = course;
    }
}