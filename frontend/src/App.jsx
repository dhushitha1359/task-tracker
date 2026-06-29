import { useEffect, useState, useCallback } from 'react'
import { api } from './api'
import FilterBar from './components/FilterBar'
import TaskForm from './components/TaskForm'
import TaskTable from './components/TaskTable'
import ErrorBanner from './components/ErrorBanner'

const PAGE_SIZE = 8

export default function App() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0, totalElements: 0 })
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    projectId: '',
    sortBy: 'dueDate',
    sortDir: 'asc',
  })
  const [editingTask, setEditingTask] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadProjects = useCallback(async () => {
    try {
      const data = await api.listProjects()
      setProjects(data)
    } catch (err) {
      setError(err)
    }
  }, [])

  const loadTasks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.listTasks({ ...filters, page, size: PAGE_SIZE })
      setTasks(data.items)
      setPageInfo({ page: data.page, totalPages: data.totalPages, totalElements: data.totalElements })
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => { loadProjects() }, [loadProjects])
  useEffect(() => { loadTasks() }, [loadTasks])

  const handleFiltersChange = (next) => {
    setFilters(next)
    setPage(0)
  }

  const handleCreateOrUpdate = async (formData) => {
    setError(null)
    try {
      if (editingTask) {
        await api.updateTask(editingTask.id, formData)
      } else {
        await api.createTask(formData)
      }
      setEditingTask(null)
      await loadTasks()
    } catch (err) {
      setError(err)
    }
  }

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return
    setError(null)
    try {
      await api.deleteTask(task.id)
      await loadTasks()
    } catch (err) {
      setError(err)
    }
  }

  const handleComplete = async (task) => {
    setError(null)
    try {
      await api.setTaskStatus(task.id, 'DONE')
      await loadTasks()
    } catch (err) {
      setError(err)
    }
  }

  return (
    <div className="app">
      <h1>Task Tracker</h1>
      <p className="subtitle">A small full-stack task tracker — Spring Boot + MySQL on the backend, React on the front.</p>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <TaskForm
        projects={projects}
        editingTask={editingTask}
        onSubmit={handleCreateOrUpdate}
        onCancel={() => setEditingTask(null)}
      />

      <FilterBar filters={filters} onChange={handleFiltersChange} projects={projects} />

      <div className="card">
        <p className="section-title">Tasks {loading ? '(loading…)' : `(${pageInfo.totalElements})`}</p>
        <TaskTable
          tasks={tasks}
          onEdit={setEditingTask}
          onDelete={handleDelete}
          onComplete={handleComplete}
        />
        <div className="pagination">
          <span>Page {pageInfo.page + 1} of {Math.max(pageInfo.totalPages, 1)}</span>
          <div className="row-actions">
            <button
              className="secondary"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
            >
              Previous
            </button>
            <button
              className="secondary"
              disabled={page + 1 >= pageInfo.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
