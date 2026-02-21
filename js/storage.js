const Storage = {
  load() {
    return JSON.parse(localStorage.getItem("kanban")) || {
      projects: [],
      tasks: [],
      selectedProject: null
    }
  },

  save(data) {
    localStorage.setItem("kanban", JSON.stringify(data))
  }
}