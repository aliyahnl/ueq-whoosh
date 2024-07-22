const aspects = {
    attractiveness: [],
    perspicuity: [],
    efficiency: [],
    dependability: [],
    stimulation: [],
    novelty: []
};

const aspectMapping = {
    A1: 'attractiveness', A2: 'attractiveness', A3: 'attractiveness', A4: 'attractiveness', A5: 'attractiveness', A6: 'attractiveness',
    P1: 'perspicuity', P2: 'perspicuity', P3: 'perspicuity', P4: 'perspicuity',
    E1: 'efficiency', E2: 'efficiency', E3: 'efficiency', E4: 'efficiency',
    D1: 'dependability', D2: 'dependability', D3: 'dependability', D4: 'dependability',
    S1: 'stimulation', S2: 'stimulation', S3: 'stimulation', S4: 'stimulation',
    N1: 'novelty', N2: 'novelty', N3: 'novelty', N4: 'novelty'
};

function goIntro() {
    window.location.href = 'intro.html';
}

function goResult() {
    window.location.href = 'results.html';
}

function closePage() {
    window.location.href = 'close.html';
}

function nextPage() {
    window.location.href = 'questions.html';
}

async function submitForm(event) {
    event.preventDefault();
    const form = document.getElementById('combinedForm');
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = isNaN(parseInt(value)) ? value : parseInt(value);
    });
    

    try {
        const response = await fetch('/api/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.href = 'thankyou.html';
        } else {
            alert('Failed to submit response.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit response.');
    }
}

async function fetchResults() {
    try {
        const response = await fetch('/api/responses');
        const data = await response.json();
        displayResultsSum(data);
        displayResults(data);
        displayResultsUsia(data);
        displayAnswerDistribution(data);
        displayPragmaticHedonicTable(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch results.');
    }
}

function displayResults(data) {
    const resultsDiv = document.getElementById('resultsContent');

    // Reset aspects
    Object.keys(aspects).forEach(key => aspects[key] = []);

    // Mengumpulkan data dari setiap responden berdasarkan mapping
    data.forEach(response => {
        for (let key in response) {
            const aspectName = aspectMapping[key];
            if (aspectName && response[key] !== undefined && response[key] !== null) {
                aspects[aspectName].push(response[key]);
            }
        }
    });

    // Menghitung rata-rata setiap aspek
    const calculateAverage = (values) => {
        if (values.length === 0) return "";
        const sum = values.reduce((a, b) => a + b, 0);
        return (sum / values.length).toFixed(2);
    };

    const aspectAverages = {
        attractiveness: calculateAverage(aspects['attractiveness']),
        perspicuity: calculateAverage(aspects['perspicuity']),
        efficiency: calculateAverage(aspects['efficiency']),
        dependability: calculateAverage(aspects['dependability']),
        stimulation: calculateAverage(aspects['stimulation']),
        novelty: calculateAverage(aspects['novelty'])
    };

    // Menampilkan hasil
    for (let key in aspectAverages) {
        if (aspectAverages[key] !== "") {
            resultsDiv.innerHTML += `<p><b><i>${key.charAt(0).toUpperCase() + key.slice(1)}</i>: ${aspectAverages[key]}</b></p>`;
        }
    }

    resultsDiv.style.display = 'block';  // Menampilkan div hasil

    // Membuat elemen canvas untuk grafik rata-rata aspek
    const chartContainer = document.createElement('div');
    chartContainer.className = 'canvas-container';
    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'aspectChart';
    chartContainer.appendChild(chartCanvas);
    resultsDiv.appendChild(chartContainer);

    // Membuat plugin untuk menambahkan background warna
    const backgroundPlugin = {
        id: 'backgroundPlugin',
        beforeDraw: (chart) => {
            const ctx = chart.ctx;
            const chartArea = chart.chartArea;

            const positions = [
                { color: '#72B32F', start: chartArea.top, end: chart.scales.y.getPixelForValue(1) },
                { color: '#FFFFCC', start: chart.scales.y.getPixelForValue(1), end: chart.scales.y.getPixelForValue(0.5) },
                { color: '#FFFFCC', start: chart.scales.y.getPixelForValue(0.5), end: chart.scales.y.getPixelForValue(0) },
                { color: '#FFFFCC', start: chart.scales.y.getPixelForValue(0), end: chart.scales.y.getPixelForValue(-0.5) },
                { color: '#FFFFCC', start: chart.scales.y.getPixelForValue(-0.5), end: chart.scales.y.getPixelForValue(-1) },
                { color: '#F35B2F', start: chart.scales.y.getPixelForValue(-1), end: chart.scales.y.getPixelForValue(-2) }
            ];

            ctx.save();
            positions.forEach(pos => {
                ctx.fillStyle = pos.color;
                ctx.fillRect(chartArea.left, pos.start, chartArea.right - chartArea.left, pos.end - pos.start);
            });
            ctx.restore();
        }
    };

    // Membuat grafik bar untuk rata-rata aspek
    const ctx = document.getElementById('aspectChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Daya tarik', 'Kejelasan', 'Efisiensi', 'Ketepatan', 'Stimulasi', 'Kebaruan'],
            datasets: [{
                label: 'Rata-rata',
                data: [
                    aspectAverages.attractiveness,
                    aspectAverages.perspicuity,
                    aspectAverages.efficiency,
                    aspectAverages.dependability,
                    aspectAverages.stimulation,
                    aspectAverages.novelty
                ],
                backgroundColor: '#B4B4B4',
                borderColor: '#000000',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    min: -2,
                    max: 2
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        },
        plugins: [backgroundPlugin]
    });
    // Kirim nilai rata-rata ke ueqChart.js
    updateChartWithAverages(aspectAverages);
}

