const Column = {
    idCounter: 4, // id для следующей колонки
    dragged: null, // ссылка на элемент который перетаскиваем
    create(id = null) {
        // Добавление новой колонки
        const columnElement = document.createElement('div')
        columnElement.classList.add('column')
        columnElement.setAttribute('draggable', true)

        if (id) {
            columnElement.setAttribute('data-column-id', id)
        } else {
            columnElement.setAttribute('data-column-id', Column.idCounter)
            Column.idCounter++
        }

        columnElement.innerHTML =
            `
            <p class="column-header">В плане</p>
            <div data-notes></div>
            <p class="column-footer">
                <span data-action-addNote class="action">+ Добавить карточку</span>
            </p>
            `

        Column.process(columnElement)

        return columnElement
    },
    process(columnElement) { // Функция добавление прослушки клика и добавления заметки
        const spanAction_addNote = columnElement.querySelector('[data-action-addNote]')

        spanAction_addNote.addEventListener('click', function (event) {
            const noteElement = Note.create()

            columnElement
                .querySelector('[data-notes]')
                .append(noteElement)
                noteElement.setAttribute('contenteditable', true)
                noteElement.focus()
        })

        // Добавление редактирование колонки двойным кликом
        const headerElement = columnElement.querySelector('.column-header')
        headerElement.addEventListener('dblclick', function (event) {
            headerElement.setAttribute('contenteditable', true)
            headerElement.focus()
        })
        headerElement.addEventListener('blur', function (event) {
            headerElement.removeAttribute('contenteditable')
        })

        columnElement.addEventListener('dragover', function (event) {
            event.preventDefault()
        })

        columnElement.addEventListener('drop', function (event) {
            if (Note.dragged) {
                return columnElement
                    .querySelector('[data-notes]')
                    .append(Note.dragged)
            }
        })

        // Drag and Drop колонки
		columnElement.addEventListener('dragstart', Column.dragstart)
		columnElement.addEventListener('dragend', Column.dragend)
		columnElement.addEventListener('dragenter', Column.dragenter)
		columnElement.addEventListener('dragover', Column.dragover)
		columnElement.addEventListener('dragleave', Column.dragleave)
		columnElement.addEventListener('drop', Column.drop)
    },
    dragstart(event) {
        Column.dragged = this
        this.classList.add('dragged')
        event.stopPropagation()
    },
    dragend(event) {
        Column.dragged = null
        this.classList.remove('dragged')

		// TODO это немного костыль
		document
			.querySelectorAll('.column')
			.forEach(note => note.classList.remove('under'))

        Application.save()
    },
    dragenter(event) {
        if (!Column.dragged || this === Column.dragged) {
            return
		}
		this.classList.add('under')
    },
    dragover(event) {
        event.preventDefault()
        event.stopPropagation()

		if (!Column.dragged || this === Column.dragged) {
            return
		}
    },
    dragleave(event) {
		if (!Column.dragged || this === Column.dragged) {
			return
		}
        this.classList.remove('under')
    },
    drop(event) {
        event.stopPropagation()
        if (!Column.dragged || this === Column.dragged) {
			return
        }

        const column = Array.from(this.parentElement.querySelectorAll('.column'))
        const indexA = column.indexOf(this)
        const indexB = column.indexOf(Column.dragged)
        console.log(`${indexB} - ${indexA}`)

        if (indexA < indexB) {
            this.parentElement.insertBefore(Column.dragged, this)
        } else {
            this.parentElement.insertBefore(Column.dragged, this.nextElementSibling)
        }
    }
}