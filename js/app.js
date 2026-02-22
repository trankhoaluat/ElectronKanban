const App = {
  data: Storage.load(),

  // Timer settings (seconds)
  timerDuration: 25 * 60,
  timerRemaining: 25 * 60,
  timerInterval: null,
  timerRunning: false,

  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  },

  updateTimerDisplay() {
    const el = document.querySelector('.timer')
    if (!el) return
    el.textContent = this.formatTime(this.timerRemaining)
    const btn = document.getElementById('timerToggleBtn')
    if (btn) btn.textContent = this.timerRunning ? 'Stop' : 'Start'
  },

  startTimer() {
    if (this.timerRunning) return
    this.timerRunning = true
    this.updateTimerDisplay()
    this.timerInterval = setInterval(() => {
      if (this.timerRemaining <= 0) {
        this.stopTimer()
        return
      }
      this.timerRemaining -= 1
      this.updateTimerDisplay()
    }, 1000)
  },

  stopTimer() {
    this.timerRunning = false
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
    this.updateTimerDisplay()
  },

  toggleTimer() {
    if (this.timerRunning) this.stopTimer()
    else this.startTimer()
  },

  resetTimer() {
    this.stopTimer()
    this.timerRemaining = this.timerDuration
    this.updateTimerDisplay()
  },

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

    // Wire timer button
    const timerBtn = document.getElementById('timerToggleBtn')
    if (timerBtn) timerBtn.onclick = () => App.toggleTimer()

    // Wire menu button toggle
    const menuBtn = document.getElementById('menuBtn')
    const menu = document.getElementById('menu')
    if (menuBtn && menu) {
      menuBtn.onclick = () => menu.classList.toggle('hidden')
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-container')) {
          menu.classList.add('hidden')
        }
      })
    }

    // Wire export button
    const exportBtn = document.getElementById('exportBtn')
    if (exportBtn) {
      exportBtn.onclick = () => {
        Export.downloadJSON(App.data)
        menu.classList.add('hidden')
      }
    }

    // Wire import button
    const importBtn = document.getElementById('importBtn')
    if (importBtn) {
      importBtn.onclick = () => {
        Export.uploadJSON((imported) => {
          if (!confirm('This will replace all current projects and tasks. Continue?')) return
          App.data = imported
          Storage.save(App.data)
          App.render()
        })
        menu.classList.add('hidden')
      }
    }

    // initialize timer display from defaults
    this.timerRemaining = this.timerDuration
    this.updateTimerDisplay()

    App.render()
  },

  render() {
    Projects.render(App.data)
    Tasks.render(App.data)

    // update DONE count in header for selected project
    const doneEl = document.getElementById('doneCount')
    if (doneEl) {
      const selected = App.data.selectedProject
      const projectTasks = selected ? App.data.tasks.filter(t => t.projectId === selected) : []
      const count = projectTasks.filter(t => t.status === 'done').length
      const total = projectTasks.length
      doneEl.textContent = `${count}/${total}`
      doneEl.title = `${count} completed of ${total} task${total === 1 ? '' : 's'}`
    }

    Storage.save(App.data)
  }
}

App.init()