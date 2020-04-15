/***********************************************/

var path = "samples.json"


function optionChanged(newSample) {

    createGauge(newSample);
    createBarchart(newSample);
    createBubbleChart(newSample);
    buildMetadata(newSample);
}
/***********************************************/

function createGauge(sample) {


    console.log(sample)
    d3.json(path).then(d => {

        var meta = d.metadata;
        var filteredList = meta.filter(d => d.id === parseInt(sample));
        var Sample_Meta = filteredList[0];
        var metabody = d3.select("#gauge");
        metabody.html("")

        console.log(Sample_Meta)

        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: Sample_Meta.wfreq,
                title: { text: "Belly Button Washing Frequency (Scrub per Week)" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 1], color: "lightgray" },
                        { range: [1, 2], color: "gray" },
                        { range: [2, 3], color: "lightgray" },
                        { range: [4, 5], color: "gray" },
                        { range: [5, 6], color: "lightgray" },
                        { range: [6, 7], color: "gray" },
                        { range: [7, 8], color: "lightgray" },
                        { range: [8, 9], color: "gray" }
                    ]
                }
            }]

        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data, layout);


    })

}


function buildMetadata(sample) {


    d3.json(path).then(d => {

        var meta = d.metadata;
        var filteredList = meta.filter(d => d.id === parseInt(sample));
        var Sample_Meta = filteredList[0];
        var metabody = d3.select("#sample-metadata");
        metabody.html("")

        Object.entries(Sample_Meta).forEach(d => {
            metabody.append("p").text(`${d[0]} : ${d[1]}`)
        })

    })
}
/***********************************************/
function createBubbleChart(sample) {


    d3.json(path).then(d => {

        var samples = d.samples
        var filteredData = samples.filter(d => d["id"] === sample);
        var filteredObject = filteredData[0]
        var Sample_values = filteredObject.sample_values;
        var OTU_ids = filteredObject.otu_ids;
        var OTU_labels = filteredObject.otu_labels;

        var trace1 = {
            x: OTU_ids,
            y: Sample_values,
            text: OTU_labels,
            mode: 'markers',
            marker: {
                opacity: Sample_values.map(d => 0.6),
                size: Sample_values,
                color: OTU_ids,
            }
        };

        var data = [trace1];

        var layout = {
            showlegend: false,
            height: 600,
            width: 1200,
            xaxis: {
                title: {
                    text: 'OTU ID'
                }
            }
        }

        Plotly.newPlot('bubble', data, layout);



    })

}

/***********************************************/
function createBarchart(sample) {

    d3.json(path).then(d => {

        var samples = d.samples
        var filteredData = samples.filter(d => d["id"] === sample);
        var filteredObject = filteredData[0]
        var dataArray = filteredObject.sample_values.slice(0, 10).reverse();
        var y_list = filteredObject.otu_ids.slice(0, 10).reverse();
        var dataCategories = y_list.map(d => "OTU " + d)

        // svg container
        var height = 450;
        var width = 500;

        // margins
        var margin = {
            top: 50,
            right: 25,
            bottom: 25,
            left: 100
        };

        // chart area minus margins
        var chartHeight = height - margin.top - margin.bottom;
        var chartWidth = width - margin.left - margin.right;

        // create svg container

        var svg = d3.select("#bar");
        svg.html("")

        svg = d3.select("#bar").append("svg")
            .attr("height", height)
            .attr("width", width);

        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        var yScale = d3.scaleBand()
            .domain(dataCategories)
            .range([chartHeight, 0])
            .padding(0.1);

        var xScale = d3.scaleLinear()
            .domain([0, d3.max(dataArray)])
            .range([0, chartWidth])

        // create axes
        var yAxis = d3.axisLeft(yScale);
        var xAxis = d3.axisTop(xScale);

        // set x to the bottom of the chart
        chartGroup.append("g")
            .call(xAxis);

        // set y to the y axis
        chartGroup.append("g")
            .call(yAxis);

        // Create the rectangles using data binding
        var barsGroup = chartGroup.selectAll("rect")
            .data(dataArray)
            .enter()
            .append("rect")
            .attr("y", (d, i) => yScale(dataCategories[i]))
            .attr("height", yScale.bandwidth())
            .attr("width", d => xScale(d))
            .attr("fill", "lightseagreen");



    })
}




/***********************************************/
function fillDropDown() {
    // write code to pupulate the dropdown

    d3.json(path)
        .then(d => {
            var dropdown = d3.select("#selDataset")
            d.names.forEach(n => {
                option = dropdown.append("option");
                option.text(n)
                option.attr('value', n)

            })
        })
}
/***********************************************/

fillDropDown();