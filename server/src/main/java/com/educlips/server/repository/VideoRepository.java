package com.educlips.server.repository;

import com.educlips.server.entity.VideoEntity;
import com.educlips.server.entity.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoRepository extends JpaRepository<VideoEntity, Long> {

    List<VideoEntity> findByCourseOrderByOrderIndexAsc(CourseEntity course);
    List<VideoEntity> findByCourseAndPublishedTrueOrderByOrderIndexAsc(
        CourseEntity course);
}