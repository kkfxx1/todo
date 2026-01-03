package com.example.todolist.mapper;

import com.example.todolist.model.Todo;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface TodoMapper {
    List<Todo> findAll();

    Todo findById(Long id);

    List<Todo> findByKeyword(String keyword);

    int insert(Todo todo);

    int update(Todo todo);

    int deleteById(Long id);
}