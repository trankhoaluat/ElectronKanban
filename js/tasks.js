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
    ["todo", "doing", "done"].forEach(col =>
      document.getElementById(col).innerHTML = ""
    )

    data.tasks
      .filter(t => t.projectId === data.selectedProject)
      .forEach(task => {
        const div = document.createElement("div")
        div.className = "card"
        div.style.background = task.color
        div.textContent = task.text

        div.onclick = () => Modal.open(data, task)

        document.getElementById(task.status)
          .appendChild(div)
      })
  }
}