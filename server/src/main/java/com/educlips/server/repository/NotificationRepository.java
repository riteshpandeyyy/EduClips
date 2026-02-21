package com.educlips.server.repository;

import com.educlips.server.entity.NotificationEntity;
import com.educlips.server.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {

    List<NotificationEntity> findByRecipientOrderByCreatedAtDesc(UserEntity recipient);

    long countByRecipientAndIsReadFalse(UserEntity recipient);
}