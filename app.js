const data = [
    { make: 'Toyota', model: 'Corolla', year: 2020, inventory: 150 },
    { make: 'Toyota', model: 'Camry', year: 2021, inventory: 180 },
    { make: 'Honda', model: 'Civic', year: 2020, inventory: 220 },
    { make: 'Honda', model: 'Accord', year: 2021, inventory: 200 },
    { make: 'Ford', model: 'Mustang', year: 2019, inventory: 250 },
    { make: 'Ford', model: 'Focus', year: 2020, inventory: 170 }
];
window.onload = function() {
    updateDashboard();
};


function updateDashboard() {
    let selectedMake = document.getElementById('make').value;
    let selectedModel = document.getElementById('model').value;
    let selectedYear = parseInt(document.getElementById('year').value);

 
    let filteredData = data.filter(item => 
        item.make === selectedMake && item.model === selectedModel && item.year === selectedYear
    );

    let inventory = filteredData.length > 0 ? filteredData[0].inventory : 0;

    let carInfo = document.getElementById('car-info');
    if (filteredData.length > 0) {
        carInfo.innerHTML = `
            <h3>Car Information</h3>
            <p><strong>Make:</strong> ${filteredData[0].make}</p>
            <p><strong>Model:</strong> ${filteredData[0].model}</p>
            <p><strong>Year:</strong> ${filteredData[0].year}</p>
            <p><strong>inventory:</strong> ${filteredData[0].inventory}</p>
        `;
    } else {
        carInfo.innerHTML = "<h3>No data available for the selected car.</h3>";
    }

    updateBarChart(inventory);


    let years = [2018, 2019, 2020, 2021];
    let inventoryData = [100, 150, inventory, inventory + 20];
    updateLineChart(years, inventoryData);

    let pieData = [inventory, 100];
    let labels = ['Selected Model', 'Others'];
    updatePieChart(pieData, labels);
}

function updateBarChart(inventory) {
    let svg = d3.select('#bar-chart .chart');
    svg.selectAll("*").remove();

    let width = svg.node().getBoundingClientRect().width;
    let height = svg.node().getBoundingClientRect().height;

    let x = d3.scaleBand()
        .domain(['inventory'])
        .range([0, width])
        .padding(0.1);

    let y = d3.scaleLinear()
        .domain([0, Math.max(inventory, 100)])
        .range([height, 0]);

    let bars = svg.selectAll('rect')
        .data([inventory]);

    bars.enter().append('rect')
        .attr('x', x('inventory'))
        .attr('y', d => y(d))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d))
        .attr('fill', 'steelblue');
}

function updateLineChart(years, inventoryData) {
    let svg = d3.select('#line-chart .chart');
    svg.selectAll("*").remove();

    let width = svg.node().getBoundingClientRect().width;
    let height = svg.node().getBoundingClientRect().height;

    let x = d3.scaleLinear()
        .domain(d3.extent(years))
        .range([0, width]);

    let y = d3.scaleLinear()
        .domain([0, d3.max(inventoryData)])
        .range([height, 0]);

    let line = d3.line()
        .x((d, i) => x(years[i]))
        .y(d => y(d));

    svg.append('path')
        .datum(inventoryData)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'orange')
        .attr('stroke-width', 2)
        .attr('d', line);

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .call(d3.axisLeft(y));
}

function updatePieChart(data, labels) {
    let svg = d3.select('#pie-chart .chart');
    svg.selectAll("*").remove(); 

    let width = svg.node().getBoundingClientRect().width;
    let height = svg.node().getBoundingClientRect().height;
    let radius = Math.min(width, height) / 2;

    let pie = d3.pie();
    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    let arcs = svg.selectAll('arc')
        .data(pie(data));

    let g = arcs.enter().append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

    g.append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => d3.schemeCategory10[i]); 

    g.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .text((d, i) => labels[i]);
}
