package com.educlips.server.repository;

import com.educlips.server.entity.CreatorFollowEntity;
import com.educlips.server.entity.CreatorProfileEntity;
import com.educlips.server.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CreatorFollowRepository extends JpaRepository<CreatorFollowEntity, Long> {

    Optional<CreatorFollowEntity> findByUserAndCreator(
            UserEntity user,
            CreatorProfileEntity creator
    );

    long countByCreator(CreatorProfileEntity creator);
}