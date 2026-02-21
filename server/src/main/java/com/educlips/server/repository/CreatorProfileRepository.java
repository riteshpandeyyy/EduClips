package com.educlips.server.repository;

import com.educlips.server.entity.CreatorProfileEntity;
import com.educlips.server.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface CreatorProfileRepository
        extends JpaRepository<CreatorProfileEntity, Long> {

    Optional<CreatorProfileEntity> findByUser(UserEntity user);
    Optional<CreatorProfileEntity> findById(Long id);
    List<CreatorProfileEntity> findByUser_NameContainingIgnoreCase(String keyword);
}
