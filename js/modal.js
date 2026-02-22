const Modal = {
  open(data, task) {
    const modal = document.getElementById("taskModal")

    modal.innerHTML = `
      <div class="modal-card">
        <h3>Edit Task</h3>
        <label>Title</label>
        <input id="editTitle" type="text" value="${task.text}" />

        <label>Description</label>
        <textarea id="editDescription">${task.description || ""}</textarea>

        <label>Color</label>
        <input id="editColor" type="hidden" value="${task.color || "#F9C74F"}" />
        <div id="colorPalette" class="color-palette">
          <div class="swatch" data-color="#F94144" style="background:#F94144"></div>
          <div class="swatch" data-color="#F3722C" style="background:#F3722C"></div>
          <div class="swatch" data-color="#F8961E" style="background:#F8961E"></div>
          <div class="swatch" data-color="#F9C74F" style="background:#F9C74F"></div>
          <div class="swatch" data-color="#90BE6D" style="background:#90BE6D"></div>
          <div class="swatch" data-color="#43AA8B" style="background:#43AA8B"></div>
          <div class="swatch" data-color="#577590" style="background:#577590"></div>
          <div class="swatch" data-color="#277DA1" style="background:#277DA1"></div>
          <div class="swatch" data-color="#8338EC" style="background:#8338EC"></div>
          <div class="swatch" data-color="#3A0CA3" style="background:#3A0CA3"></div>
          <div class="swatch" data-color="#FF6B6B" style="background:#FF6B6B"></div>
          <div class="swatch" data-color="#4D908E" style="background:#4D908E"></div>
        </div>

        <div class="pomodoro-row">
          <label>Work (min)</label>
          <input id="editWork" type="number" min="1" value="${task.pomodoroWork || 25}" />
          <label>Break (min)</label>
          <input id="editBreak" type="number" min="1" value="${task.pomodoroBreak || 5}" />
          <label>Sessions</label>
          <input id="editSessions" type="number" min="1" value="${task.pomodoroSessions || 4}" />
        </div>

        <label>Status</label>
        <select id="editStatus">
          <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To do</option>
          <option value="doing" ${task.status === 'doing' ? 'selected' : ''}>Doing</option>
          <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
        </select>

        <div class="modal-actions">
          <button id="saveBtn">Save</button>
          <button id="cancelBtn">Cancel</button>
        </div>
      </div>
    `

    modal.classList.remove("hidden")

    document.getElementById("saveBtn").onclick = () => {
      task.text = document.getElementById("editTitle").value
      task.description = document.getElementById("editDescription").value
      task.color = document.getElementById("editColor").value
      task.pomodoroWork = parseInt(document.getElementById("editWork").value, 10) || 25
      task.pomodoroBreak = parseInt(document.getElementById("editBreak").value, 10) || 5
      task.pomodoroSessions = parseInt(document.getElementById("editSessions").value, 10) || 4
      task.status = document.getElementById("editStatus").value
      Storage.save(data)
      App.render()
      Modal.close()
    }

    // initialize palette selection
    const palette = document.getElementById('colorPalette')
    if (palette) {
      const current = document.getElementById('editColor').value
      palette.querySelectorAll('.swatch').forEach(s => {
        if (s.dataset.color === current) s.classList.add('selected')
        s.onclick = () => {
          palette.querySelectorAll('.swatch').forEach(x => x.classList.remove('selected'))
          s.classList.add('selected')
          document.getElementById('editColor').value = s.dataset.color
        }
      })
    }

    document.getElementById("cancelBtn").onclick = Modal.close
  },

  close() {
    document.getElementById("taskModal")
      .classList.add("hidden")
  }
}

// Open modal to edit a project
Modal.openProject = function(data, project) {
  const modal = document.getElementById('taskModal')

  modal.innerHTML = `
    <div class="modal-card">
      <h3>Edit Project</h3>
      <label>Title</label>
      <input id="editProjectTitle" type="text" value="${project.name}" />

      <label>Description</label>
      <textarea id="editProjectDescription">${project.description || ''}</textarea>

      <label>Color</label>
      <input id="editProjectColor" type="hidden" value="${project.color || '#F9C74F'}" />
      <div id="projectColorPalette" class="color-palette">
        <div class="swatch" data-color="#F94144" style="background:#F94144"></div>
        <div class="swatch" data-color="#F3722C" style="background:#F3722C"></div>
        <div class="swatch" data-color="#F8961E" style="background:#F8961E"></div>
        <div class="swatch" data-color="#F9C74F" style="background:#F9C74F"></div>
        <div class="swatch" data-color="#90BE6D" style="background:#90BE6D"></div>
        <div class="swatch" data-color="#43AA8B" style="background:#43AA8B"></div>
        <div class="swatch" data-color="#577590" style="background:#577590"></div>
        <div class="swatch" data-color="#277DA1" style="background:#277DA1"></div>
        <div class="swatch" data-color="#8338EC" style="background:#8338EC"></div>
        <div class="swatch" data-color="#3A0CA3" style="background:#3A0CA3"></div>
        <div class="swatch" data-color="#FF6B6B" style="background:#FF6B6B"></div>
        <div class="swatch" data-color="#4D908E" style="background:#4D908E"></div>
      </div>

      <div class="modal-actions">
        <button id="saveProjectBtn">Save</button>
        <button id="applyProjectBtn">Apply</button>
        <button id="cancelProjectBtn">Cancel</button>
      </div>
    </div>
  `

  modal.classList.remove('hidden')

  document.getElementById('saveProjectBtn').onclick = () => {
    project.name = document.getElementById('editProjectTitle').value
    project.description = document.getElementById('editProjectDescription').value
    project.color = document.getElementById('editProjectColor').value
    Storage.save(data)
    App.render()
    Modal.close()
  }

  document.getElementById('applyProjectBtn').onclick = () => {
    project.name = document.getElementById('editProjectTitle').value
    project.description = document.getElementById('editProjectDescription').value
    project.color = document.getElementById('editProjectColor').value
    // set all tasks of this project to TODO
    data.tasks.forEach(t => { if (t.projectId === project.id) t.status = 'todo' })
    Storage.save(data)
    App.render()
    Modal.close()
  }

  // initialize palette selection for project colors
  const palette = document.getElementById('projectColorPalette')
  if (palette) {
    const current = document.getElementById('editProjectColor').value
    palette.querySelectorAll('.swatch').forEach(s => {
      if (s.dataset.color === current) s.classList.add('selected')
      s.onclick = () => {
        palette.querySelectorAll('.swatch').forEach(x => x.classList.remove('selected'))
        s.classList.add('selected')
        document.getElementById('editProjectColor').value = s.dataset.color
      }
    })
  }

  document.getElementById('cancelProjectBtn').onclick = Modal.close
}