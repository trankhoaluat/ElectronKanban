const Projects = {
  add(data, name) {
    const id = Date.now().toString()
    data.projects.push({ id, name, description: "", color: "#F9C74F" })
    data.selectedProject = id
  },

  remove(data, id) {
    data.projects = data.projects.filter(p => p.id !== id)
    data.tasks = data.tasks.filter(t => t.projectId !== id)
    if (data.selectedProject === id) {
      data.selectedProject = data.projects.length ? data.projects[0].id : null
    }
  },

  select(data, id) {
    data.selectedProject = id
  },

  render(data) {
    const container = document.getElementById("projects")
    container.innerHTML = ""

    data.projects.forEach(p => {
      const div = document.createElement("div")
      div.className = "card"
      // apply project color so the card reflects chosen color
      div.style.background = p.color || '#c3b22e'
      div.textContent = p.name

      // edit button for project
      const edit = document.createElement('button')
      edit.className = 'edit-btn'
      edit.textContent = '✎'
      edit.onclick = (e) => {
        e.stopPropagation()
        Modal.openProject(data, p)
      }
      div.appendChild(edit)

      // delete button for project
      const del = document.createElement('button')
      del.className = 'delete-btn'
      del.textContent = '✕'
      del.onclick = (e) => {
        e.stopPropagation()
        if (!confirm(`Delete project "${p.name}" and its tasks?`)) return
        Projects.remove(data, p.id)
        Storage.save(data)
        App.render()
      }
      div.appendChild(del)

      if (p.id === data.selectedProject)
        // div.style.background = "#555"
        div.style.outline = "2px solid #f4f5f5"

      div.onclick = () => {
        Projects.select(data, p.id)
        App.render()
      }

      container.appendChild(div)
    })
  }
}