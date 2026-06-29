const STATUS_LABEL = { TODO: 'To do', DOING: 'Doing', DONE: 'Done' }

export default function TaskTable({ tasks, onEdit, onDelete, onComplete }) {
  if (tasks.length === 0) {
    return <div className="empty-state">No tasks match these filters yet.</div>
  }

  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Project</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Due</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((t) => (
          <tr key={t.id}>
            <td>
              <strong>{t.title}</strong>
              {t.description && (
                <div style={{ color: '#777', fontSize: 12, marginTop: 2 }}>{t.description}</div>
              )}
            </td>
            <td>{t.projectName}</td>
            <td><span className={`badge status-${t.status}`}>{STATUS_LABEL[t.status]}</span></td>
            <td><span className={`badge priority-${t.priority}`}>{t.priority}</span></td>
            <td>{t.dueDate || '—'}</td>
            <td>
              <div className="row-actions">
                {t.status !== 'DONE' && (
                  <button className="secondary" onClick={() => onComplete(t)}>Complete</button>
                )}
                <button className="secondary" onClick={() => onEdit(t)}>Edit</button>
                <button className="danger" onClick={() => onDelete(t)}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
