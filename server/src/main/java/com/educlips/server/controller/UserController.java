package com.educlips.server.controller;

import com.educlips.server.dto.LoginRequest;
import com.educlips.server.dto.LoginResponse;
import com.educlips.server.dto.SignupRequest;
import com.educlips.server.dto.UserResponse;
import com.educlips.server.entity.UserEntity;
import com.educlips.server.mapper.CreatorProfileMapper;
import com.educlips.server.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.RequestParam;

import com.educlips.server.dto.CourseResponse;
import com.educlips.server.dto.CreateCourseRequest;
import com.educlips.server.dto.CreateCreatorProfileRequest;
import com.educlips.server.dto.CreatorProfileResponse;
import com.educlips.server.entity.CourseEntity;
import com.educlips.server.entity.CreatorProfileEntity;



@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/test")
    public UserResponse testUser() {
        return new UserResponse(
                1L,
                "Ritesh",
                "ritesh@email.com",
                "STUDENT"
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

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
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
    
     public UserController(UserService userService, CreatorProfileMapper creatorProfileMapper) {
        this.userService = userService;
        this.creatorProfileMapper = creatorProfileMapper;
    }

    @PreAuthorize("hasRole('CREATOR')")
    @GetMapping("/creator/profile")
    public CreatorProfileResponse getMyCreatorProfile(Authentication authentication) {
        return creatorProfileMapper.toResponse(
                userService.getMyCreatorProfile(authentication.getName())
        );
    }

    @GetMapping("/creator/{id}")
    public CreatorProfileResponse getCreatorProfile(@PathVariable Long id) {
        CreatorProfileEntity profile = userService.getCreatorProfileById(id);

        return new CreatorProfileResponse(
                profile.getId(),
                profile.getUser().getName(),
                profile.getUser().getEmail(),
                profile.getBio(),
                profile.getExpertise(),
                profile.getFollowersCount()
        );
    }

    CourseResponse cr = new CourseResponse(1L, "Java Basics", "Learn Java from scratch", "Programming", true);

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
                course.isPublished()
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
                        course.isPublished()
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
                        course.isPublished()
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
                course.isPublished()
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
                course.isPublished()
        );
        }

}