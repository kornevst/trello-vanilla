// Начальное добавление прослушки клика ко всем заметкам
document
    .querySelectorAll('.column')
    .forEach(Column.process)

// Начальное добавление прослушки карточки для изменения двойным кликом
document
    .querySelectorAll('.note')
    .forEach(Note.process)

// Добавление прослушки клика для добавления новой колонки
document
    .querySelector('[data-action-addColumn]')
    .addEventListener('click', function (event) {
        // Добавление новой колонки
        const columnElement = document.createElement('div')
        columnElement.classList.add('column')
        columnElement.setAttribute('draggable', true)
        columnElement.setAttribute('data-column-id', Column.idCounter)

        Column.idCounter++

        columnElement.innerHTML =
        `
            <p class="column-header">В плане</p>
            <div data-notes></div>
            <p class="column-footer">
                <span data-action-addNote class="action">+ Добавить карточку</span>
            </p>
        `

        document
            .querySelector('.columns')
            .append(columnElement)

        Column.process(columnElement)

        console.log(this)
    })