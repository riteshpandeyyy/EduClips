package com.educlips.server.repository;

import com.educlips.server.entity.CreatorProfileEntity;
import com.educlips.server.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CreatorProfileRepository
        extends JpaRepository<CreatorProfileEntity, Long> {

    Optional<CreatorProfileEntity> findByUser(UserEntity user);
}
