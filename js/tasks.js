const Tasks = {
  add(data, text) {
    if (!data.selectedProject) return

    data.tasks.push({
      id: Date.now().toString(),
      text,
      status: "todo",
      projectId: data.selectedProject,
      color: "#c3b22e"
    })
  },

  move(task) {
    if (task.status === "todo") task.status = "doing"
    else if (task.status === "doing") task.status = "done"
  },

  render(data) {
    ["todo", "doing", "done"].forEach(col => {
      const colEl = document.getElementById(col)
      colEl.innerHTML = ""

      colEl.ondragover = (e) => {
        e.preventDefault()
        colEl.classList.add('drag-over')
      }

      colEl.ondragleave = () => colEl.classList.remove('drag-over')

      colEl.ondrop = (e) => {
        e.preventDefault()
        colEl.classList.remove('drag-over')
        const id = e.dataTransfer.getData('text/plain')
        const task = data.tasks.find(t => t.id === id)
        if (!task) return
        task.status = col
        Storage.save(data)
        App.render()
      }
    })

    data.tasks
      .filter(t => t.projectId === data.selectedProject)
      .forEach(task => {
        const div = document.createElement("div")
        div.className = "card"
        div.style.background = task.color
        div.textContent = task.text

        div.draggable = true
        div.ondragstart = (e) => {
          e.dataTransfer.setData('text/plain', task.id)
          e.dataTransfer.effectAllowed = 'move'
          setTimeout(() => div.classList.add('dragging'), 0)
        }

        div.ondragend = () => div.classList.remove('dragging')

        const del = document.createElement('button')
        del.className = 'delete-btn'
        del.textContent = '✕'
        del.onclick = (e) => {
          e.stopPropagation()
          if (!confirm(`Delete task "${task.text}"?`)) return
          data.tasks = data.tasks.filter(t => t.id !== task.id)
          Storage.save(data)
          App.render()
        }
        div.appendChild(del)

        div.onclick = () => Modal.open(data, task)

        document.getElementById(task.status)
          .appendChild(div)
      })
  }
}