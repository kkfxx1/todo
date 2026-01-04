package com.example.todolist.controller;

import com.example.todolist.dto.AuthRequest;
import com.example.todolist.dto.AuthResponse;
import com.example.todolist.model.User;
import com.example.todolist.service.UserService;
import com.example.todolist.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 用户注册接口
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest authRequest) {
        try {

            User registeredUser = userService.register(authRequest);

            // 注册成功后，直接返回成功消息，不返回用户信息
            return ResponseEntity.status(HttpStatus.CREATED).body("注册成功");
        } catch (RuntimeException e) {
            // 捕获 UserService 抛出的异常（如用户名已存在）
            // 返回 400 Bad Request 状态码和错误信息
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * 用户登录接口
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        try {

            User authenticatedUser = userService.login(authRequest);

            String token = jwtUtil.generateToken(authenticatedUser.getUsername());

            AuthResponse authResponse = new AuthResponse();
            authResponse.setToken(token);
            authResponse.setId(authenticatedUser.getId());
            authResponse.setUsername(authenticatedUser.getUsername());

            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e) {
            // 登录失败，返回 401 Unauthorized 状态码
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}