function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  d3.select(`/metadata/${sample}`).then((data) => { // Use `d3.json` to fetch the metadata for a sample
    var samplePanel = d3.select("#sample-metadata");
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    samplePanel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      samplePanel.append("p").text(`${key}: ${value}`);
    });
   
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    // var WFREQ = metadata3.WFREQ;
  });
};

    
function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data)=>{
    // console.log(data)
    const otu_ids=data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
 
    var pieData = [
      {
      labels: otu_ids.slice(0,10),
      values: sample_values.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      type:'pie'
      }
    ];
    
    var pieLayout = {
      heigt:400,
      width:900
    };

    Plotly.newPlot('pie', pieData, pieLayout);

  
    // @TODO: Build a Bubble Chart using the sample data
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    var bubbleLayout = {
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" }
    };


    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  });
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
