package com.example.todolist.mapper;

import com.example.todolist.model.Todo;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface TodoMapper {
    List<Todo> findAll(Long userId);

    Todo findById(Long id);

    List<Todo> findByKeyword(Long userId, String keyword);

    void insert(Todo todo);

    void update(Todo todo);

    void deleteById(Long id);

    List<Todo> findByUserId(Long userId);
}