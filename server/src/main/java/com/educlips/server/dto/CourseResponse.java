package com.educlips.server.dto;

public class CourseResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private boolean published;

    public CourseResponse(
            Long id,
            String title,
            String description,
            String category,
            boolean published
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
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

    public String getCategory() {
        return category;
    }

    public boolean isPublished() {
        return published;
    }

}