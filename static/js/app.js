// Use the D3 library to read in samples.json from the specified URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard and plots
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select('#selDataset');

    // Use D3 to get the sample names for populating the dropdown selections
    d3.json(url).then((data) => {

        // Define a variable for the sample names
        let names = data.names;

        // Loop through the "names" array (i.e. the sample ID number array) and append each ID to the dropdown menu
        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Assign the first sample name to a variable
        let first_sample_name  = names[0];

        // Create the names for the functions that will be used (Metadata, Bar Chart , Bubble Chart, and Gauge)
        metaData(first_sample_name);
        barChart(first_sample_name);
        bubbleChart(first_sample_name);
        gaugeChart(first_sample_name);
    });
};

// MetaData Function
function metaData(selectedSample) {

    // Fetch all of the data using D3
    d3.json(url).then((data) => {

        // Retreive the metadata
        let metadata = data.metadata;

        // Filter the data based on the sample value
        let filteredValues = metadata.filter(meta => meta.id == selectedSample);

        // Log the filtered array of metadata objects
        console.log(filteredValues)

        // Assign the first value
        let obj = filteredValues[0]

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key:value pair
        Object.entries(obj).forEach(([key,value]) => {

            // Log the individual key:value pairs as they are being appended
            console.log(key, value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// BarChart Function
function barChart(selectedSample) {

    // Fetch all of the data using D3
    d3.json(url).then((data) => {

        // Retreive the sample data
        let sampleData = data.samples;

        // Filter the sample data based on the value of the sample
        let filteredValues = sampleData.filter(sample => sample.id == selectedSample);

        // Assign the first value
        let obj = filteredValues[0];

        // Get the sample_values, otu_ids, and otu_labels
        let sample_values = obj.sample_values;
        let otu_ids = obj.otu_ids;
        let otu_labels = obj.otu_labels;
        
        // Log the data to the console
        console.log(sample_values, otu_ids,otu_labels);

        // Select the top 10 items (to be displayed in descending order)
        let xticks = sample_values.slice(0,10).reverse();
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        // Set up the trace for the bar chart
        let trace = {
            x : xticks,
            y : yticks,
            text : labels,
            type : "bar",
            orientation : "h"
        };

        // Define the layout
        let layout = {
            title: "Top 10 OTUs"
        };

        // Use Plotly to create the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// BubbleChart Function
function bubbleChart(selectedSample) {

    // Fetch all of the data using D3
    d3.json(url).then((data) => {

        // Retreive the sample data
        let sampleData = data.samples;

        // Filter the sample data based on the value of the sample
        let filteredValues = sampleData.filter(sample => sample.id == selectedSample);

        // Assign the first value
        let obj = filteredValues[0];

        // Get the sample_values, otu_ids, and otu_labels
        let sample_values = obj.sample_values;
        let otu_ids = obj.otu_ids;
        let otu_labels = obj.otu_labels;
        
        // Log the data to the console
        console.log(sample_values, otu_ids,otu_labels);

        // Set up the trace for the bubble chart
        let trace1 = {
            x : otu_ids,
            y : sample_values,
            text : otu_labels,
            mode : "markers",
            marker : {
                size : sample_values,
                color : otu_ids,
                colorscale : "Earth"
            }
        };

        // Define the layout
        let layout = {
            title : "Bacteria, OTU IDs, and Value Counts Per Sample",
            hovermode : "closest",
            xaxis : {title: "OTU ID",}
        };

        // Use Plotly to create the bubble chart
        Plotly.newPlot("bubble", [trace1], layout);
    });
}

// GaugeChart function
function gaugeChart(selectedSample) {

    // Fetch all of the data using D3
    d3.json(url).then((data) => {

        // Retreive the metadata
        let metadata = data.metadata;

        // Filter the data based on the sample value
        let filteredValues = metadata.filter(meta => meta.id == selectedSample);

        // Log the filtered array of metadata objects
        console.log(filteredValues)

        // Assign the first value
        let obj = filteredValues[0]

        // Use Object.values to get each key:value pair from the metadata chart (i.e. demographics chart)
        let weeklyWashFrequency = Object.values(obj)[6]

        // Set up the trace for the gauge chart
        let trace2 = {
            domain : {x : [0,1], y : [0,1]},
            value : weeklyWashFrequency,
            title : {
                text : "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
                font : {color : "black", size : 15}
            },
            type : "indicator",
            mode : "gauge+number",
            gauge : {
                axis : { range : [null, 10], tickwidth : 1, tickcolor : "black" },
                bar : { color : "green" },
                steps : [
                    {range : [0,1], color : "rgb(235, 195, 350)"},
                    {range : [1,2], color : "rgb(220, 190, 345)"},
                    {range : [2,3], color : "rgb(205, 185, 340)"},
                    {range : [3,4], color : "rgb(190, 180, 335)"},
                    {range : [4,5], color : "rgb(175, 175, 330)"},
                    {range : [5,6], color : "rgb(160, 170, 325)"},
                    {range : [6,7], color : "rgb(145, 165, 320)"},
                    {range : [7,8], color : "rgb(130, 160, 315)"},
                    {range : [8,9], color : "rgb(115, 155, 310)"},
                    {range : [9,10], color : "rgb(100, 150, 305"},
                ]
            }
        };

        // Define the layout
        let layout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            font: { color: "darkblue", family: "Arial" }
          };
          
        // Use Plotly to create the gauge chart
        Plotly.newPlot('gauge', [trace2], layout)
    });
};

// Create a Function that updates the dashboard when the sample is changed
function optionChanged(selectedSample) { 

    // Log the new value
    console.log(selectedSample); 

    // Call all functions 
    metaData(selectedSample);
    barChart(selectedSample);
    bubbleChart(selectedSample);
    gaugeChart(selectedSample);
};

// Initialize
init();