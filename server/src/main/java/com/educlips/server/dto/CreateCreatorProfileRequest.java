package com.educlips.server.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateCreatorProfileRequest {

    @NotBlank
    private String bio;

    private String expertise;

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getExpertise() {
        return expertise;
    }

    public void setExpertise(String expertise) {
        this.expertise = expertise;
    }
}
