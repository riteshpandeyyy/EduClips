package com.educlips.server.mapper;

import com.educlips.server.dto.CreatorProfileResponse;
import com.educlips.server.entity.CreatorProfileEntity;
import org.springframework.stereotype.Component;

@Component
public class CreatorProfileMapper {

    public CreatorProfileResponse toResponse(CreatorProfileEntity profile) {
        return new CreatorProfileResponse(
                profile.getId(),
                profile.getUser().getName(),
                profile.getUser().getEmail(),
                profile.getBio(),
                profile.getExpertise(),
                profile.getFollowersCount()
        );
    }
}
