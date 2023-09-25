// Assign the url to a variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Declare an empty variable to store fetched data in it
let allData = [];
// Fetch data using D3 
d3.json(url).then( apiData => {
    allData = apiData;
    // Print fetched data to console
    console.log("Data", allData);
    init(allData);

    // Append IDs to the dropdown list
    let namesArray = allData.names;
    namesArray.map(function (name) {
    let option = d3.select("#selDataset").append("option");
    option.text(`${name}`);
    });

    return allData;
});

function optionChanged(selection) {
    let idNumber = selection;
    console.log(idNumber);
    dashBoard(idNumber);
};

function dashBoard(id, data = allData ) {
    let metadata = data.metadata;
    let targetMetadata = metadata.filter(function(person) {return person.id === parseInt(id)});
    console.log(targetMetadata);

    let samples = data.samples;
    let targetSample = samples.filter(function(person) {return person.id === id});
    console.log(targetSample);

    let sampleValues = targetSample[0].sample_values;
    sampleValues = sampleValues.map(val => parseInt(val));
    let hoverText = targetSample[0].otu_labels;
    let otuIDS = targetSample[0].otu_ids;

    updateDemographic(targetMetadata);
    updateBubble(otuIDS, sampleValues, hoverText);
    updateBar(otuIDS, sampleValues, hoverText);

}

function updateDemographic (metadata) {
    d3.selectAll('h6').remove();
    let demoraphic = metadata[0];
    let demoraphicKeys = Object.keys(demoraphic)
    let demoraphicValues = Object.values(demoraphic)

    for (let i = 0; i < demoraphicKeys.length; i++) {
        let line = d3.select("#sample-metadata").append("h6")
        line.text(`${demoraphicKeys[i]} : ${demoraphicValues[i]}`)
    }
};

function updateBubble(otuIDS, sampleValues, hoverText) {
    let bubbleData = [{
        x : otuIDS,
        y: sampleValues,
        mode: 'markers',
        marker: {
            color: otuIDS,
            size: sampleValues,
            colorscale: 'Viridis' // Viridis, Cividis, Bluered, RdBu, Blues, Picnic, Rainbow, Blackbody
        },
        text: hoverText
    }]

    let bubbleLayout = {
        xaxis: {
            title: "OTU ID"
        }
    };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

};

function updateBar(otuIDS, sampleValues, hoverText) {
    let barData =[{
        x : sampleValues.slice(0,10),
        y : otuIDS.map(val => (`OTU ${val}`)).slice(0,10),
        type: "bar",
        orientation: "h",
        text: hoverText.slice(0,10)
    }];

    let layout = {
        yaxis: {
            autorange: 'reversed'
        }
    };
    
    Plotly.newPlot("bar", barData, layout);
}


function init(data) {
    let sampleValues = data.samples[0].sample_values;
    sampleValues = sampleValues.map(val => parseInt(val));
    let hoverText = data.samples[0].otu_labels;
    let otuIDS = data.samples[0].otu_ids;

    updateBar(otuIDS, sampleValues, hoverText);
    updateBubble(otuIDS, sampleValues, hoverText);
    updateDemographic(data.metadata);
    

}


