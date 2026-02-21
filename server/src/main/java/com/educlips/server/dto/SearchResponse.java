package com.educlips.server.dto;

import java.util.List;

public class SearchResponse {

    private List<VideoResponse> videos;
    private List<CreatorPublicResponse> creators;

    public SearchResponse(List<VideoResponse> videos,
                          List<CreatorPublicResponse> creators) {
        this.videos = videos;
        this.creators = creators;
    }

    public List<VideoResponse> getVideos() {
        return videos;
    }

    public List<CreatorPublicResponse> getCreators() {
        return creators;
    }
}