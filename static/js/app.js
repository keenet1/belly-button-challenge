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
        console.log(filteredValue)

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

        // Set up the trace
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
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


// Create a Function that updates dashboard when the sample is changed
function optionChanged(selectedSample) { 

    // Log the new value
    console.log(selectedSample); 

    // Call all functions 
    buildMetadata(selectedSample);
    buildBarChart(selectedSample);
    buildBubbleChart(selectedSample);
    buildGaugeChart(selectedSample);
};

// Initialize
init();