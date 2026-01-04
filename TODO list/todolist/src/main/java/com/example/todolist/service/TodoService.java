package com.example.todolist.service;

import com.example.todolist.mapper.TodoMapper;
import com.example.todolist.mapper.UserMapper;
import com.example.todolist.model.Todo;
import com.example.todolist.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TodoService {
    private final TodoMapper todoMapper;
    private final UserMapper userMapper;

    @Autowired
    public TodoService(TodoMapper todoMapper, UserMapper userMapper) {
        this.todoMapper = todoMapper;
        this.userMapper = userMapper;
    }

    public List<Todo> getAllTodos(String username) {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found.");
        }
        return todoMapper.findByUserId(user.getId());
    }

    public Todo getTodoById(Long id, String username) {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found.");
        }
        Todo todo = todoMapper.findById(id);
        if (todo == null || !todo.getUserId().equals(user.getId())) {
            throw new RuntimeException("Todo not found or access denied.");
        }
        return todo;
    }

    public List<Todo> searchTodos(String keyword, String username) {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found.");
        }
        return todoMapper.findByKeyword(user.getId(), keyword);
    }

    public Todo createTodo(Todo todo, String username) {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found.");
        }
        todo.setUserId(user.getId());
        todoMapper.insert(todo);
        return todo;
    }

    public Todo updateTodo(Long id, Todo todo, String username) {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found.");
        }

        Todo existingTodo = todoMapper.findById(id);
        if (existingTodo == null || !existingTodo.getUserId().equals(user.getId())) {
            throw new RuntimeException("Todo not found or access denied.");
        }

        todo.setId(id);
        todo.setUserId(user.getId());
        todoMapper.update(todo);
        return todo;
    }

    public void deleteTodo(Long id, String username) {
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found.");
        }

        Todo existingTodo = todoMapper.findById(id);
        if (existingTodo == null || !existingTodo.getUserId().equals(user.getId())) {
            throw new RuntimeException("Todo not found or access denied.");
        }

        todoMapper.deleteById(id);
    }
}