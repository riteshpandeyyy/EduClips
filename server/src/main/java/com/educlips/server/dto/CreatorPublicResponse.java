package com.educlips.server.dto;

public class CreatorPublicResponse {

    private String name;
    private String bio;
    private String expertise;
    private long followers;

    public CreatorPublicResponse(
            String name,
            String bio,
            String expertise,
            long followers
    ) {
        this.name = name;
        this.bio = bio;
        this.expertise = expertise;
        this.followers = followers;
    }

    public String getName() { return name; }
    public String getBio() { return bio; }
    public String getExpertise() { return expertise; }
    public long getFollowers() { return followers; }
}