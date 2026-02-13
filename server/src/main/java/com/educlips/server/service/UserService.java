package com.educlips.server.service;

import com.educlips.server.dto.CreateCourseRequest;
import com.educlips.server.dto.CreateCreatorProfileRequest;
import com.educlips.server.dto.CreateVideoRequest;
import com.educlips.server.dto.LoginResponse;
import com.educlips.server.dto.SignupRequest;
import com.educlips.server.dto.UserResponse;
import org.springframework.stereotype.Service;
import com.educlips.server.entity.UserEntity;
import com.educlips.server.exception.EmailAlreadyExistsException;
import com.educlips.server.exception.InvalidCredentialsException;
import com.educlips.server.exception.UserNotFoundException;
import com.educlips.server.repository.CourseRepository;
import com.educlips.server.repository.CreatorProfileRepository;
import com.educlips.server.repository.UserRepository;
import com.educlips.server.security.JwtUtil;
import java.util.HashMap;
import java.util.Map;
import com.educlips.server.entity.UserRole;
import com.educlips.server.entity.VideoEntity;
import com.educlips.server.entity.VideoLikeEntity;
import com.educlips.server.repository.VideoRepository;
import com.educlips.server.repository.VideoLikeRepository;

import java.util.List;

import com.educlips.server.entity.CourseEntity;
import com.educlips.server.entity.CreatorProfileEntity;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;





