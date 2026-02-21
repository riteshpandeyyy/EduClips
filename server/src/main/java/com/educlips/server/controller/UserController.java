package com.educlips.server.controller;

import com.educlips.server.dto.LoginRequest;
import com.educlips.server.dto.LoginResponse;
import com.educlips.server.dto.SignupRequest;
import com.educlips.server.dto.UpdateCreatorProfileRequest;
import com.educlips.server.dto.UserResponse;
import com.educlips.server.dto.VideoResponse;
import com.educlips.server.entity.UserEntity;
import com.educlips.server.entity.VideoEntity;
import com.educlips.server.mapper.CreatorProfileMapper;
import com.educlips.server.service.UserService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.RequestParam;

import com.educlips.server.dto.CourseResponse;
import com.educlips.server.dto.CreateCourseRequest;
import com.educlips.server.dto.CreateCreatorProfileRequest;
import com.educlips.server.dto.CreateVideoRequest;
import com.educlips.server.dto.CreatorProfileResponse;
import com.educlips.server.dto.CreatorPublicResponse;
import com.educlips.server.entity.CourseEntity;
import com.educlips.server.entity.CreatorProfileEntity;
import com.educlips.server.dto.CreateCommentRequest;
import com.educlips.server.dto.CommentResponse;
import com.educlips.server.repository.CreatorProfileRepository;
import java.util.List;


@RestController
@RequestMapping("/users")
public class UserController {
    
    @Autowired
    private final UserService userService;
    @Autowired
    private final CreatorProfileRepository creatorProfileRepository;

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/test")
    public UserResponse testUser() {
        return new UserResponse(
                1L,
                "Ritesh",
                "ritesh@email.com",
                "STUDENT",
                1L
        );
    }

    @PostMapping("/signup")
    public UserResponse signup(@Valid @RequestBody SignupRequest request) {
        return userService.signup(request);
    }

    @PostMapping("/login")
        public LoginResponse login(@RequestBody LoginRequest request) {
           return userService.login(request.getEmail(), request.getPassword());
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {

        String email = authentication.getName(); // extracted from JWT
        UserEntity user = userService.getCurrentUser(email);
        Long creatorId = null;

        if (user.getRole().name().equals("CREATOR")) {

        CreatorProfileEntity creator =
                creatorProfileRepository.findByUser(user)
                        .orElse(null);

        if (creator != null) {
                creatorId = creator.getId();
        }
        }

                return new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name(),
                        creatorId != null ? creatorId : 0L
                );
        }

