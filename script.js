// Fungsi untuk menyembunyikan semua konten
function hideAllContent() {
    const contents = document.querySelectorAll('#content > div');
    contents.forEach(content => {
        content.style.display = 'none';
    });
}

// Fungsi untuk menampilkan konten Import Data
function showImportData() {
    hideAllContent();
    document.getElementById('importDataContent').style.display = 'block';
}

// Fungsi untuk menampilkan konten Preprocessing
function showPreprocessing() {
    hideAllContent();
    document.getElementById('preprocessingContent').style.display = 'block';
}

// Fungsi untuk menampilkan konten Training Data
function showTrainingData() {
    hideAllContent();
    document.getElementById('trainingDataContent').style.display = 'block';
}

// Fungsi untuk menampilkan konten Testing Data
function showTestingData() {
    hideAllContent();
    document.getElementById('testingDataContent').style.display = 'block';
}

// Fungsi untuk menampilkan konten Visualisasi Data
function showVisualisasiData() {
    hideAllContent();
    document.getElementById('visualisasiDataContent').style.display = 'block';
}

// Fungsi untuk memicu dialog file explorer saat tombol "Upload Data" diklik
function triggerFileInput() {
    document.getElementById('importDataInput').click();
}

// Fungsi untuk menangani file yang diunggah
function handleFileUpload(event) {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    if (!file) {
        alert('Silakan pilih file yang ingin diunggah.');
        return;
    }

    // Membaca file sebagai teks
    fileReader.readAsText(file);

    // Saat pembacaan selesai, tampilkan data dan nama file
    fileReader.onload = function(e) {
        const fileContent = e.target.result;

        // Menampilkan nama file yang diunggah
        document.getElementById('uploadedFileName').innerText = `File diunggah: ${file.name}`;

        // Tampilkan data dalam tabel
        displayDataInTable(fileContent);
    };
}

// Fungsi untuk memisahkan data dengan benar berdasarkan tanda kutip ganda
function parseCSVLine(line, separator) {
    const result = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0;i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            // Jika karakter saat ini adalah tanda kutip ganda
            inQuotes = !inQuotes;
        } else if (char === separator && !inQuotes) {
            // Jika karakter saat ini adalah pemisah dan bukan dalam tanda kutip ganda
            result.push(currentField);
            currentField = '';
        } else {
            currentField += char;
        }
    }

    // Tambahkan field terakhir
    if (currentField !== '') {
        result.push(currentField);
    }

    return result;
}

// Fungsi untuk menampilkan data dalam tabel
function displayDataInTable(fileContent) {
    // Pisahkan file content berdasarkan baris
    const rows = fileContent.split('\n');

    // Mendeteksi pemisah data yang digunakan
    const separators = [',', ';', '\t'];
    let separator = null;

    // Uji pemisah untuk mendeteksi pemisah yang digunakan
    for (const sep of separators) {
        if (rows[0].includes(sep)) {
            separator = sep;
            break;
        }
    }

    // Pastikan pemisah telah dideteksi
    if (!separator) {
        alert('Pemisah data tidak terdeteksi. Pastikan file memiliki pemisah yang jelas.');
        return;
    }

    // Buat tabel HTML
    const table = document.createElement('table');

    // Tambahkan header tabel dari baris pertama
    const headerRow = document.createElement('tr');
    const headers = parseCSVLine(rows[0], separator);
    headers.forEach(header => {
        const headerCell = document.createElement('th');
        headerCell.textContent = header;
        headerRow.appendChild(headerCell);
    });
    table.appendChild(headerRow);

    // Tambahkan baris tabel dengan data dari baris berikutnya
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const columns = parseCSVLine(row, separator);

        // Buat elemen baris tabel
        const tableRow = document.createElement('tr');

        // Tambahkan data kolom ke dalam baris tabel
        columns.forEach(column => {
            const tableCell = document.createElement('td');
            tableCell.textContent = column;
            tableRow.appendChild(tableCell);
        });

        table.appendChild(tableRow);
    }

    // Tampilkan tabel di konten file data
    const fileDataTable = document.getElementById('fileDataTable');
    fileDataTable.innerHTML = ''; // Kosongkan konten sebelumnya
    fileDataTable.appendChild(table);

    // Perbarui tampilan data berdasarkan jumlah yang dipilih
    updateDataDisplay();
}

// Fungsi untuk memperbarui tampilan data berdasarkan jumlah yang dipilih
function updateDataDisplay() {
    const fileDataTable = document.getElementById('fileDataTable');
    const rows = fileDataTable.querySelectorAll('tr');
    const limit = parseInt(document.getElementById('dataAmountSelect').value);

    // Loop melalui setiap baris tabel dan tampilkan hanya baris yang diinginkan
    rows.forEach((row, index) => {
        if (index === 0 || index <= limit) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Panggil fungsi hideAllContent saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', function() {
    hideAllContent();
});
