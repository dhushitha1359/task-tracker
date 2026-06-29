export default function FilterBar({ filters, onChange, projects }) {
  const update = (field, value) => onChange({ ...filters, [field]: value })

  return (
    <div className="card">
      <p className="section-title">Filters &amp; sorting</p>
      <div className="filters">
        <div className="field">
          <label>Status</label>
          <select value={filters.status} onChange={(e) => update('status', e.target.value)}>
            <option value="">All</option>
            <option value="TODO">To do</option>
            <option value="DOING">Doing</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className="field">
          <label>Priority</label>
          <select value={filters.priority} onChange={(e) => update('priority', e.target.value)}>
            <option value="">All</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="field">
          <label>Project</label>
          <select value={filters.projectId} onChange={(e) => update('projectId', e.target.value)}>
            <option value="">All</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Sort by</label>
          <select value={filters.sortBy} onChange={(e) => update('sortBy', e.target.value)}>
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="createdAt">Created</option>
            <option value="title">Title</option>
          </select>
        </div>

        <div className="field">
          <label>Direction</label>
          <select value={filters.sortDir} onChange={(e) => update('sortDir', e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  )
}
