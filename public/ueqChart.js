// ueqChart.js

const ueqData = [
    ['Daya tarik', -1.00, 0.69, 0.49, 0.4, 0.26, 0.66],
    ['Kejelasan', -1.00, 0.72, 0.48, 0.53, 0.27, 0.5],
    ['Efisiensi', -1.00, 0.6, 0.45, 0.45, 0.38, 0.62],
    ['Ketepatan', -1.00, 0.78, 0.36, 0.34, 0.22, 0.8],
    ['Stimulasi', -1.00, 0.5, 0.5, 0.35, 0.35, 0.8],
    ['Kebaruan', -1.00, 0.16, 0.54, 0.42, 0.48, 0.9]
];

// Fungsi untuk memperbarui chart dengan nilai rata-rata
function updateUeqChart(averages) {
    ueqData[0].push(parseFloat(averages.attractiveness));
    ueqData[1].push(parseFloat(averages.perspicuity));
    ueqData[2].push(parseFloat(averages.efficiency));
    ueqData[3].push(parseFloat(averages.dependability));
    ueqData[4].push(parseFloat(averages.stimulation));
    ueqData[5].push(parseFloat(averages.novelty));

    const labels = ueqData.map(item => item[0]);
    const lowerBorder = ueqData.map(item => item[1]);
    const badData = ueqData.map(item => item[2]);
    const belowAverageData = ueqData.map(item => item[3]);
    const aboveAverageData = ueqData.map(item => item[4]);
    const goodData = ueqData.map(item => item[5]);
    const excellentData = ueqData.map(item => item[6]);
    const meanData = ueqData.map(item => item[7]);

    const ctx = document.getElementById('ueqChart').getContext('2d');

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Rata-rata',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: 'black',
                type: 'line',
                fill: false,
                data: meanData,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: 'black',
                tension: 0 // membuat garis lurus
            },
            {
                label: 'Batas bawah',
                backgroundColor: '#e41a1c',
                data: lowerBorder
            },
            {
                label: 'Buruk',
                backgroundColor: '#e41a1c',
                data: badData
            },
            {
                label: 'Di bawah rata-rata',
                backgroundColor: '#E09D00',
                data: belowAverageData
            },
            {
                label: 'Di atas rata-rata',
                backgroundColor: '#D2F68A',
                data: aboveAverageData
            },
            {
                label: 'Baik',
                backgroundColor: '#72B32F',
                data: goodData
            },
            {
                label: 'Sangat baik',
                backgroundColor: '#4B881D',
                data: excellentData
            },
        ]
    };

    const options = {
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true,
                beginAtZero: false,
                min: -1,
                max: 2.5,
                ticks: {
                    stepSize: 0.01
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'right'
            }
        }
    };

    const ueqChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });

    // Buat tabel perbandingan benchmark
    createBenchmarkTable(ueqData);
}

const benchmarkData = {
    'Daya tarik': [0.69, 1.18, 1.58, 1.84],
    'Kejelasan': [0.72, 1.2, 1.73, 2.0],
    'Efisiensi': [0.6, 1.05, 1.5, 1.88],
    'Ketepatan': [0.78, 1.14, 1.48, 1.7],
    'Stimulasi': [0.5, 1.0, 1.35, 1.7],
    'Kebaruan': [0.16, 0.7, 1.12, 1.6]
};

// Fungsi untuk membuat tabel perbandingan benchmark
function createBenchmarkTable(data) {
    const tableContainer = document.getElementById('benchmarkTable');
    const table = document.createElement('table');
    table.classList.add('table');
    
    const header = table.createTHead();
    const headerRow = header.insertRow(0);
    const headers = ['Aspek', 'Rata-rata', 'Perbandingan dengan Benchmark', 'Interpretasi'];
    
    headers.forEach(headerText => {
        const cell = document.createElement('th');
        cell.appendChild(document.createTextNode(headerText));
        headerRow.appendChild(cell);
    });

    const body = table.createTBody();
    
    data.forEach(item => {
        const row = body.insertRow();
        
        const scaleCell = row.insertCell(0);
        scaleCell.appendChild(document.createTextNode(item[0]));

        const meanCell = row.insertCell(1);
        meanCell.appendChild(document.createTextNode(item[7].toFixed(2)));

        const comparissonCell = row.insertCell(2);
        const meanValue = item[7];
        let comparisson = '';
        if (meanValue < item[2]) {
            comparisson = 'Buruk';
        } else if (meanValue > item[3]) {
            comparisson = 'Di bawah rata-rata';
        } else if (meanValue > item[4]) {
            comparisson = 'Di atas rata-rata';
        } else if (meanValue > item[5]) {
            comparisson = 'Baik';
        } else {
            comparisson = 'Sangat baik';
        }
        comparissonCell.appendChild(document.createTextNode(comparisson));

        const interpretationCell = row.insertCell(3);
        const benchmark = benchmarkData[item[0]];
        let interpretation = '';
        if (meanValue > benchmark[3]) {
            interpretation = 'Dalam kisaran 10% hasil terbaik';
        } else if (meanValue > benchmark[2]) {
            interpretation = '10% hasil lebih baik, 75% hasil lebih buruk';
        } else if (meanValue > benchmark[1]) {
            interpretation = '25% hasil lebih baik, 50% hasil lebih buruk';
        } else if (meanValue >= benchmark[0]) {
            interpretation = '50% hasil lebih baik, 25% hasil lebih buruk';
        } else {
            interpretation = 'Dalam kisaran 25% hasil terburuk';
        }
        interpretationCell.appendChild(document.createTextNode(interpretation));
    });

    tableContainer.appendChild(table);
}

