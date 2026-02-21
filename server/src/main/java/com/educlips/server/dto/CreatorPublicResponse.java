package com.educlips.server.dto;

public class CreatorPublicResponse {

    private Long id;
    private String name;
    private String bio;
    private String expertise;
    private long followers;
    private long totalCourses;
    private long totalVideos;
    private boolean followedByCurrentUser;

    public CreatorPublicResponse(
            Long id,
            String name,
            String bio,
            String expertise,
            long followers,
            long totalCourses,
            long totalVideos,
            boolean followedByCurrentUser
    ) {
        this.id = id;
        this.name = name;
        this.bio = bio;
        this.expertise = expertise;
        this.followers = followers;
        this.totalCourses = totalCourses;
        this.totalVideos = totalVideos;
        this.followedByCurrentUser = followedByCurrentUser;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getBio() { return bio; }
    public String getExpertise() { return expertise; }
    public long getFollowers() { return followers; }
    public long getTotalCourses() { return totalCourses; }
    public long getTotalVideos() { return totalVideos; }
    public boolean isFollowedByCurrentUser() { return followedByCurrentUser; }
}