function updateChartWithAverages(averages) {
    // Memanggil fungsi yang ada di ueqChart.js untuk memperbarui chart
    updateUeqChart(averages);
}

function displayResultsSum(data) {
    const resultsDiv = document.getElementById('resultsContentSum');
    
    // Tampilkan jumlah responden
    const numberOfRespondents = data.length;
    const respondentsDiv = document.createElement('div');
    respondentsDiv.innerHTML = `<h3>Jumlah Responden: ${numberOfRespondents}</h3>`;
    resultsDiv.appendChild(respondentsDiv);
}

function displayResultsUsia(data) {
    const resultsDiv = document.getElementById('resultsContentUsiaGender');

    // Tampilkan jumlah responden
    const numberOfRespondents = data.length;
    const respondentsDiv = document.createElement('div');
    respondentsDiv.innerHTML = `<h4>Jumlah Responden: ${numberOfRespondents}</h4>`;
    resultsDiv.appendChild(respondentsDiv);
    
    // Menghitung distribusi usia
    const ageDistribution = {
        '< 20 tahun': 0,
        '20 - 30 tahun': 0,
        '30 - 40 tahun': 0,
        '> 40 tahun': 0
    };

    const genderDistribution = {
        'Wanita': 0,
        'Pria': 0
    };

    data.forEach(response => {
        ageDistribution[response.usia]++;
        genderDistribution[response.gender]++;
    });

    // Menambahkan elemen canvas untuk grafik usia dengan ukuran spesifik
    const ageCanvasContainer = document.createElement('div');
    ageCanvasContainer.className = 'canvas-container1';
    const ageCanvas = document.createElement('canvas');
    ageCanvas.id = 'ageChart';
    ageCanvasContainer.appendChild(ageCanvas);
    resultsDiv.appendChild(ageCanvasContainer);

    // Menambahkan elemen canvas untuk grafik gender dengan ukuran spesifik
    const genderCanvasContainer = document.createElement('div');
    genderCanvasContainer.className = 'canvas-container1';
    const genderCanvas = document.createElement('canvas');
    genderCanvas.id = 'genderChart';
    genderCanvasContainer.appendChild(genderCanvas);
    resultsDiv.appendChild(genderCanvasContainer);

    // Membuat grafik pie untuk distribusi usia
    const ageCtx = document.getElementById('ageChart').getContext('2d');
    new Chart(ageCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(ageDistribution),
            datasets: [{
                data: Object.values(ageDistribution),
                backgroundColor: ['#B3E2E8', '#ABE2AB', '#FFFF84', '#DEBDED']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Distribusi Usia'
                }
            }
        }
    });

    // Membuat grafik pie untuk distribusi gender
    const genderCtx = document.getElementById('genderChart').getContext('2d');
    new Chart(genderCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(genderDistribution),
            datasets: [{
                data: Object.values(genderDistribution),
                backgroundColor: ['#FF82CD', '#86DAFF']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Distribusi Gender'
                }
            }
        }
    });
}

