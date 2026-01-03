package com.example.todolist.service;

import com.example.todolist.mapper.TodoMapper;
import com.example.todolist.model.Todo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TodoService {
    private final TodoMapper todoMapper;

    @Autowired
    public TodoService(TodoMapper todoMapper) {
        this.todoMapper = todoMapper;
    }

    public List<Todo> getAllTodos() {
        return todoMapper.findAll();
    }

    public Todo getTodoById(Long id) {
        return todoMapper.findById(id);
    }

    public List<Todo> searchTodos(String keyword) {
        return todoMapper.findByKeyword(keyword);
    }

    public Todo createTodo(Todo todo) {
        todoMapper.insert(todo);
        return todo;
    }

    public Todo updateTodo(Todo todo) {
        todoMapper.update(todo);
        return todo;
    }

    public void deleteTodo(Long id) {
        todoMapper.deleteById(id);
    }
}