

$(document).ready(function() {
    let cars = [];
    
    // Fetch the car data from the server
    $.getJSON("/api/data", function(data) {
        cars = data;
        // Populate Make dropdown
        const makes = [...new Set(cars.map(car => car.make))];
        makes.forEach(make => {
            $('#make').append(`<option value="${make}">${make}</option>`);
        });
    });
    console.log("Query is Finished")
    // When the Make dropdown changes
    $('#make').change(function() {
        const selectedMake = $(this).val();
        $('#model').prop('disabled', !selectedMake);
        $('#year').prop('disabled', true).empty().append('<option value="">Select Year</option>');
        console.log(selectedMake)


        if (selectedMake) {
            const filteredModels = cars
                .filter(car => car.make == selectedMake)
                .map(car => car.model);
            const uniqueModels = [...new Set(filteredModels)];
            console.log(selectedMake)
            $('#model').empty().append('<option value="">Select Model</option>');
            uniqueModels.forEach(model => {
                $('#model').append(`<option value="${model}">${model}</option>`);
            });
        } else {
            $('#model').empty().append('<option value="">Select Model</option>');
        }
    });

    // When the Model dropdown changes
    $('#model').change(function() {
        const selectedMake = $('#make').val();
        const selectedModel = $(this).val();
        $('#year').prop('disabled', !selectedModel);

        if (selectedModel) {
            const years = cars
                .filter(car => car.make === selectedMake && car.model === selectedModel)
                .map(car => car.year);
            const uniqueYears = [...new Set(years)];

            $('#year').empty().append('<option value="">Select Year</option>');
            uniqueYears.forEach(year => {
                $('#year').append(`<option value="${year}">${year}</option>`);
            });
        } else {
            $('#year').empty().append('<option value="">Select Year</option>');
        }
    });
});
$('#query-button').click(function() {
    const selectedMake = $('#make').val();
    const selectedModel = $('#model').val();
    const selectedYear = $('#year').val();

    if (selectedMake && selectedModel && selectedYear) {
        $.getJSON('/query', { make: selectedMake, model: selectedModel, year: selectedYear }, function(data) {
            console.log(data)
            $('#results').empty();
            if (data.length > 0) {
                data.forEach(car => {
                    $('#results').append('<div>Testing</div>');
                });
            } else {
                $('#results').append('<div>No results found.</div>');
            }
        }).fail(function() {
            $('#results').empty().append('<div>Error fetching results.</div>');
        });
    } else {
        alert('Please select Make, Model, and Year.');
    }
});
