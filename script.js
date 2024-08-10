// Configuración del SVG
var width = 800;
var height = 600;
var margin = {top: 20, right: 30, bottom: 40, left: 90};

// Crear SVG
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Procesamiento de datos
d3.csv("data.csv").then(function(data) {
    // Filtrar datos
    var filteredData = data.filter(d => +d["Percent of total deaths"] >= 0.5);

    var others = data.filter(d => +d["Percent of total deaths"] < 0.5);
    var othersTotal = d3.sum(others, d => +d["Percent of total deaths"]);

    filteredData.push({ "Cause of death or injury": "Others", 
                        "Percent of total deaths": othersTotal, 
                        "Deaths annual % change": d3.mean(others, d => +d["Deaths annual % change"])
                      });

    // Escalas
    var x = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => +d["Percent of total deaths"])])
        .range([0, width]);

    var y = d3.scaleBand()
        .domain(filteredData.map(d => d["Cause of death or injury"]))
        .range([0, height])
        .padding(0.1);

    // Ejes
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // Barras
    svg.selectAll(".bar")
      .data(filteredData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => y(d["Cause of death or injury"]))
        .attr("width", d => x(d["Percent of total deaths"]))
        .attr("height", y.bandwidth())
        .attr("fill", d => d["Deaths annual % change"] > 0 ? "red" : "green");

    // Añadir etiquetas
    svg.selectAll(".label")
      .data(filteredData)
      .enter().append("text")
        .attr("class", "label")
        .attr("x", d => x(d["Percent of total deaths"]) + 5)
        .attr("y", d => y(d["Cause of death or injury"]) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .text(d => d["Percent of total deaths"] + "%");
});