const todoListEl = document.querySelector("#todosList")
const createBar = document.querySelector("#createTodo")
const itemsLeftEl = document.querySelector("#leftTodosNum")

let itemsLeft = sessionStorage.getItem("itemsLeft") ? parseInt(sessionStorage.getItem("itemsLeft")) : 0
itemsLeftEl.innerHTML = itemsLeft

let TodoItemsArr = sessionStorage.getItem("TodoItemsArr") ? JSON.parse(sessionStorage.getItem("TodoItemsArr")) : []

// reset left items
function resitLeftItems(num) {
    itemsLeft += num
    itemsLeftEl.innerHTML = itemsLeft
    sessionStorage.setItem("itemsLeft", itemsLeft)
}

// create todo class
class Todo {
    constructor(value, container, classes, id) {
        this.value = value
        this.container = container
        this.classes = classes
        this.removeIconUrl = "./images/remove.png"
        this.id = id

        this.todoElCode = `
            <input type="checkbox" name="checkbox" class="todoCheckbox">
            <p class="todoText">${this.value}</p>
            <img id="_${this.id}" src="${this.removeIconUrl}" class="removeTodoBtn" alt="remove">`
    }

    createTodo() {
        this.todoEl = document.createElement("li")

        this.todoEl.classList.add(this.classes)
        this.todoEl.innerHTML = this.todoElCode

        this.container.insertBefore(this.todoEl, todoListEl.childNodes[0])
        
        document.querySelector(`#_${this.id}`).addEventListener("click", () => {
            this.removeTodo()
        })

        // Save the updated list to sessionStorage
        sessionStorage.setItem("TodoItemsArr", JSON.stringify(TodoItemsArr))
    }

    removeTodo() {
        this.todoEl.remove()
        resitLeftItems(-1)

        // Remove the item from the array and update sessionStorage
        TodoItemsArr = TodoItemsArr.filter(todo => todo.id !== this.id)
        sessionStorage.setItem("TodoItemsArr", JSON.stringify(TodoItemsArr))
    }
}

// Re-create todos from session storage on page load
TodoItemsArr.forEach(todoData => {
    let todo = new Todo(todoData.value, todoListEl, "todo", todoData.id)
    todo.createTodo()
})

// create todo when enter
createBar.addEventListener("keydown", event => {
    if (event.key === "Enter" && createBar.value !== "") {
        // increase the left items
        resitLeftItems(1)

        // create a new todo and add it to the list(array) so we can filter them later
        let todo = new Todo(createBar.value, todoListEl, "todo", itemsLeft)
        TodoItemsArr.push({ value: createBar.value, id: itemsLeft })
        todo.createTodo()

        // clear the bar
        createBar.value = ""
    }
})

// clear all completed todo Items
function clearCompleted() {
    let checkBox = document.querySelectorAll(".todoCheckbox")
    checkBox.forEach(e => {
        if (e.checked) {
            e.parentElement.remove()
            resitLeftItems(-1)

            // Remove the item from the array and update sessionStorage
            TodoItemsArr = TodoItemsArr.filter(todo => todo.id !== parseInt(e.parentElement.querySelector('.removeTodoBtn').id.slice(1)))
            sessionStorage.setItem("TodoItemsArr", JSON.stringify(TodoItemsArr))
        }
    })
}

// filter
function filter(filter) {
    let checkBox = document.querySelectorAll(".todoCheckbox")

    if (filter === "completed") {
        checkBox.forEach(e => {
            if (e.checked) {
                e.parentElement.style.display = ""
            } else {
                e.parentElement.style.display = "none"
            }
        })
    } else if (filter === "active") {
        checkBox.forEach(e => {
            if (e.checked) {
                e.parentElement.style.display = "none"
            } else {
                e.parentElement.style.display = ""
            }
        })
    } else {
        checkBox.forEach(e => {
            e.parentElement.style.display = ""
        })
    }
}
