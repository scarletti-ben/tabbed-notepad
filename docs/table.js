// < ========================================================
// < Exported DataTable Class
// < ========================================================

export class DataTable {
    constructor(parent, headers, data) {
        this.parent = parent;
        this.headers = headers;
        this.data = data;
        this.element = this.createTable();
        this.numRows = this.element.rows.length;
        this.numCols = this.element.rows[0].cells.length;
        this.initListeners();
    }

    /**
     * > Create table using data and headers
     * @returns {HTMLTableElement}
     */
    createTable() {
        let table = document.createElement("table");
        table.classList.add('data-table');
        let thead = document.createElement("thead");
        let tbody = document.createElement("tbody");

        let headerRow = document.createElement("tr");
        this.headers.forEach(header => {
            let th = document.createElement("th");
            th.textContent = header;
            const resizer = document.createElement('div');
            resizer.classList.add('resizer');
            th.appendChild(resizer);
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        this.data.forEach(row => {
            let tr = document.createElement("tr");
            row.forEach(text => {
                let td = document.createElement("td");
                td.textContent = text;
                // td.contentEditable = true;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        this.parent.appendChild(table);
        return table;
    }

    /**
     * > Initialize event listeners for columns
     */
    initListeners() {
        const headers = this.element.querySelectorAll('th');
        const minColWidth = 100;
        const tableWidth = this.element.offsetWidth;
        const colWidth = Math.max(minColWidth, tableWidth / headers.length);
        const rows = this.element.querySelectorAll('tr');

        rows.forEach(row => {
            row.addEventListener('click', () => {
                let value = row.cells[0]?.textContent;
                const event = new CustomEvent('dataTableEvent', { detail: { uuid: value } });
                document.dispatchEvent(event);
            });
        });

        headers.forEach(header => {
            header.style.width = colWidth + 'px';
            header.style.minWidth = minColWidth + 'px';

            const resizer = header.querySelector('.resizer');
            resizer.addEventListener('mousedown', e => {
                e.preventDefault();
                let startX = e.pageX;
                let startWidth = parseInt(window.getComputedStyle(header).width, 10);

                const mouseMoveHandler = e => {
                    let newWidth = startWidth + (e.pageX - startX);
                    if (newWidth >= minColWidth) header.style.width = newWidth + 'px';
                };

                const mouseUpHandler = () => {
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                    document.body.style.cursor = '';
                };

                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
                document.body.style.cursor = 'col-resize';
            });
        });
    }

}