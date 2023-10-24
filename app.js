document.addEventListener('DOMContentLoaded', function () {
    const csvFileInput = document.getElementById('csvFile');
    const columnCheckboxes = document.querySelector('#columnCheckboxes tbody');
    const generateCSVButton = document.getElementById('generateCSV');
    const outputDiv = document.getElementById('output');

    let parsedData = [];
    let selectedColumns = [];

    csvFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        parsedData = [];
        selectedColumns = [];

        const reader = new FileReader();

        reader.onload = (e) => {
            const data = e.target.result;
            parseCSV(data);
        };

        reader.readAsText(file);
    });

    function parseCSV(data) {
        parsedData = [];
        const lines = data.split('\n');

        if (lines.length > 0) {
            const headers = lines[0].split(',');

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',');
                const row = {};

                for (let j = 0; j < headers.length; j++) {
                    row[headers[j]] = values[j];
                }

                parsedData.push(row);
            }

            displayColumnCheckboxes(parsedData, headers);
        }
    }

    function displayColumnCheckboxes(data, headers) {
        columnCheckboxes.innerHTML = '';

        if (data.length > 0) {
            for (let i = 0; i < headers.length; i++) {
                const row = document.createElement('tr');

                // Column Checkbox Cell
                const checkboxCell = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = headers[i];
                checkbox.id = headers[i];

                const label = document.createElement('label');
                label.htmlFor = headers[i];
                label.appendChild(document.createTextNode(headers[i]));

                checkboxCell.appendChild(checkbox);
                checkboxCell.appendChild(label);

                // Example Data Cell
                const exampleDataCell = document.createElement('td');
                exampleDataCell.textContent = parsedData[0][headers[i]];

                row.appendChild(checkboxCell);
                row.appendChild(exampleDataCell);

                columnCheckboxes.appendChild(row);
            }
        }
    }

    generateCSVButton.addEventListener('click', () => {
        selectedColumns = Array.from(columnCheckboxes.querySelectorAll('input[type=checkbox]:checked')).map((checkbox) => checkbox.name);

        const filteredData = parsedData.map((row) => {
            const newRow = {};
            selectedColumns.forEach((column) => {
                newRow[column] = row[column];
            });
            return newRow;
        });

        const csvContent = [];
        csvContent.push(selectedColumns.join(','));

        filteredData.forEach((row) => {
            const values = selectedColumns.map((column) => row[column]);
            csvContent.push(values.join(','));
        });

        const csvData = csvContent.join('\n');

        outputDiv.innerHTML = '';

        // Create a Blob object with the CSV data
        const blob = new Blob([csvData], { type: 'text/csv' });

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'selected_columns.csv';
        downloadLink.textContent = 'Download CSV';

        // Append the link to the outputDiv
        outputDiv.appendChild(downloadLink);
    });
});
