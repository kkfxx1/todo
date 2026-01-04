package com.example.todolist.service;

import com.example.todolist.mapper.UserMapper;
import com.example.todolist.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.todolist.dto.AuthRequest;

@Service
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 用户注册
     */
    public User register(AuthRequest authRequest) {
        // 检查用户名是否已被注册
        if (userMapper.findByUsername(authRequest.getUsername()) != null) {
            throw new RuntimeException("Username is already taken!");
        }

        // 创建一个新的 User 实体来存储
        User userToSave = new User();
        userToSave.setUsername(authRequest.getUsername());

        // 对密码进行加密并设置
        String encodedPassword = passwordEncoder.encode(authRequest.getPassword());
        userToSave.setPassword(encodedPassword);

        // 保存用户到数据库
        userMapper.insert(userToSave);

        // 为了安全，返回时不携带密码
        userToSave.setPassword(null);
        return userToSave;
    }

    /**
     * 用户登录
     */
    public User login(AuthRequest authRequest) {
        // 根据用户名查找用户
        User user = userMapper.findByUsername(authRequest.getUsername());
        if (user == null) {
            throw new RuntimeException("Invalid username or password!");
        }

        // 校验密码
        if (!passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password!");
        }

        // 登录成功，返回用户信息（不携带密码）
        user.setPassword(null);
        return user;
    }

    /**
     * 根据用户名查找用户
     */
    public User findByUsername(String username) {
        return userMapper.findByUsername(username);
    }
}