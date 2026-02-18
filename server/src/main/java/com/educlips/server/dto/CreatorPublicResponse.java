package com.educlips.server.dto;

public class CreatorPublicResponse {

    private String name;
    private String bio;
    private String expertise;
    private long followers;
    private long totalCourses;
    private long totalVideos;

    public CreatorPublicResponse(
            String name,
            String bio,
            String expertise,
            long followers,
            long totalCourses,
            long totalVideos
    ) {
        this.name = name;
        this.bio = bio;
        this.expertise = expertise;
        this.followers = followers;
        this.totalCourses = totalCourses;
        this.totalVideos = totalVideos;
    }

    public String getName() { return name; }
    public String getBio() { return bio; }
    public String getExpertise() { return expertise; }
    public long getFollowers() { return followers; }
    public long getTotalCourses() { return totalCourses; }
    public long getTotalVideos() { return totalVideos; }
}