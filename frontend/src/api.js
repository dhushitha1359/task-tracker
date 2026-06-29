const API_BASE = 'http://localhost:8080/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    let payload = null
    try {
      payload = await res.json()
    } catch (_) {
      // response had no JSON body
    }
    const error = new Error(payload?.message || `Request failed with status ${res.status}`)
    error.status = res.status
    error.details = payload?.details || null
    throw error
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  listTasks: (params) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
    )
    return request(`/tasks?${query.toString()}`)
  },
  getTask: (id) => request(`/tasks/${id}`),
  createTask: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  setTaskStatus: (id, status) => request(`/tasks/${id}/status?status=${status}`, { method: 'PATCH' }),
  listProjects: () => request('/projects'),
  createProject: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
}
