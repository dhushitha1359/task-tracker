import { useEffect, useState } from 'react'

const emptyForm = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: '',
  projectId: '',
}

export default function TaskForm({ projects, editingTask, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate || '',
        projectId: editingTask.projectId,
      })
    } else {
      setForm(emptyForm)
    }
  }, [editingTask])

  const update = (field, value) => setForm({ ...form, [field]: value })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      projectId: Number(form.projectId),
      dueDate: form.dueDate || null,
    })
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <p className="section-title">{editingTask ? `Edit task #${editingTask.id}` : 'New task'}</p>
      <div className="form-grid">
        <div className="field full">
          <label>Title</label>
          <input
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Write the project README"
            required
          />
        </div>

        <div className="field full">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Optional details"
          />
        </div>

        <div className="field">
          <label>Project</label>
          <select value={form.projectId} onChange={(e) => update('projectId', e.target.value)} required>
            <option value="" disabled>Select a project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Due date</label>
          <input type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} />
        </div>

        <div className="field">
          <label>Status</label>
          <select value={form.status} onChange={(e) => update('status', e.target.value)}>
            <option value="TODO">To do</option>
            <option value="DOING">Doing</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className="field">
          <label>Priority</label>
          <select value={form.priority} onChange={(e) => update('priority', e.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit">{editingTask ? 'Save changes' : 'Add task'}</button>
        {editingTask && (
          <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  )
}
