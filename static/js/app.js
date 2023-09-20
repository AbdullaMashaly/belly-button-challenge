// Assign the url to a variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Declare an empty variable to store fetched data in it
let allData = [];
// Fetch data using D3 
d3.json(url).then( apiData => {
    allData = apiData;
    console.log("Data", allData);
    init(allData);
})

function init(data) {
    let sampleValues = data.samples[0].sample_values;
    sampleValues = sampleValues.map(val => parseInt(val));
    let hoverText = data.samples[0].otu_labels;
    let otuIDS = data.samples[0].otu_ids;
    otuIDS = otuIDS.map(val => (`OTU ${val}`))
    let plotData =[{
        x : sampleValues.slice(0,10),
        y : otuIDS.slice(0,10),
        type: "bar",
        orientation: "h",
        text: hoverText.slice(0,10)
    }];


    let layout = {
        height: 600,
        width: 800,
        yaxis: {
            autorange: 'reversed'
        }
      };

    console.log("Plot", plotData);

    Plotly.newPlot("bar", plotData, layout);

}
