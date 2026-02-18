package com.educlips.server.dto;

import java.util.List;

public class FeedResponse {

    private List<VideoResponse> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;

    public FeedResponse(
            List<VideoResponse> content,
            int page,
            int size,
            long totalElements,
            int totalPages,
            boolean last
    ) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.last = last;
    }

    public List<VideoResponse> getContent() { return content; }
    public int getPage() { return page; }
    public int getSize() { return size; }
    public long getTotalElements() { return totalElements; }
    public int getTotalPages() { return totalPages; }
    public boolean isLast() { return last; }
}