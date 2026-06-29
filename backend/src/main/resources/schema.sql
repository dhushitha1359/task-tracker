-- Reference schema (for documentation / manual setup).
-- The running application creates/updates these tables automatically via Hibernate
-- (spring.jpa.hibernate.ddl-auto=update), driven by the entity mappings in
-- com.tasktracker.model. This file is the canonical, human-readable version of that schema.

CREATE TABLE IF NOT EXISTS projects (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    description VARCHAR(500),
    created_at  DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(150) NOT NULL,
    description VARCHAR(2000),
    status      VARCHAR(10) NOT NULL,   -- TODO | DOING | DONE
    priority    VARCHAR(10) NOT NULL,   -- LOW | MEDIUM | HIGH
    due_date    DATE,
    created_at  DATETIME NOT NULL,
    updated_at  DATETIME NOT NULL,
    project_id  BIGINT NOT NULL,
    CONSTRAINT fk_tasks_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Supports the list endpoint's default sort (sortBy=dueDate) and filter-by-status queries.
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
