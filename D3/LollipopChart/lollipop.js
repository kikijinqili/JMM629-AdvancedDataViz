let dimensions = {
    width: window.innerWidth * 0.9,
    height: 600,
    margin: {
        top: 20,
        right: 80,
        bottom: 30,
        left: 80,
    },
};

dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

var svg = d3.select("figure#chart")
    .append("svg")
    .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
    .append("g") // group objects
    .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

// think scale as function f(x) = something
var xScale = d3.scaleLinear()
    .range([0, dimensions.boundedWidth]);

var yScale = d3.scaleBand()
    .range([0, dimensions.boundedHeight])
    .padding(0.3);

var rowConverter = function(d) {
    return {
        genre: d.genre,
        votes: +d.count // int use +
    }
};

// loading data in d3v5
d3.csv("data.csv", rowConverter)
    .then(
        // chart goes here
        function(data) {
            // console.log(data);

            // update the domain of xscale with d3.extent
            // xScale.domain(d3.extent(data, function(d) {return d.votes;}));
            xScale.domain([0, d3.max(data, d => d.votes) * 1.20]);

            yScale.domain(data.map(d => d.genre));

            var xAxis = svg.append("g")
                .attr("class", "x axis")
                .call(d3.axisBottom(xScale)) // axisTop
                .attr("transform", `translate(0, ${dimensions.boundedHeight})`);

            var xAxisText = xAxis.selectAll("text")
                .attr("class", "axis_text");

            var sticks = svg.selectAll("myline")
                .data(data)
                .enter()
                .append("line")
                .attr("x1", xScale(0))
                .attr("x2", d => xScale(d.votes))
                .attr("y1", d => yScale(d.genre) + 11)
                .attr("y2", d => yScale(d.genre) + 11)
                .attr("stroke", "#bada55")
                .attr("stroke-width", "2");
            console.log(sticks);

            var candy = svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cy", d => yScale(d.genre) + 12)
                .attr("cx", d => xScale(d.votes))
                .attr("r", "10")
                .attr("fill", "#bada55");

            // var sticks0 = svg.selectAll("rect")
            //     .data(data)
            //     .enter()
            //     .append("rect")
            //     .attr("x", "0")
            //     .attr("y", d => yScale(d.genre) + 11)
            //     .attr("width", d => xScale(d.votes))
            //     .attr("height", "2")
            //     .attr("fill", "#bada55");
            // console.log(sticks0);

            var yAxis = svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(yScale));
                
            var yAxisText = yAxis.selectAll("text")
                .attr("class", "axis_text");

        }
    );
