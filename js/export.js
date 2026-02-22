const Export = {
  // Export data to a JSON file
  downloadJSON(data) {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kanban-export-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  // Import data from a JSON file
  uploadJSON(callback) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result)
          // validate structure
          if (!imported.projects || !Array.isArray(imported.projects) ||
              !imported.tasks || !Array.isArray(imported.tasks)) {
            alert('Invalid import file format')
            return
          }
          callback(imported)
        } catch (err) {
          alert(`Failed to parse import file: ${err.message}`)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }
}
