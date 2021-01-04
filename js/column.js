class Column {
    constructor(id = null) {
        // Добавление новой колонки

        const instance = this
        this.notes = []

        const element = this.element = document.createElement('div')
        element.classList.add('column')
        element.setAttribute('draggable', true)

        if (id) {
            element.setAttribute('data-column-id', id)
        } else {
            element.setAttribute('data-column-id', Column.idCounter)
            Column.idCounter++
        }

        element.innerHTML =
            `
            <p class="column-header">В плане</p>
            <div data-notes></div>
            <p class="column-footer">
                <span data-action-addNote class="action">+ Добавить карточку</span>
            </p>
            `

        // Функция добавление прослушки клика и добавления заметки
        const spanAction_addNote = element.querySelector('[data-action-addNote]')

        spanAction_addNote.addEventListener('click', function (event) {
            const note = new Note()
            instance.add(note)

            note.element.setAttribute('contenteditable', true)
            note.element.focus()
        })

        // Добавление редактирование колонки двойным кликом
        const headerElement = element.querySelector('.column-header')
        headerElement.addEventListener('dblclick', function (event) {
            headerElement.setAttribute('contenteditable', true)
            headerElement.focus()
        })
        headerElement.addEventListener('blur', function (event) {
            headerElement.removeAttribute('contenteditable')
        })

        element.addEventListener('dragover', function (event) {
            event.preventDefault()
        })

        element.addEventListener('drop', function (event) {
            if (Note.dragged) {
                return element
                    .querySelector('[data-notes]')
                    .append(Note.dragged)
            }
        })

        // Drag and Drop колонки
		element.addEventListener('dragstart', this.dragstart.bind(this))
		element.addEventListener('dragend', this.dragend.bind(this))
		element.addEventListener('dragenter', this.dragenter.bind(this))
		element.addEventListener('dragover', this.dragover.bind(this))
		element.addEventListener('dragleave', this.dragleave.bind(this))
		element.addEventListener('drop', this.drop.bind(this))
    }
    add(...notes) {
        for (const note of notes) {
            if(!this.notes.includes(note)) {
                this.notes.push(note)

                this.element.querySelector('[data-notes]')
                    .append(note.element)
            }
        }
    }
    dragstart(event) {
        Column.dragged = this.element
        this.element.classList.add('dragged')
        event.stopPropagation()
    }
    dragend(event) {
        Column.dragged = null
        this.element.classList.remove('dragged')

        document
            .querySelectorAll('.column')
            .forEach(column => column.classList.remove('under'))

        Application.save()
    }
    dragenter(event) {
        if (!Column.dragged || this.element === Column.dragged) {
            return
        }
        this.element.classList.add('under')
    }
    dragover(event) {
        event.preventDefault()
        event.stopPropagation()

        if (!Column.dragged || this.element === Column.dragged) {
            return
        }
    }
    dragleave(event) {
        if (!Column.dragged || this.element === Column.dragged) {
            return
        }
        this.element.classList.remove('under')
    }
    drop(event) {
        event.stopPropagation()
        if (!Column.dragged || this.element === Column.dragged) {
            return
        }

        const column = Array.from(this.element.parentElement.querySelectorAll('.column'))
        const indexA = column.indexOf(this.element)
        const indexB = column.indexOf(Column.dragged)
        console.log(`${indexB} - ${indexA}`)

        if (indexA < indexB) {
            this.element.parentElement.insertBefore(Column.dragged, this.element)
        } else {
            this.element.parentElement.insertBefore(Column.dragged, this.element.nextElementSibling)
        }
    }
}

Column.idCounter = 4 // id для следующей колонки
Column.dragged = null // ссылка на элемент который перетаскиваем