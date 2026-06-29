package com.tasktracker.dto;

import com.tasktracker.model.Priority;
import com.tasktracker.model.Task;
import com.tasktracker.model.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long projectId;
    private String projectName;

    public static TaskResponse from(Task t) {
        TaskResponse r = new TaskResponse();
        r.id = t.getId();
        r.title = t.getTitle();
        r.description = t.getDescription();
        r.status = t.getStatus();
        r.priority = t.getPriority();
        r.dueDate = t.getDueDate();
        r.createdAt = t.getCreatedAt();
        r.updatedAt = t.getUpdatedAt();
        if (t.getProject() != null) {
            r.projectId = t.getProject().getId();
            r.projectName = t.getProject().getName();
        }
        return r;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public TaskStatus getStatus() { return status; }
    public Priority getPriority() { return priority; }
    public LocalDate getDueDate() { return dueDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public Long getProjectId() { return projectId; }
    public String getProjectName() { return projectName; }
}
