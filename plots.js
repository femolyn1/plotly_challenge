function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
     optionChanged(sampleNames[0]); 
  });}
  
  
  
  function optionChanged(newSample) {
    buildMetadata(newSample);
   buildCharts(newSample);
  }

  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var metadataArray = metadata.filter(metadataObj => parseInt(metadataObj.id) ===parseInt(sample));
      var metadataResult = metadataArray[0];
      
      var PANEL = d3.select("#sample-metadata");
      // To clear the panel after each selection
      PANEL.html("");
      // To  the objects key value pair 
      Object.entries(metadataResult).forEach(([key,value])=>
      {
      PANEL.append("h6").text(`${key}:${value}`);
      });
       
      });
  }
  function buildCharts(sample) {
     d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var metadataArray = metadata.filter(metadataObj => parseInt(metadataObj.id) ===parseInt(sample));
      var metadataResult = metadataArray[0];
    
     let samples = data.samples
    let samplesArray = samples.filter(sampleObj =>parseInt( sampleObj.id )===parseInt(sample));
    let samplesResult = samplesArray[0]
     console.log(samplesResult);

     // Obtain Otu_ids for user selected IDs
     otu_ids = samplesResult["otu_ids"]
      console.log(otu_ids)
      // obtain Sample values
      sample_values= samplesResult["sample_values"]
      // Obtain otu label
      Otu_labels =samplesResult["otu_labels"]
  // Sort Otu ids

    var Species ={};

    for (var i=0; i < otu_ids.length; i++){ 
      otu_id =otu_ids[i];
      sample_value =sample_values[i];
      otu_label=Otu_labels[i];
      Species[otu_id] = [sample_value, otu_label];
    }
    sortedSpecies = Object.entries(Species).sort((a,b) => b[1][0] - a[1][0]);
    
 // Slice the first 10 objects for plotting
 if (!sortedSpecies){
   sortedSpecies();
 }
  var topTen =null;
 if (sortedSpecies.length > 0){
   topTen =sortedSpecies.slice(0,10);
 }
else {topTen =Object.entries(Species);
}
     
// Data for the bar chart
 
let Axis_y=  topTen.map(obj => `otu_${obj[0]}`).reverse();
let Axis_x= topTen.map(obj => obj[1][0]).reverse();
let textinfo = topTen.map(obj=> obj[1][1]).reverse();


// Create trace for bar chart 
let trace = {
  x: Axis_x,
  y: Axis_y,
  type: "bar",
  orientation:"h",
  text: textinfo
}

var data = [trace];
// Apply the group bar mode to the layout
var layout = {
title: "Top 10 Bacteria Species",
xaxis: {title: "Counts"},
yaxis: {title:"OTUS" }
};
// // Render the plot to the div tag with id "plot"
Plotly.newPlot("bar", data, layout);

//Create Trace for Bubble Chart
let trace1 ={
  x: otu_ids,
  y: sample_values,
  mode: "markers",
  marker:{
    color:otu_ids,
    size: sample_values
  },
  text: sortedSpecies.map(obj=> obj[1][1])
};
var data2 =[trace1]

//Obtain range of y values to fully display the bubbles
let maxval =0; 
sample_values.forEach(val =>{
  if (val > maxval){
    maxval =val;
  }
});
// Create layout
let layout2 = {
  title: "OTU Distribution",
  showlegend: false,
  yaxis: {title: "Count"},
  xaxis:{ title: "OTUs"}

};

// To ensure bubbles are fully displayed
if (maxval > 100){
  layout ["height"] = maxval * 3;
}
Plotly.newPlot("bubble", data2,layout2);

//Gauge Plot
var data3 = [
  {
    type: "indicator",
    mode: "gauge+number+delta",
    value: metadataResult.wfreq,
    title: { text: "Washing Frequency Scrub Per Week", font: { size: 15 } },
    //delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
    gauge: {
      axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
      bar: { color: "darkblue" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [
        { range: [0, 1], color: "cyan" },
        { range: [1, 2], color: "royalblue" },
        {range: [2,3], color: "lightgreen"},
        {range: [3,4], color: "yellow"},
        {range: [4,5], color: "grey"},
        {range: [5,6], color: "blue"},
        {range: [6,7], color: "green"},
        {range: [7,8], color: "lightgrey"},
        {range: [8,9], color: "darkblue"},
       
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 490
      }
    }
  }
];

var layout3 = {
  width: 500,
  height: 400,
  margin: { t: 25, r: 25, l: 25, b: 25 },
  paper_bgcolor: "lavender",
  font: { color: "darkblue", family: "Arial" }
};

Plotly.newPlot('gauge', data3, layout3);



    }
    
     )};

init();
    