const Projects = {
  add(data, name) {
    const id = Date.now().toString()
    data.projects.push({ id, name })
    data.selectedProject = id
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
      div.textContent = p.name

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