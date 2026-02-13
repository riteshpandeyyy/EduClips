package com.educlips.server.repository;

import com.educlips.server.entity.VideoLikeEntity;
import com.educlips.server.entity.UserEntity;
import com.educlips.server.entity.VideoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VideoLikeRepository extends JpaRepository<VideoLikeEntity, Long> {

    Optional<VideoLikeEntity> findByUserAndVideo(
            UserEntity user,
            VideoEntity video
    );

    long countByVideo(VideoEntity video);
}