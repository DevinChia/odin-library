const myLibrary = [];

function Book(id, title, author, pages, read = false) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.toggleReadStatus = function() {
    this.read === false ? this.read = true : this.read = false;
}

function addBooktoLibrary(title, author, pages, read = false) {
    let id = crypto.randomUUID();
    const newBook = new Book(id, title, author, pages, read);
    myLibrary.push(newBook);
}

const table = document.querySelector("tbody");

function displayBooks() {
    if (myLibrary.length === 0) {
        const row = document.createElement("tr");
        const column = document.createElement("td");
        column.colSpan = 5;
        column.textContent = "No books available, please add a book.";
        row.appendChild(column);
        table.appendChild(row);
    }
    else {
        for (let i = 0; i < myLibrary.length; i++) {
            const bookProperties = Object.keys(myLibrary[i]);
            const filteredBookProperties = bookProperties.filter(val => typeof myLibrary[i][val] != "function" && val !="id")
            const row = document.createElement("tr");
            const actions = document.createElement("td")
            const toggleRead = document.createElement("button")
            const deleteButton = document.createElement("button")
            deleteButton.setAttribute("data-book-id", myLibrary[i].id)
            myLibrary[i].read === true ? toggleRead.textContent = "Unread" : toggleRead.textContent = "Read";
            deleteButton.textContent = "Delete";
            toggleRead.addEventListener("click", () => {
                myLibrary[i].toggleReadStatus();
                while (table.hasChildNodes()) {
                    table.removeChild(table.firstChild);
                }
                displayBooks();
            })
            deleteButton.addEventListener("click", () => {
                const deleteId = deleteButton.dataset.bookId;
                const targetId = myLibrary.findIndex(val => val.id === deleteId);
                if (targetId < 0) return;
                myLibrary.splice(targetId, 1);
                while (table.hasChildNodes()) {
                    table.removeChild(table.firstChild);
                }
                displayBooks();
            })
            for (let j = 0; j < filteredBookProperties.length; j++) {
                const column = document.createElement("td");
                if (filteredBookProperties[j] == "read") {
                    let readStatus = "";
                    if (myLibrary[i][filteredBookProperties[j]] === false) {
                        readStatus = "Not read yet";
                    }
                    else if (myLibrary[i][filteredBookProperties[j]] === true) {
                        readStatus = "Already read";
                    }
                    column.textContent = readStatus;
                }
                else {
                    column.textContent = myLibrary[i][filteredBookProperties[j]];
                }
                row.appendChild(column);
            }
            actions.appendChild(toggleRead);
            actions.appendChild(deleteButton);
            row.appendChild(actions);
            table.appendChild(row);
        }
    }
}

displayBooks();

const newBookButton = document.querySelector(".new-book-button");
const dialog = document.querySelector("dialog");

const submitButton = document.querySelector(".submit-button");
const cancelButton = document.querySelector(".cancel-button");

newBookButton.addEventListener("click", () => {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("pages").value = "";
    document.getElementById("read").checked = false;
    dialog.showModal();
})

submitButton.addEventListener("click", (event) => {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = document.getElementById("pages").value;
    const read = document.getElementById("read").checked;
    event.preventDefault();
    addBooktoLibrary(title, author, pages, read);
    dialog.close();
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }
    displayBooks();
})

cancelButton.addEventListener("click", () => {
    dialog.close();
})
