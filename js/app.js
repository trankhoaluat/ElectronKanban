const App = {
  data: Storage.load(),

init() {

  document.getElementById("createProjectBtn")
    .onclick = () => {
      const name = prompt("Project name?")
      if (!name) return

      Projects.add(App.data, name)
      Storage.save(App.data)
      App.render()
    }

  document.getElementById("createTaskBtn")
    .onclick = () => {

      if (!App.data.selectedProject) {
        alert("Select a project first.")
        return
      }

      const text = prompt("Task title?")
      if (!text) return

      Tasks.add(App.data, text)
      Storage.save(App.data)
      App.render()
    }

    App.render()
  },

  render() {
    Projects.render(App.data)
    Tasks.render(App.data)
    Storage.save(App.data)
  }
}

App.init()