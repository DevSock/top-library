const modal = document.getElementById("modal");
const showModalButton = document.getElementById("show-modal");
const closeModalButton = document.getElementById("close-modal");

function showModal() {
  modal.removeAttribute("hidden");
}

function closeModal() {
  modal.setAttribute("hidden", true);
}

showModalButton.addEventListener("click", showModal);
closeModalButton.addEventListener("click", closeModal);
