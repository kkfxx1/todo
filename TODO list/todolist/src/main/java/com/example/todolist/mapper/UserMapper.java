package com.example.todolist.mapper;

import com.example.todolist.model.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {

    /**
     * 根据用户名查找用户
     * @param username 用户名
     * @return 找到的用户对象，如果找不到则返回 null
     */
    User findByUsername(String username);

    /**
     * 插入新用户
     *
     * @param user 用户对象
     */
    void insert(User user);
}