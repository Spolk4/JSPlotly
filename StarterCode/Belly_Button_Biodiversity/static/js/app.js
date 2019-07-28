function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json("/metadata/"+sample).then((metadata3)=>{
    console.log(metadata3)
    // Use d3 to select the panel with id of `#sample-metadata`
    var selector = d3.select("#sample-metedata");
    // Use `.html("") to clear any existing metadata
    selector.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    //Object.entries(metadata3).forEach([key, value]) => console.log('${key}: ${value}');
    // tags for each key-value in the metadata.
    var WFREQ = metadata3.WFREQ;
    delete metadata3.WFREQ;
    d3.select("#sample-metadata").append("table").append("tbody");
    Object.defineProperties(metadata3).forEach(([key, value])=>
    d3.select("tbody").append("tr").html(`<td><b>${key}</b><br/>${value}</td>`)
    );
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}
  )};
    

    

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/"+ sample).then((sampleNames)=>{
    //console.log(sampleNames)
    //sampleNames.sort(compare);
        // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    vardata = [{
      labels: sampleNames.otu_ids.slice(0,10),
      values: sampleNames.sample_values.slice(0,10),
      hovertext: sampleNames.otu_labels.slice(0,10),
      type:'pie'
    }];
    var layout = {
      heigt:400,
      width:900
    };

    plotly.newPlot('pie', data, layout);

  })
    // @TODO: Build a Bubble Chart using the sample data
  var trace1 ={
    x:sampleNames.otu_ids,
    y:sampleNames.sample_values,
    text: sampleNames.otu_labels,
    mode:'markers',
    marker:{
      size:sampleNames.sample_values,
      color:sampleNames.otu_ids,
      showscale:true
    }
  };
  var data = [trace1];

  var layout = {
    title:'Out ID',
    showlengend: false,
    height:600,
    width:900
  };

  Plotly.newPlot('bubble', data, layout);
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
