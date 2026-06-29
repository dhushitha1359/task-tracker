package com.tasktracker.repository;

import com.tasktracker.model.Priority;
import com.tasktracker.model.Task;
import com.tasktracker.model.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Filtering by optional status/priority/projectId, pagination + sorting handled by Pageable.
    @Query("SELECT t FROM Task t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:projectId IS NULL OR t.project.id = :projectId)")
    Page<Task> search(@Param("status") TaskStatus status,
                       @Param("priority") Priority priority,
                       @Param("projectId") Long projectId,
                       Pageable pageable);
}
