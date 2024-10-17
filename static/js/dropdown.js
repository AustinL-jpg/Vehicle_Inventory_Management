$(document).ready(function() {
    let cars = [];
    let mpgChart; // Variable to hold the chart instance
    let isQuerying = false; // Flag to control execution

    // Fetch the car data from the server
    $.getJSON("/api/data", function(data) {
        cars = data;
        // Populate Make dropdown
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

    function createChart(uniqueYears, cityMpgData, highwayMpgData, co2Data, anotherData) {
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
                    },
                    // {
                    //     label: 'Another Data Set',
                    //     data: anotherData,
                    //     borderColor: 'rgba(255, 206, 86, 1)',
                    //     backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    //     borderWidth: 1
                    // }
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

    $('#query-button').off('click').on('click', function(e) {
        e.preventDefault(); // Prevent default behavior
        if (isQuerying) return; // Exit if already querying

        const selectedMake = $('#make').val();
        const selectedModel = $('#model').val();
        const selectedYear = $('#year').val();

        if (selectedMake && selectedModel) {
            isQuerying = true; // Set the flag to true

            $.get('/query?&', { Make: selectedMake, Model: selectedModel }, function(data) {
                $('#results').empty();
                const years = [];
                const cityMPG = [];
                const highwayMPG = [];
                const co2Data = [];
                const anotherData = []; // For the fourth dataset

                if (data.length > 0) {
                    data.forEach(car => {
                        if (car['Year'] && car['Single Fuel Type city MPG']) {
                            years.push(car['Year']);
                            cityMPG.push(car['Single Fuel Type city MPG']);
                        }
                        if (car['Year'] && car['Highway MPG for Single Fuel Type Vehicles']) {
                            highwayMPG.push(car['Highway MPG for Single Fuel Type Vehicles']);
                        }
                        if (car['Year'] && car['CO2 SIngle Fuel type tailpipe Grams/mile']) {
                            co2Data.push(car['CO2 SIngle Fuel type tailpipe Grams/mile']);
                        }
                        // if (car['Year'] && car['Another Data Set Key']) { // Replace with your actual key
                        //     anotherData.push(car['Another Data Set Key']);
                        // }
                    });

                    const uniqueYears = [...new Set(years)].sort((a, b) => a - b);
                    const cityMpgData = uniqueYears.map(year => {
                        const mpgForYear = cityMPG[years.indexOf(year)];
                        return mpgForYear !== undefined ? mpgForYear : null;
                    });
                    const highwayMpgData = uniqueYears.map(year => {
                        const mpgForYear = highwayMPG[years.indexOf(year)];
                        return mpgForYear !== undefined ? mpgForYear : null;
                    });
                    const co2DataForYears = uniqueYears.map(year => {
                        const co2ForYear = co2Data[years.indexOf(year)];
                        return co2ForYear !== undefined ? co2ForYear : null;
                    });
                    const anotherDataForYears = uniqueYears.map(year => {
                        const anotherForYear = anotherData[years.indexOf(year)];
                        return anotherForYear !== undefined ? anotherForYear : null;
                    });

                    createChart(uniqueYears, cityMpgData, highwayMpgData, co2DataForYears, anotherDataForYears);

                    const vehicleInfo = data.filter(car => car.Year == selectedYear);
                    if (vehicleInfo.length > 0) {
                        vehicleInfo.forEach(car => {
                            let table = `
                                <h2></h2>
                                <div class="info-box">
                                    <table class="fl-table">
                                        <thead>
                                            <tr>
                                                <th>Attribute</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;
                            const prioritizedKeys = ['Make', 'Model', 'Year', 'VIN', 'Mileage', 'Stock', 'Single Fuel Type city MPG', 'Type of Engine', 'Transmission Type', 'Amount Spent over the next 5 Years compared to Average Vehicle',
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
                    } else {
                        $('#results').append('<div>No results found for the selected year.</div>');
                    }
                } else {
                    $('#results').append('<div>No data available for the selected make and model.</div>');
                }
            }).fail(function() {
                $('#results').empty().append('<div>Error fetching results.</div>');
            }).always(function() {
                isQuerying = false; // Reset the flag
                console.log("AJAX call completed");
            });
        }
    });
});