function displayAnswerDistribution(data) {
    const resultsDiv = document.getElementById('answerDistributionTable');

    const items = [ 
        { nr: 1, item: 'menyusahkan/menyenangkan', scale: 'Daya tarik', key: 'A1' },
        { nr: 2, item: 'tak dapat dipahami/dapat dipahami', scale: 'Kejelasan', key: 'P1' },
        { nr: 3, item: 'monoton/kreatif', scale: 'Kebaruan', key: 'N1' },
        { nr: 4, item: 'sulit dipelajari/mudah dipelajari', scale: 'Kejelasan', key: 'P2' },
        { nr: 5, item: 'kurang bermanfaat/bermanfaat', scale: 'Stimulasi', key: 'S1' },
        { nr: 6, item: 'membosankan/mengasyikkan', scale: 'Stimulasi', key: 'S2' },
        { nr: 7, item: 'tidak menarik/menarik', scale: 'Stimulasi', key: 'S3' },
        { nr: 8, item: 'tak dapat diprediksi/dapat diprediksi', scale: 'Ketepatan', key: 'D1' },
        { nr: 9, item: 'lambat/cepat', scale: 'Efisiensi', key: 'E1' },
        { nr: 10, item: 'konvensional/berdaya cipta', scale: 'Kebaruan', key: 'N2' },
        { nr: 11, item: 'menghalangi/mendukung', scale: 'Ketepatan', key: 'D2' },
        { nr: 12, item: 'buruk/baik', scale: 'Daya tarik', key: 'A2' },
        { nr: 13, item: 'rumit/sederhana', scale: 'Kejelasan', key: 'P3' },
        { nr: 14, item: 'tidak disukai/menggembirakan', scale: 'Daya tarik', key: 'A3' },
        { nr: 15, item: 'lazim/terdepan', scale: 'Kebaruan', key: 'N3' },
        { nr: 16, item: 'tidak nyaman/nyaman', scale: 'Daya tarik', key: 'A4' },
        { nr: 17, item: 'tidak aman/aman', scale: 'Ketepatan', key: 'D3' },
        { nr: 18, item: 'tidak memotivasi/memotivasi', scale: 'Stimulasi', key: 'S4' },
        { nr: 19, item: 'tidak memenuhi ekspektasi/memenuhi ekspektasi', scale: 'Ketepatan', key: 'D4' },
        { nr: 20, item: 'tidak efisien/efisien', scale: 'Efisiensi', key: 'E2' },
        { nr: 21, item: 'membingungkan/jelas', scale: 'Kejelasan', key: 'P4' },
        { nr: 22, item: 'tidak praktis/praktis', scale: 'Efisiensi', key: 'E3' },
        { nr: 23, item: 'berantakan/terorganisasi', scale: 'Efisiensi', key: 'E4' },
        { nr: 24, item: 'tidak atraktif/atraktif', scale: 'Daya tarik', key: 'A5' },
        { nr: 25, item: 'tidak ramah pengguna/ramah pengguna', scale: 'Daya tarik', key: 'A6' },
        { nr: 26, item: 'konservatif/inovatif', scale: 'Kebaruan', key: 'N4' },
    ];

    const table = document.createElement('table');
    table.classList.add('table');
    
    const header = table.createTHead();
    const headerRow = header.insertRow(0);
    const headers = ['Nr', 'Item', '1', '2', '3', '4', '5', '6', '7', 'Skala'];
    
    headers.forEach(headerText => {
        const cell = document.createElement('th');
        cell.appendChild(document.createTextNode(headerText));
        headerRow.appendChild(cell);
    });

    const body = table.createTBody();

    items.forEach(item => {
        const row = body.insertRow();
        
        const nrCell = row.insertCell(0);
        nrCell.appendChild(document.createTextNode(item.nr));

        const itemCell = row.insertCell(1);
        itemCell.appendChild(document.createTextNode(item.item));

        const counts = {
            '-3': 0,
            '-2': 0,
            '-1': 0,
            '0': 0,
            '1': 0,
            '2': 0,
            '3': 0
        };

        data.forEach(response => {
            if (response[item.key] !== undefined && response[item.key] !== null) {
                counts[response[item.key]]++;
            }
        });

        for (let i = -3; i <= 3; i++) {
            const cell = row.insertCell(i + 5);
            cell.appendChild(document.createTextNode(counts[i.toString()]));
        }

        const scaleCell = row.insertCell(9);
        scaleCell.appendChild(document.createTextNode(item.scale));
    });

    resultsDiv.appendChild(table);
}

