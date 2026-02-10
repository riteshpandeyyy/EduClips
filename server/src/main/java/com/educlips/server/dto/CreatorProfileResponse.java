package com.educlips.server.dto;

public class CreatorProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String bio;
    private String expertise;
    private int followersCount;

    public CreatorProfileResponse(
            Long id,
            String name,
            String email,
            String bio,
            String expertise,
            int followersCount
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.bio = bio;
        this.expertise = expertise;
        this.followersCount = followersCount;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getBio() { return bio; }
    public String getExpertise() { return expertise; }
    public int getFollowersCount() { return followersCount; }
}
