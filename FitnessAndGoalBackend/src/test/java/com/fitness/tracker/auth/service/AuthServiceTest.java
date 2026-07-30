package com.fitness.tracker.auth.service;

import com.fitness.tracker.auth.dto.LoginRequest;
import com.fitness.tracker.auth.dto.LoginResponse;
import com.fitness.tracker.auth.dto.RegisterRequest;
import com.fitness.tracker.auth.dto.RegisterResponse;
import com.fitness.tracker.auth.service.impl.AuthServiceImpl;
import com.fitness.tracker.common.enums.ErrorCode;
import com.fitness.tracker.exception.BusinessException;
import com.fitness.tracker.security.jwt.JwtTokenProvider;
import com.fitness.tracker.security.service.RefreshTokenService;
import com.fitness.tracker.user.entity.Role;
import com.fitness.tracker.user.entity.User;
import com.fitness.tracker.user.repository.RoleRepository;
import com.fitness.tracker.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private User testUser;
    private Role userRole;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("Password123!");
        registerRequest.setFirstName("Test");
        registerRequest.setLastName("User");

        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("encodedPassword")
                .firstName("Test")
                .lastName("User")
                .build();

        userRole = new Role();
        userRole.setId(1L);
        userRole.setName(Role.RoleName.ROLE_USER);
    }

    @Test
    @DisplayName("Should register user successfully")
    void register_Success() {
        when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(roleRepository.findByName(Role.RoleName.ROLE_USER)).thenReturn(Optional.of(userRole));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        RegisterResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("User registered successfully", response.getMessage());
        assertEquals(1L, response.getUserId());

        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when username exists")
    void register_UsernameExists() {
        when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(true);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> authService.register(registerRequest));

        assertEquals(ErrorCode.USERNAME_ALREADY_EXISTS, exception.getErrorCode());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when email exists")
    void register_EmailExists() {
        when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> authService.register(registerRequest));

        assertEquals(ErrorCode.EMAIL_ALREADY_EXISTS, exception.getErrorCode());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should return false when username is taken")
    void isUsernameAvailable_Taken() {
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        boolean available = authService.isUsernameAvailable("existinguser");

        assertFalse(available);
    }

    @Test
    @DisplayName("Should return true when username is available")
    void isUsernameAvailable_Available() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);

        boolean available = authService.isUsernameAvailable("newuser");

        assertTrue(available);
    }
}
