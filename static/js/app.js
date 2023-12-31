// Assign the url to a variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Declare an empty variable to store fetched data in it
let allData = [];
// Fetch data using D3 
d3.json(url).then( apiData => {
    allData = apiData;
    // Print fetched data to console
    console.log("Data", allData);

    // Initialize the dashboard with the first dataset
    init(allData);

    // Append IDs to the dropdown list
    let namesArray = allData.names;
    namesArray.map(function (name) {
    let option = d3.select("#selDataset").append("option");
    option.text(`${name}`);
    });

    return allData;
});

// Function to handle dropdown value change
function optionChanged(selection) { 
    let idNumber = selection;
    console.log(idNumber);
    dashBoard(idNumber);
};

// Function to update the data used when dropdown value change
function dashBoard(id, data = allData ) {
    let metadata = data.metadata;
    
    // Filter metadata based on the selected ID
    let targetMetadata = metadata.filter(function(person) {return person.id === parseInt(id)});
    console.log(targetMetadata);

    // Filter samples based on the selected ID
    let samples = data.samples;
    let targetSample = samples.filter(function(person) {return person.id === id});
    console.log(targetSample);

    // Extract relevant data for plotting
    let sampleValues = targetSample[0].sample_values;
    sampleValues = sampleValues.map(val => parseInt(val));
    let hoverText = targetSample[0].otu_labels;
    let otuIDS = targetSample[0].otu_ids;

    // Update Charts 
    updateDemographic(targetMetadata);
    updateBubble(otuIDS, sampleValues, hoverText);
    updateBar(otuIDS, sampleValues, hoverText);
    updateGauge(targetMetadata[0].wfreq);

}

// Function to display demographic metadata
function updateDemographic (metadata) {
    // Clear data from panel if any
    d3.selectAll('h6').remove();

    let demoraphic = metadata[0];
    let demoraphicKeys = Object.keys(demoraphic);
    let demoraphicValues = Object.values(demoraphic);;

    // Loop through and display demographic info
    for (let i = 0; i < demoraphicKeys.length; i++) {
        let line = d3.select("#sample-metadata").append("h6")
        line.text(`${demoraphicKeys[i]} : ${demoraphicValues[i]}`)
    };
};

// Function to update the bubble chart
function updateBubble(otuIDS, sampleValues, hoverText) {
    let bubbleData = [{
        x : otuIDS,
        y: sampleValues,
        mode: 'markers',
        marker: {
            color: otuIDS,
            size: sampleValues,
            colorscale: 'Earth'
        },
        text: hoverText
    }];

    let bubbleLayout = {
        title: {text: 'Sample Values', font: {size: 24}},
        xaxis: {
            title: "OTU ID"
        }
    };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

};

// Function to update the bar chart
function updateBar(otuIDS, sampleValues, hoverText) {
    let barData =[{
        x : sampleValues.slice(0,10),
        y : otuIDS.map(val => (`OTU ${val}`)).slice(0,10),
        type: "bar",
        orientation: "h",
        text: hoverText.slice(0,10)
    }];

    let layout = {
        title: {text: "Top 10 OTUs", font: {size: 24}},
        yaxis: {
            autorange: 'reversed'
        }
    };
    
    Plotly.newPlot("bar", barData, layout);
};

// Function to update the gauge chart
function updateGauge(wFreq) {
    let data =[
        {   
            type: "indicator",
            mode: "gauge+number",
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: { size: 24 } },
            value : parseInt(wFreq),
            gauge: {
                axis:{
                    range: [0, 9],
                    tickmode: 'linear',
                    tickfont: {
                        size: 15
                    }
                },
                bar: { color: 'brown'},
                steps: [
                    { range: [0, 1], color: 'rgb(255,255,217)' },
                    { range: [1, 2], color: 'rgb(237,248,217)' },
                    { range: [2, 3], color: 'rgb(199,233,180)' },
                    { range: [3, 4], color: 'rgb(127,205,187)' },
                    { range: [4, 5], color: 'rgb(65,182,196)' },
                    { range: [5, 6], color: 'rgb(29,145,192)' },
                    { range: [6, 7], color: 'rgb(34,94,168)' },
                    { range: [7, 8], color: 'rgb(37,52,148)' },
                    { range: [8, 9], color: 'rgb(8,29,88)' }
                ]
            }
        }
    ]

    let layout = {
        paper_bgcolor :'white'
    };

    Plotly.newPlot('gauge', data, layout);
}

// Initial function to populate the dashboard on page load
function init(data) {
    let sampleValues = data.samples[0].sample_values;
    sampleValues = sampleValues.map(val => parseInt(val));
    let hoverText = data.samples[0].otu_labels;
    let otuIDS = data.samples[0].otu_ids;

    // Charts and metadata display with the first dataset
    updateBar(otuIDS, sampleValues, hoverText);
    updateBubble(otuIDS, sampleValues, hoverText);
    updateDemographic(data.metadata);
    updateGauge(data.metadata[0].wfreq);
};


