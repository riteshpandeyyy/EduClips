package com.educlips.server.repository;

import com.educlips.server.entity.CommentEntity;
import com.educlips.server.entity.VideoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    List<CommentEntity> findByVideoOrderByCreatedAtDesc(VideoEntity video);

}