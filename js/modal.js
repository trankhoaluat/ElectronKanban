const Modal = {
  open(data, task) {
    const modal = document.getElementById("taskModal")

    modal.innerHTML = `
      <div class="modal-card">
        <h3>Edit Task</h3>
        <input id="editTitle" value="${task.text}" />
        <button id="saveBtn">Save</button>
        <button id="cancelBtn">Cancel</button>
      </div>
    `

    modal.classList.remove("hidden")

    document.getElementById("saveBtn").onclick = () => {
      task.text = document.getElementById("editTitle").value
      Storage.save(data)
      App.render()
      Modal.close()
    }

    document.getElementById("cancelBtn").onclick = Modal.close
  },

  close() {
    document.getElementById("taskModal")
      .classList.add("hidden")
  }
}