    @PreAuthorize("hasRole('CREATOR')")
    @GetMapping("/creator-only")
    public String creatorOnlyEndpoint() {
        return "Hello Creator";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public String adminOnly() {
        return "Hello Admin";
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public Page<UserResponse> getAllUsers(
            @PageableDefault(size = 5) Pageable pageable
    ) {
        return userService.getAllUsers(pageable);
    }

    @PreAuthorize("hasRole('CREATOR')")
    @PostMapping("/creator/profile")
    public CreatorProfileResponse createCreatorProfile(
            @Valid @RequestBody CreateCreatorProfileRequest request,
            Authentication authentication
    ) {
        CreatorProfileEntity profile =
                userService.createCreatorProfile(authentication.getName(), request);

        return new CreatorProfileResponse(
                profile.getId(),
                profile.getUser().getName(),
                profile.getUser().getEmail(),
                profile.getBio(),
                profile.getExpertise(),
                profile.getFollowersCount()
        );
    }

    
    private final CreatorProfileMapper creatorProfileMapper;
    
     public UserController(UserService userService, CreatorProfileMapper creatorProfileMapper, CreatorProfileRepository creatorProfileRepository) {
        this.userService = userService;
        this.creatorProfileMapper = creatorProfileMapper;
        this.creatorProfileRepository = creatorProfileRepository;
    }

    @PreAuthorize("hasRole('CREATOR')")
    @GetMapping("/creator/profile")
    public CreatorProfileResponse getMyCreatorProfile(Authentication authentication) {
        return creatorProfileMapper.toResponse(
                userService.getMyCreatorProfile(authentication.getName())
        );
    }

    @GetMapping("/creators/{id}")
        public CreatorPublicResponse getCreatorProfile(@PathVariable Long id, Authentication authentication) {
                String email = null;
                if (authentication != null) {
                        email = authentication.getName();
                }
        return userService.getCreatorProfile(id, email);
        }

    CourseResponse cr = new CourseResponse(1L, "Java Basics", "Learn Java from scratch", "Programming", true, 1L);

    @PreAuthorize("hasRole('CREATOR')")
    @PostMapping("/creator/courses")
    public CourseResponse createCourse(
            @Valid @RequestBody CreateCourseRequest request,
            Authentication authentication
    ) {
        CourseEntity course =
                userService.createCourse(authentication.getName(), request);

        return new CourseResponse(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getCategory(),
                course.isPublished(),
                course.getCreator().getId()
        );
    }

    @PreAuthorize("hasRole('CREATOR')")
    @GetMapping("/creator/courses")
    public List<CourseResponse> getMyCourses(Authentication authentication) {

        return userService.getMyCourses(authentication.getName())
                .stream()
                .map(course -> new CourseResponse(
                        course.getId(),
                        course.getTitle(),
                        course.getDescription(),
                        course.getCategory(),
                        course.isPublished(),
                        course.getCreator().getId()
                ))
                .toList();
    }

    @GetMapping("/courses")
    public List<CourseResponse> getPublishedCourses() {

        return userService.getPublishedCourses()
                .stream()
                .map(course -> new CourseResponse(
                        course.getId(),
                        course.getTitle(),
                        course.getDescription(),
                        course.getCategory(),
                        course.isPublished(),
                        course.getCreator().getId()
                ))
                .toList();
    }

        @PreAuthorize("hasRole('CREATOR')")
        @PatchMapping("/creator/courses/{courseId}/publish")
        public CourseResponse publishCourse(
                @PathVariable Long courseId,
                Authentication authentication
        ) {
        CourseEntity course = userService.publishCourse(
                courseId,
                authentication.getName()
        );

        return new CourseResponse(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getCategory(),
                course.isPublished(),
                course.getCreator().getId()
        );
        }

        @PreAuthorize("hasRole('CREATOR')")
        @PatchMapping("/creator/courses/{courseId}/unpublish")
        public CourseResponse unpublishCourse(
                @PathVariable Long courseId,
                Authentication authentication
        ) {
        CourseEntity course = userService.unpublishCourse(
                courseId,
                authentication.getName()
        );

        return new CourseResponse(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getCategory(),
                course.isPublished(),
                course.getCreator().getId()
        );
        }

        @PreAuthorize("hasRole('CREATOR')")
        @PostMapping("/creator/courses/{courseId}/videos")
        public VideoEntity addVideoToCourse(
                @PathVariable Long courseId,
                @Valid @RequestBody CreateVideoRequest request,
                Authentication authentication
        ) {
        return userService.addVideoToCourse(
                authentication.getName(),
                courseId,
                request
        );
        }

        @PreAuthorize("hasRole('CREATOR')")
        @GetMapping("/creator/courses/{courseId}/videos")
        public List<VideoResponse> getVideosForCreator(
                @PathVariable Long courseId,
                Authentication authentication
        ) {
        return userService
                .getVideosForCreator(authentication.getName(), courseId)
                .stream()
                .map(video -> new VideoResponse(
                        video.getId(),
                        video.getTitle(),
                        video.getDescription(),
                        video.getVideoUrl(),
                        video.getCourse().getId(),
                        video.isPublished(),
                        0L,
                        false,
                        0,
                        0L,
                        0L,
                        video.getCourse().getCreator().getId(),
                        video.getCourse().getCreator().getUser().getName()
                ))
                .toList();
        }

        @GetMapping("/courses/{courseId}/videos")
        public List<VideoResponse> getPublishedVideos(
                @PathVariable Long courseId
        ) {
        return userService
                .getPublishedVideosForCourse(courseId)
                .stream()
                .map(video -> new VideoResponse(
                        video.getId(),
                        video.getTitle(),
                        video.getDescription(),
                        video.getVideoUrl(),
                        video.getCourse().getId(),
                        video.isPublished(),
                        0L,
                        false,
                        0,
                        0L,
                        0L,
                        video.getCourse().getCreator().getId(),
                        video.getCourse().getCreator().getUser().getName()
                ))
                .toList();
        }

        @PreAuthorize("hasRole('CREATOR')")
        @PatchMapping("/creator/videos/{videoId}/publish")
        public VideoResponse publishVideo(
                        @PathVariable Long videoId,
                        Authentication authentication
                ) {
                VideoEntity video = userService.publishVideo(
                        authentication.getName(),
                        videoId
                );

                return new VideoResponse(
                        video.getId(),
                        video.getTitle(),
                        video.getDescription(),
                        video.getVideoUrl(),
                        video.getCourse().getId(),
                        video.isPublished(),
                        0L,
                        false,
                        0,
                        0L,
                        0L,
                        video.getCourse().getCreator().getId(),
                        video.getCourse().getCreator().getUser().getName()
                );
        }

        @PreAuthorize("hasRole('CREATOR')")
        @PatchMapping("/creator/videos/{videoId}/unpublish")
        public VideoResponse unpublishVideo(
                        @PathVariable Long videoId,
                        Authentication authentication
                ) {
                VideoEntity video = userService.unpublishVideo(
                        authentication.getName(),
                        videoId
                );

                return new VideoResponse(
                        video.getId(),
                        video.getTitle(),
                        video.getDescription(),
                        video.getVideoUrl(),
                        video.getCourse().getId(),
                        video.isPublished(),
                        0L,
                        false,
                        0,
                        0L,
                        0L,
                        video.getCourse().getCreator().getId(),
                        video.getCourse().getCreator().getUser().getName()
                );
        }

        @GetMapping("/feed")
        public Page<VideoResponse> getFeed(
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "5") int size,
                Authentication authentication
        ) {

        String email = null;
        if (authentication != null) {
                email = authentication.getName();
        }

        return userService.getPersonalisedFeed(email, page, size);
        }

        @PostMapping("/videos/{videoId}/like")
        public String likeVideo(
        @PathVariable Long videoId,
                Authentication authentication
        ) {
                userService.likeVideo(authentication.getName(), videoId);
                return "Video liked successfully";
        }

        @PostMapping("/videos/{videoId}/unlike")
        public String unlikeVideo(
                @PathVariable Long videoId,
                Authentication authentication
        ) {
        userService.unlikeVideo(authentication.getName(), videoId);
        return "Video unliked successfully";
        }

        @PostMapping("/creators/{creatorId}/follow")
        public String followCreator(
                @PathVariable Long creatorId,
                Authentication authentication
        ) {
        userService.followCreator(authentication.getName(), creatorId);
        return "Followed successfully";
        }

        @PostMapping("/creators/{creatorId}/unfollow")
        public String unfollowCreator(
                @PathVariable Long creatorId,
                Authentication authentication
        ) {
        userService.unfollowCreator(authentication.getName(), creatorId);
        return "Unfollowed successfully";
        }

        @PostMapping("/comment")
        public CommentResponse addComment(
                @Valid @RequestBody CreateCommentRequest request,
                Authentication authentication
        ) {
        return userService.addComment(
                authentication.getName(),
                request
        );
        }

        @GetMapping("/comments/{videoId}")
        public List<CommentResponse> getComments(
                @PathVariable Long videoId
        ) {
        return userService.getComments(videoId);
        }

        @DeleteMapping("/comments/{id}")
        public String deleteComment(
                @PathVariable Long id,
                Authentication authentication
        ) {
        userService.deleteComment(id, authentication.getName());
        return "Comment deleted";
        }

        @GetMapping("/videos/{id}")
        public VideoResponse watchVideo(
                @PathVariable Long id,
                Authentication authentication
        ) {

        String email = null;
        if (authentication != null) {
                email = authentication.getName();
        }

        return userService.watchVideo(id, email);
        }

        @PreAuthorize("hasRole('CREATOR')")
        @DeleteMapping("/creator/videos/{videoId}")
        public String deleteVideo(
                @PathVariable Long videoId,
                Authentication authentication
        ) {
        userService.deleteVideo(authentication.getName(), videoId);
        return "Video deleted successfully";
        }

        @GetMapping("/me/liked-videos")
        public List<VideoResponse> getLikedVideos(Authentication authentication) {

        return userService.getLikedVideos(authentication.getName());
        }

        @GetMapping("/me/following")
        public List<CreatorPublicResponse> getFollowingCreators(Authentication authentication) {

        return userService.getFollowingCreators(authentication.getName());
        }

        @PreAuthorize("hasRole('CREATOR')")
        @PutMapping("/creators/profile")
        public CreatorPublicResponse updateCreatorProfile(
                @RequestBody UpdateCreatorProfileRequest request,
                Authentication authentication
        ) {

        CreatorProfileEntity updated =
                userService.updateCreatorProfile(
                        authentication.getName(),
                        request
                );

        return new CreatorPublicResponse(
                updated.getId(),
                updated.getUser().getName(),
                updated.getBio(),
                updated.getExpertise(),
                updated.getFollowersCount(),
                0L,
                0l,
                false
        );
        }
}