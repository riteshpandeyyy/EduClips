package com.educlips.server.dto;

import jakarta.validation.constraints.NotBlank;


public class CreateCourseRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String category;

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

}
