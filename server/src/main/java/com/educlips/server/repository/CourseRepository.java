package com.educlips.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.educlips.server.entity.CourseEntity;
import com.educlips.server.entity.CreatorProfileEntity;


@Repository
public interface CourseRepository extends JpaRepository<CourseEntity, Long> {

    List<CourseEntity> findByCreator(CreatorProfileEntity creator);

    List<CourseEntity> findByPublishedTrue();

    long countByCreator(CreatorProfileEntity creator);
}
