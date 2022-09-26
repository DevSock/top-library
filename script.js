const parentBookElement = document.getElementById("clone-book");
const modalElement = document.getElementById("modal");
const showModalButtonElement = document.getElementById("show-modal");
const closeModalButtonElement = document.getElementById("close-modal");
const bookContainerElement = document.getElementById("book-list");
const newBookForm = document.forms["new-book-form"];
let bookList = [];

function book(title, author, pagecount, publishdate, readstatus) {
  this.title = title;
  this.author = author;
  this.pagecount = pagecount;
  this.publishdate = publishdate;
  this.readstatus = readstatus;
  this.id = crypto.randomUUID();
}

function addBookToList(book) {
  const clonedElement = createClonedElement(book);
  bookList.push(book);
  updateLibraryStats();
  bookContainerElement.appendChild(clonedElement);
}

function createClonedElement(book) {
  const cloneElement = parentBookElement.cloneNode(true);
  const deleteButtonElement = cloneElement.querySelector(
    ".book-admin .book-delete"
  );
  const titleElement = cloneElement.querySelector(".data-list .book-title");
  const authorElement = cloneElement.querySelector(".data-list .book-author");
  const pageCountElement = cloneElement.querySelector(
    ".data-list .book-pagecount"
  );
  const publishDateElement = cloneElement.querySelector(
    ".data-list .book-publishing"
  );
  const readStatusElement = cloneElement.querySelector(
    ".data-list .book-readstatus"
  );
  const statusTextElement = readStatusElement.querySelector(".status-text");
  const hiddenCheckboxElement = readStatusElement.querySelector(
    "input[type=checkbox]"
  );
  const sliderBackgroundElement =
    readStatusElement.querySelector(".slider-background");

  cloneElement.removeAttribute("hidden");
  cloneElement.setAttribute("id", book.id);
  deleteButtonElement.setAttribute("data-book-id", book.id);

  titleElement.textContent = book.title;
  authorElement.textContent = book.author;
  pageCountElement.textContent = book.pagecount;
  publishDateElement.textContent = book.publishdate;

  hiddenCheckboxElement.id = `${book.id}-checkbox`;
  sliderBackgroundElement.setAttribute("for", `${book.id}-checkbox`);

  if (book.readstatus) {
    statusTextElement.textContent = "Read";
    readStatusElement.classList.add("book-read");
    hiddenCheckboxElement.checked = true;
  } else {
    statusTextElement.textContent = "Unread";
    readStatusElement.classList.remove("book-read");
    hiddenCheckboxElement.checked = false;
  }

  return cloneElement;
}

function showModal() {
  modal.removeAttribute("hidden");
}

function closeModal() {
  modal.setAttribute("hidden", true);
  newBookForm.reset();
}

function deleteBook(event) {
  const currentTarget = event.currentTarget.activeElement;

  if (currentTarget.classList.contains("book-delete")) {
    const uuid = currentTarget.getAttribute("data-book-id");
    const targetBook = document.getElementById(uuid);
    const bookListEntry = bookList.find((entry) => {
      if (entry.id == uuid) {
        return entry;
      }
    });

    targetBook.remove();
    bookList.splice(bookList.indexOf(bookListEntry), 1);
  }
}

function submitBook(event) {
  event.preventDefault();
  const form = document.forms["new-book-form"];
  const formData = new FormData(form);
  const title = formData.get("title");
  const author = formData.get("author");
  const pageCount = formData.get("pagecount");
  const publishDate = formData.get("publishdate");
  const publishYear = publishDate.substring(0, publishDate.indexOf("-"));
  const publishText = publishDate
    .slice(publishDate.indexOf("-") + 1)
    .concat(` / ${publishYear}`)
    .replace("-", " / ");
  const readStatus = formData.get("readstatus") ? true : false;

  addBookToList(new book(title, author, pageCount, publishText, readStatus));
  closeModal();
}

function updateLibraryStats() {
  const totalBooksElement = document.getElementById("total-books");
  const totalReadElement = document.getElementById("read-books");
  const totalUnreadElement = document.getElementById("unread-books");
  const totalPagesElement = document.getElementById("total-pages");
  const totalReadPagesElement = document.getElementById("read-pages");
  const totalUnreadPagesElement = document.getElementById("unread-pages");
  const totalBooks = bookList.length;
  const totalRead = bookList.filter((book) => book.readstatus).length;
  const totalUnread = bookList.filter((book) => !book.readstatus).length;
  const totalPages = bookList.reduce((total, book) => {
    return total + parseInt(book.pagecount);
  }, 0);
  const totalReadPages = bookList
    .filter((book) => book.readstatus)
    .reduce((total, book) => {
      return total + parseInt(book.pagecount);
    }, 0);
  const totalUnreadPages = bookList
    .filter((book) => !book.readstatus)
    .reduce((total, book) => {
      return total + parseInt(book.pagecount);
    }, 0);

  totalBooksElement.textContent = bookList.length;
  totalReadElement.textContent = totalRead;
  totalUnreadElement.textContent = totalUnread;
  totalPagesElement.textContent = totalPages;
  totalReadPagesElement.textContent = totalReadPages;
  totalUnreadPagesElement.textContent = totalUnreadPages;
}

document.addEventListener("click", deleteBook);
showModalButtonElement.addEventListener("click", showModal);
closeModalButtonElement.addEventListener("click", closeModal);
newBookForm.addEventListener("submit", submitBook);
