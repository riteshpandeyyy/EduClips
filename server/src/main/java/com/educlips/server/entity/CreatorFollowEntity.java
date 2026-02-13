package com.educlips.server.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "creator_follows",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"user_id", "creator_id"}
    )
)
public class CreatorFollowEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "creator_id")
    private CreatorProfileEntity creator;

    public Long getId() { return id; }

    public UserEntity getUser() { return user; }

    public CreatorProfileEntity getCreator() { return creator; }

    public void setUser(UserEntity user) { this.user = user; }

    public void setCreator(CreatorProfileEntity creator) { this.creator = creator; }
}