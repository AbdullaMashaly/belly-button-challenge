// Assign the url to a variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Declare an empty variable to store fetched data in it
let allData = [];
// Fetch data using D3 
d3.json(url).then( apiData => {
    allData = apiData;
    console.log("Data", allData);
    init(allData);

    let namesArray = allData.names;
    namesArray.map(function (name) {
    let option = d3.select("#selDataset").append("option");
    option.text(`${name}`);
});
})

function init(data) {
    let sampleValues = data.samples[0].sample_values;
    sampleValues = sampleValues.map(val => parseInt(val));
    let hoverText = data.samples[0].otu_labels;
    let otuIDS = data.samples[0].otu_ids;
    // otuIDS = otuIDS.map(val => (`OTU ${val}`))
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
    
    let bubbleData = [{
        x : otuIDS,
        y: sampleValues,
        mode: 'markers',
        marker: {
            color: otuIDS,
            size: sampleValues,
            colorscale: 'Cividis' // Viridis, Cividis, Bluered, RdBu, Blues, Picnic, Rainbow, Blackbody
        },
        text: hoverText
    }]

    let bubbleLayout = {
        xaxis: {
            title: "OTU ID"
        },
        yaxis: {
            range: [0, 250]
        }
      };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    let metadata = data.metadata[0];
    let metadataKeys = Object.keys(metadata)
    let metadataValues = Object.values(metadata)

    for (let i = 0; i < metadataKeys.length; i++) {
        let line = d3.select("#sample-metadata").append("h6")
        line.text(`${metadataKeys[i]} : ${metadataValues[i]}`)
    }
    

}


// function optionChanged(value) {
//     let idNumber = value
// }