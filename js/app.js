const App = {
  data: Storage.load(),

  // Timer settings (seconds)
  timerDuration: 25 * 60, // 25 minutes
  timerRemaining: 25 * 60, // 25*60
  timerInterval: null,
  timerRunning: false,  audioContext: null,

  initAudioContext() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      } catch (e) {
        console.log('Audio context not available')
      }
    }
  },
  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  },

  playDing() {
    // Try browser notification first
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('⏰ Pomodoro Complete!', {
        body: 'Time is up! Take a break or start a new task.',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="80">⏰</text></svg>'
      })
    }

    // Also play audio
    if (!this.audioContext) return
    
    try {
      const now = this.audioContext.currentTime
      const beepGap = 0.1 // Gap between beeps within a cluster
      const clusterGap = 0.6 // Gap between clusters
      const frequencies = [800, 900, 800, 900, 800, 900, 1000]
      const volume = 0.35

      // Play 3 clusters of 7 beeps
      for (let cluster = 0; cluster < 3; cluster++) {
        const clusterStart = now + cluster * clusterGap
        frequencies.forEach((freq, i) => {
          this.playBeep(freq, volume, clusterStart + beepGap * i)
        })
      }
    } catch (e) {
      console.log('Error playing audio:', e)
    }
  },

  playBeep(frequency, gain, startTime) {
    const duration = 0.15 // Shorter beep for rapid pattern
    const osc = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    osc.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    osc.frequency.value = frequency
    osc.type = 'sine' // Back to sine for softer tone

    gainNode.gain.setValueAtTime(gain, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

    osc.start(startTime)
    osc.stop(startTime + duration)
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
        this.playDing()
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
      // Use modal-based creation to avoid reliance on window.prompt (packaged apps)
      Modal.createProject(App.data)
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
    if (timerBtn) {
      timerBtn.onclick = () => {
        // Initialize audio context on first user interaction
        App.initAudioContext()
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission()
        }
        App.toggleTimer()
      }
    }

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

    // Auto-start timer if there's already a task in DOING
    const doingTask = this.data.tasks.find(t => t.projectId === this.data.selectedProject && t.status === 'doing')
    if (doingTask) {
      this.initAudioContext()
      this.startTimer()
    }

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