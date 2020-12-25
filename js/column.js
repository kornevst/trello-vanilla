const Column = {
    idCounter: 4, // id для следующей колонки
    process(columnElement) {
        // Функция добавление прослушки клика и добавления заметки
        const spanAction_addNote = columnElement.querySelector('[data-action-addNote]')

        spanAction_addNote.addEventListener('click', function (event) {
            // Добавление новой заметки
            const noteElement = document.createElement('div')
            noteElement.classList.add('note')
            noteElement.setAttribute('draggable', true)
            noteElement.setAttribute('data-note-id', Note.idCounter)

            Note.idCounter++

            columnElement
                .querySelector('[data-notes]')
                .append(noteElement)
                noteElement.setAttribute('contenteditable', true)
                noteElement.focus()

            Note.process(noteElement)
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
    }
}