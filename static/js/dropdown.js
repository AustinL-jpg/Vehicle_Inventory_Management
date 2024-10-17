$(document).ready(function() {
    let cars = [];
    let mpgChart;
    let vehicleTypeChart;
    let barChart;
    let isQuerying = false;

    // Fetch the car data from the server
    $.getJSON("/api/data", function(data) {
        cars = data;
        const makes = [...new Set(cars.map(car => car.Make))];
        makes.forEach(make => {
            $('#make').append(`<option value="${make}">${make}</option>`);
        });
    });

    $('#make').change(function() {
        const selectedMake = $(this).val();
        $('#model').prop('disabled', !selectedMake);
        $('#year').prop('disabled', true).empty().append('<option value="">Select Year</option>');

        if (selectedMake) {
            const filteredModels = cars.filter(car => car.Make == selectedMake).map(car => car.Model);
            const uniqueModels = [...new Set(filteredModels)];
            $('#model').empty().append('<option value="">Select Model</option>');
            uniqueModels.forEach(model => {
                $('#model').append(`<option value="${model}">${model}</option>`);
            });
        } else {
            $('#model').empty().append('<option value="">Select Model</option>');
        }
    });

    $('#model').change(function() {
        const selectedMake = $('#make').val();
        const selectedModel = $(this).val();
        $('#year').prop('disabled', !selectedModel);

        if (selectedModel) {
            const years = cars.filter(car => car.Make === selectedMake && car.Model === selectedModel).map(car => car.Year);
            const uniqueYears = [...new Set(years)];
            $('#year').empty().append('<option value="">Select Year</option>');
            uniqueYears.forEach(year => {
                $('#year').append(`<option value="${year}">${year}</option>`);
            });
        } else {
            $('#year').empty().append('<option value="">Select Year</option>');
        }
    });

    function createChart(uniqueYears, cityMpgData, highwayMpgData, co2Data) {
        const ctx = document.getElementById('mpgChart').getContext('2d');
        if (mpgChart) {
            mpgChart.destroy();
        }
        mpgChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: uniqueYears,
                datasets: [
                    {
                        label: 'Single Fuel Type City MPG',
                        data: cityMpgData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1
                    },
                    {
                        label: 'Highway MPG',
                        data: highwayMpgData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 1
                    },
                    {
                        label: 'CO2 Emissions (Grams/Mile)',
                        data: co2Data,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function createPieChart(usedCount, newCount) {
        const ctx = document.getElementById('vehicleTypeChart').getContext('2d');
        if (vehicleTypeChart) {
            vehicleTypeChart.destroy();
        }
        vehicleTypeChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Used Vehicles', 'New Vehicles'],
                datasets: [{
                    data: [usedCount, newCount],
                    backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    function createBarChart(stockData) {
        const makeModelYearsCounts = {};

        // Count the number of cars for each Make and Model by year
        stockData.forEach(car => {
            const key = `${car.Make} ${car.Model} ${car.Year}`;
            if (!makeModelYearsCounts[key]) {
                makeModelYearsCounts[key] = 0;
            }
            makeModelYearsCounts[key]++;
        });

        const labels = Object.keys(makeModelYearsCounts);
        const counts = Object.values(makeModelYearsCounts);

        const ctxBar = document.getElementById('barChart').getContext('2d');
        if (barChart) {
            barChart.destroy();
        }
        barChart = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Count of Cars in Stock',
                    data: counts,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    $('#query-button').off('click').on('click', function(e) {
        e.preventDefault();
        if (isQuerying) return;
    
        const selectedMake = $('#make').val();
        const selectedModel = $('#model').val();
        const selectedYear = $('#year').val(); // Keep the selected year for filtering
    
        if (selectedMake && selectedModel && selectedYear) {
            isQuerying = true;
    
            // Create the dashboard container dynamically
            const dashboardContainer = `
                <div id="dashboard-container" class="dashboard-container">
                    <div id="charts-container">
                        <div id="line-chart-container">
                            <canvas id="mpgChart"></canvas>
                        </div>
                        <div id="lower-charts-container">
                            <div class="half-chart">
                                <canvas id="vehicleTypeChart"></canvas>
                            </div>
                            <div class="half-chart">
                                <canvas id="barChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    
            // Append the dashboard container to the results area
            $('#results').empty().append(dashboardContainer); // Clear previous results
    
            // Fetch data for charts after dashboard is appended
            $.get('/query', { Make: selectedMake, Model: selectedModel }, function(data) {
                const years = [];
                const cityMPG = [];
                const highwayMPG = [];
                const co2Data = [];
                const stockData = [];
    
                data.forEach(car => {
                    if (car.Year) {
                        years.push(car.Year);
                        if (car['Single Fuel Type city MPG']) {
                            cityMPG.push(car['Single Fuel Type city MPG']);
                        }
                        if (car['Highway MPG for Single Fuel Type Vehicles']) {
                            highwayMPG.push(car['Highway MPG for Single Fuel Type Vehicles']);
                        }
                        if (car['CO2 SIngle Fuel type tailpipe Grams/mile']) {
                            co2Data.push(car['CO2 SIngle Fuel type tailpipe Grams/mile']);
                        }
                        stockData.push(car);
                    }
                });
    
                // Create unique years for the line chart
                const uniqueYears = [...new Set(years)].sort((a, b) => a - b);
                const cityMpgData = uniqueYears.map(year => {
                    const index = years.indexOf(year);
                    return index !== -1 ? cityMPG[index] : null;
                });
                const highwayMpgData = uniqueYears.map(year => {
                    const index = years.indexOf(year);
                    return index !== -1 ? highwayMPG[index] : null;
                });
                const co2DataForYears = uniqueYears.map(year => {
                    const index = years.indexOf(year);
                    return index !== -1 ? co2Data[index] : null;
                });
    
                // Create the charts
                createChart(uniqueYears, cityMpgData, highwayMpgData, co2DataForYears);
                createBarChart(stockData);
    
                // Count used and new vehicles for the selected year only
                const filteredData = stockData.filter(car => car.Year === Number(selectedYear));
                const usedCount = filteredData.filter(car => car.Condition === 'Used').length;
                const newCount = filteredData.filter(car => car.Condition === 'New').length;
                createPieChart(usedCount, newCount);
    
                $('#results').append('<h2>Vehicle Information</h2>');
                const vehicleCount = filteredData.length;
    
                if (vehicleCount > 0) {
                    $('#results').append(`<div>Total Vehicles Found: ${vehicleCount}</div>`);
                } else {
                    $('#results').append('<div>No results found for the selected year.</div>');
                }
    
                filteredData.forEach(car => {
                    let table = `
                        <div class="info-box">
                            <table class="fl-table">
                                <thead>
                                    <tr>
                                        <th>Attribute</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>`;
                    const prioritizedKeys = ['Make', 'Model', 'Year', 'VIN', 'Mileage', 'Stock', 'Condition', 'Single Fuel Type city MPG', 'Type of Engine', 'Transmission Type', 'Amount Spent over the next 5 Years compared to Average Vehicle',
                        'Annual Fuel cost for Single Fuel Type Vehicles'
                    ];
    
                    prioritizedKeys.forEach(key => {
                        const value = car[key];
                        if (value !== undefined && !(value === 0 || value === -1 || value === '0' || value === '-1')) {
                            table += `<tr><td>${key}</td><td>${value}</td></tr>`;
                        }
                    });
    
                    for (const [key, value] of Object.entries(car)) {
                        if (!prioritizedKeys.includes(key) && !(value === 0 || value === -1 || value === '0' || value === '-1')) {
                            table += `<tr><td>${key}</td><td>${value}</td></tr>`;
                        }
                    }
    
                    table += `</tbody></table></div>`;
                    $('#results').append(table);
                });
            }).fail(function() {
                $('#results').empty().append('<div>Error fetching results.</div>');
            }).always(function() {
                isQuerying = false;
            });
        }
    });
})   