@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CreatorProfileRepository creatorProfileRepository;
    private final CourseRepository courseRepository;
    private final VideoRepository videoRepository;
    private final VideoLikeRepository videoLikeRepository;
    


    
    public UserService(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            CreatorProfileRepository creatorProfileRepository,
            CourseRepository courseRepository,
            VideoRepository videoRepository,
            VideoLikeRepository videoLikeRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.creatorProfileRepository = creatorProfileRepository;
        this.courseRepository = courseRepository;
        this.videoRepository = videoRepository;
        this.videoLikeRepository = videoLikeRepository;
    }


    public UserResponse signup(SignupRequest request) {

    // Check if email already exists
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new EmailAlreadyExistsException("Email already registered");
    }

    // Create user entity
    UserEntity user = new UserEntity();

    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(UserRole.valueOf(request.getRole())
);


    // Save user
    UserEntity savedUser = userRepository.save(user);

    // Return response (NO password)
    return new UserResponse(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getRole().name()
    );
}


    public LoginResponse login(String email, String password) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());

        String token = jwtUtil.generateToken(
                user.getEmail(),
                claims
        );

        return new LoginResponse(token);
    }

    public UserEntity getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Page<UserResponse> getAllUsers(int page, int size) {

    Pageable pageable = PageRequest.of(page, size);

    return userRepository.findAll(pageable)
            .map(user -> new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name()
            ));
    }

    public Page<UserResponse> getAllUsers(Pageable pageable) {

        return userRepository.findAll(pageable)
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name()
                ));
    }

    public CreatorProfileEntity createCreatorProfile(
            String email,
            CreateCreatorProfileRequest request
    ) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().name().equals("CREATOR")) {
            throw new InvalidCredentialsException("Only creators can create profile");
        }

        if (creatorProfileRepository.findByUser(user).isPresent()) {
            throw new InvalidCredentialsException("Creator profile already exists");
        }

        CreatorProfileEntity profile = new CreatorProfileEntity();
        profile.setUser(user);
        profile.setBio(request.getBio());
        profile.setExpertise(request.getExpertise());

        return creatorProfileRepository.save(profile);
    }

    public CreatorProfileEntity getMyCreatorProfile(String email) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != UserRole.CREATOR) {
            throw new RuntimeException("Only creators have profiles");
        }

        return creatorProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Creator profile not found"));
    }

    public CreatorProfileEntity getCreatorProfileById(Long id) {
        return creatorProfileRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Creator profile not found"));
    }


    public CourseEntity createCourse(
            String email,
            CreateCourseRequest request
    ) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().name().equals("CREATOR")) {
            throw new RuntimeException("Only creators can create courses");
        }

        CreatorProfileEntity creatorProfile =
                creatorProfileRepository.findByUser(user)
                        .orElseThrow(() ->
                                new RuntimeException("Creator profile not found"));

        CourseEntity course = new CourseEntity();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCategory(request.getCategory());
        course.setPublished(false);
        course.setCreator(creatorProfile);

        return courseRepository.save(course);
    }

    public List<CourseEntity> getMyCourses(String email) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().name().equals("CREATOR")) {
            throw new RuntimeException("Only creators can view their courses");
        }

        CreatorProfileEntity creatorProfile =
                creatorProfileRepository.findByUser(user)
                        .orElseThrow(() -> new RuntimeException("Creator profile not found"));

        return courseRepository.findByCreator(creatorProfile);
    }

    public List<CourseEntity> getPublishedCourses() {
        return courseRepository.findByPublishedTrue();
    }

    public CourseEntity publishCourse(Long courseId, String email) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != UserRole.CREATOR) {
            throw new RuntimeException("Only creators can publish courses");
        }

        CreatorProfileEntity creatorProfile =
                creatorProfileRepository.findByUser(user)
                        .orElseThrow(() -> new RuntimeException("Creator profile not found"));

        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Ownership check - only the creator who owns the course can publish it
        if (!course.getCreator().getId().equals(creatorProfile.getId())) {
            throw new RuntimeException("You do not own this course");
        }

        course.setPublished(true);
        return courseRepository.save(course);
    }

    public CourseEntity unpublishCourse(Long courseId, String email) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != UserRole.CREATOR) {
            throw new RuntimeException("Only creators can unpublish courses");
        }

        CreatorProfileEntity creatorProfile =
                creatorProfileRepository.findByUser(user)
                        .orElseThrow(() -> new RuntimeException("Creator profile not found"));

        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getCreator().getId().equals(creatorProfile.getId())) {
            throw new RuntimeException("You do not own this course");
        }

        course.setPublished(false);
        return courseRepository.save(course);
    }

    public VideoEntity addVideoToCourse(
            String email,
            Long courseId,
            CreateVideoRequest request
    ) {
        // 1. Get user
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().name().equals("CREATOR")) {
            throw new RuntimeException("Only creators can add videos");
        }

        // 2. Get creator profile
        CreatorProfileEntity creatorProfile =
                creatorProfileRepository.findByUser(user)
                        .orElseThrow(() -> new RuntimeException("Creator profile not found"));

        // 3. Get course
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // 4. Ownership check
        if (!course.getCreator().getId().equals(creatorProfile.getId())) {
            throw new RuntimeException("You do not own this course");
        }

        // 5. Create video
        VideoEntity video = new VideoEntity();
        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setVideoUrl(request.getVideoUrl());
        video.setOrderIndex(request.getOrderIndex());
        video.setPublished(false);
        video.setCourse(course);

        return videoRepository.save(video);
    }

    public List<VideoEntity> getVideosForCreator(
            String email,
            Long courseId
    ) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().name().equals("CREATOR")) {
            throw new RuntimeException("Only creators can view course videos");
        }

        CreatorProfileEntity creatorProfile =
                creatorProfileRepository.findByUser(user)
                        .orElseThrow(() -> new RuntimeException("Creator profile not found"));

        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Ownership check
        if (!course.getCreator().getId().equals(creatorProfile.getId())) {
            throw new RuntimeException("You do not own this course");
        }

        return videoRepository.findByCourseOrderByOrderIndexAsc(course);
    }

    public List<VideoEntity> getPublishedVideosForCourse(Long courseId) {

        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return videoRepository
                .findByCourseAndPublishedTrueOrderByOrderIndexAsc(course);
    }

    public VideoEntity publishVideo(
            String email,
            Long videoId
    ) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().name().equals("CREATOR")) {
            throw new RuntimeException("Only creators can publish videos");
        }

        CreatorProfileEntity creatorProfile =
                creatorProfileRepository.findByUser(user)
                        .orElseThrow(() -> new RuntimeException("Creator profile not found"));

        VideoEntity video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        // Ownership check via course
        if (!video.getCourse().getCreator().getId()
                .equals(creatorProfile.getId())) {
            throw new RuntimeException("You do not own this video");
        }

        video.setPublished(true);
        return videoRepository.save(video);
    }

    public VideoEntity unpublishVideo(
            String email,
            Long videoId
    ) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().name().equals("CREATOR")) {
            throw new RuntimeException("Only creators can unpublish videos");
        }

        CreatorProfileEntity creatorProfile =
                creatorProfileRepository.findByUser(user)
                        .orElseThrow(() -> new RuntimeException("Creator profile not found"));

        VideoEntity video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        if (!video.getCourse().getCreator().getId()
                .equals(creatorProfile.getId())) {
            throw new RuntimeException("You do not own this video");
        }

        video.setPublished(false);
        return videoRepository.save(video);
    }

    public Page<VideoEntity> getGlobalFeed(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return videoRepository
                .findByPublishedTrueOrderByIdDesc(pageable);
        }

    public void likeVideo(String email, Long videoId) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        VideoEntity video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        // Prevent duplicate like
        if (videoLikeRepository.findByUserAndVideo(user, video).isPresent()) {
                throw new RuntimeException("You already liked this video");
        }

        VideoLikeEntity like = new VideoLikeEntity();
        like.setUser(user);
        like.setVideo(video);

        videoLikeRepository.save(like);
        }

}