function displayPragmaticHedonicTable(data) {
    const tableContainer = document.getElementById('pragmaticHedonicTable');

    // Reset aspects
    Object.keys(aspects).forEach(key => aspects[key] = []);

    // Mengumpulkan data dari setiap responden berdasarkan mapping
    data.forEach(response => {
        for (let key in response) {
            const aspectName = aspectMapping[key];
            if (aspectName && response[key] !== undefined && response[key] !== null) {
                aspects[aspectName].push(response[key]);
            }
        }
    });

    const calculateAverage = (values) => {
        if (values.length === 0) return 0;
        const sum = values.reduce((a, b) => a + b, 0);
        return sum / values.length;
    };

    const calculatePragmaticQuality = () => {
        const perspicuity = calculateAverage(aspects['perspicuity']);
        const efficiency = calculateAverage(aspects['efficiency']);
        const dependability = calculateAverage(aspects['dependability']);
        return (perspicuity + efficiency + dependability) / 3;
    };

    const calculateHedonicQuality = () => {
        const stimulation = calculateAverage(aspects['stimulation']);
        const novelty = calculateAverage(aspects['novelty']);
        return (stimulation + novelty) / 2;
    };

    const attractiveness = calculateAverage(aspects['attractiveness']);
    const pragmaticQuality = calculatePragmaticQuality();
    const hedonicQuality = calculateHedonicQuality();

    // Membuat tabel
    const table = document.createElement('table');
    table.classList.add('table');

    const header = table.createTHead();
    const headerRow = header.insertRow(0);
    const headers = ['Kualitas Pragmatis dan Hedonis', 'Nilai'];

    headers.forEach(headerText => {
        const cell = document.createElement('th');
        cell.appendChild(document.createTextNode(headerText));
        headerRow.appendChild(cell);
    });

    const body = table.createTBody();
    const rows = [
        { label: 'Daya tarik', value: attractiveness.toFixed(2) },
        { label: 'Kualitas Pragmatis', value: pragmaticQuality.toFixed(2) },
        { label: 'Kualitas Hedonis', value: hedonicQuality.toFixed(2) }
    ];

    rows.forEach(row => {
        const tableRow = body.insertRow();
        const labelCell = tableRow.insertCell(0);
        labelCell.appendChild(document.createTextNode(row.label));

        const valueCell = tableRow.insertCell(1);
        valueCell.appendChild(document.createTextNode(row.value));
    });

    tableContainer.appendChild(table);
}

// Call the function to fetch data and display results on page load, only on results.html
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('results.html')) {
        fetchResults();
    }
});
