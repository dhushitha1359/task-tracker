package com.tasktracker.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tasktracker.model.Project;
import com.tasktracker.repository.ProjectRepository;
import com.tasktracker.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    private Long projectId;

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
        projectRepository.deleteAll();
        Project project = new Project();
        project.setName("Test Project");
        project.setDescription("Project used in tests");
        projectId = projectRepository.save(project).getId();
    }

    private Map<String, Object> sampleTaskPayload() {
        Map<String, Object> body = new HashMap<>();
        body.put("title", "Write tests");
        body.put("description", "Cover core CRUD endpoints");
        body.put("status", "TODO");
        body.put("priority", "HIGH");
        body.put("dueDate", LocalDate.now().plusDays(3).toString());
        body.put("projectId", projectId);
        return body;
    }

    @Test
    void createTask_returns201WithSavedTask() throws Exception {
        mockMvc.perform(post("/api/tasks")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(sampleTaskPayload())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title").value("Write tests"))
                .andExpect(jsonPath("$.status").value("TODO"))
                .andExpect(jsonPath("$.projectId").value(projectId));
    }

    @Test
    void createTask_withBlankTitle_returns422() throws Exception {
        Map<String, Object> body = sampleTaskPayload();
        body.put("title", "");

        mockMvc.perform(post("/api/tasks")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.details", hasItem(containsString("title"))));
    }

    @Test
    void createTask_withUnknownProject_returns404() throws Exception {
        Map<String, Object> body = sampleTaskPayload();
        body.put("projectId", 999999L);

        mockMvc.perform(post("/api/tasks")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isNotFound());
    }

    @Test
    void getTask_unknownId_returns404() throws Exception {
        mockMvc.perform(get("/api/tasks/999999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void fullCrudLifecycle_createUpdateListDelete() throws Exception {
        // create
        String response = mockMvc.perform(post("/api/tasks")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(sampleTaskPayload())))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long taskId = objectMapper.readTree(response).get("id").asLong();

        // update
        Map<String, Object> updatePayload = sampleTaskPayload();
        updatePayload.put("title", "Write more tests");
        updatePayload.put("status", "DOING");

        mockMvc.perform(put("/api/tasks/" + taskId)
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(updatePayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Write more tests"))
                .andExpect(jsonPath("$.status").value("DOING"));

        // list with filter
        mockMvc.perform(get("/api/tasks")
                        .param("status", "DOING")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].id").value(taskId));

        // delete
        mockMvc.perform(delete("/api/tasks/" + taskId))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/tasks/" + taskId))
                .andExpect(status().isNotFound());
    }

    @Test
    void listTasks_pagination_returnsRequestedPageSize() throws Exception {
        for (int i = 0; i < 5; i++) {
            Map<String, Object> payload = sampleTaskPayload();
            payload.put("title", "Task " + i);
            mockMvc.perform(post("/api/tasks")
                            .contentType("application/json")
                            .content(objectMapper.writeValueAsString(payload)))
                    .andExpect(status().isCreated());
        }

        mockMvc.perform(get("/api/tasks").param("page", "0").param("size", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(2)))
                .andExpect(jsonPath("$.totalElements").value(5))
                .andExpect(jsonPath("$.totalPages").value(3));
    }
}
