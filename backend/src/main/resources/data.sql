-- Optional seed data. Not auto-run by default (see README to enable it).
INSERT INTO projects (name, description, created_at) VALUES
  ('Personal', 'Personal tasks and errands', NOW()),
  ('Work', 'Work-related tasks', NOW());
