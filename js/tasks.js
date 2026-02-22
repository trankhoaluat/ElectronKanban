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
    if (task.status === "todo") {
      // enforce only one doing task per project
      const existing = task && task.projectId ?
        App.data.tasks.find(t => t.projectId === task.projectId && t.status === 'doing') : null
      if (existing && existing.id !== task.id) {
        alert('There is already a task in DOING. Finish it before starting another.')
        return
      }
      task.status = "doing"
      if (typeof App !== 'undefined' && App.startTimer) App.startTimer()
    }
    else if (task.status === "doing") {
      task.status = "done"
      // if no more doing tasks for this project, reset timer
      const anyDoing = App.data.tasks.some(t => t.projectId === task.projectId && t.status === 'doing')
      if (!anyDoing && typeof App !== 'undefined' && App.resetTimer) App.resetTimer()
    }
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
        // enforce single DOING
        if (col === 'doing') {
          const existing = data.tasks.find(t => t.projectId === data.selectedProject && t.status === 'doing')
          if (existing && existing.id !== task.id) {
            alert('Only one task can be in DOING at a time. Finish or move the current task first.')
            return
          }
        }

        const prevStatus = task.status
        task.status = col
        if (col === 'doing' && typeof App !== 'undefined' && App.startTimer) {
          App.startTimer()
        }
        // if moved out of doing and now none left, reset timer
        if (prevStatus === 'doing' && col !== 'doing') {
          const anyDoing = data.tasks.some(t => t.projectId === data.selectedProject && t.status === 'doing')
          if (!anyDoing && typeof App !== 'undefined' && App.resetTimer) App.resetTimer()
        }
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
          const wasDoing = task.status === 'doing'
          data.tasks = data.tasks.filter(t => t.id !== task.id)
          Storage.save(data)
          App.render()
          if (wasDoing) {
            const anyDoing = data.tasks.some(t => t.projectId === data.selectedProject && t.status === 'doing')
            if (!anyDoing && typeof App !== 'undefined' && App.resetTimer) App.resetTimer()
          }
        }
        div.appendChild(del)

        div.onclick = () => Modal.open(data, task)

        document.getElementById(task.status)
          .appendChild(div)
      })
  }
}