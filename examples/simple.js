// if you don't specify a html file, the sniper will generate a div with id "rootDiv"
var app = require("biojs-vis-pca");

//Create array which will contain all groupby options such as SampleType
var groupByOptions = [];

// This is the groupby option that will be used to render the scatter plot
var groupByoption;

//set default values for xDomain, yDomain
var xDomain = "PC1"; //xDomain is used to setup the domain for x axis and circle's cx attribute in scatter_plot
var yDomain = "PC2"; //yDomain is used to setup the domain for y axis and circle's cy attribute in scatter_plot

//store the data for bar chart
var barChartData;

//store the metadata about how all points are grouped
var metadata;

// number of principle components that will be displayed in bar chart
var numberOfComponents = 5;

//number of bars that are clicked
var numOfClickedBars = 0;

//store the clicked bars' ids
var clickedBarId = [];

var body = document.getElementsByTagName("body")[0];

//Create a select list for groupby options
var groupBySelectList = document.createElement("select");
groupBySelectList.id = "colorSelect";
body.appendChild(groupBySelectList); // append the select list to body

//load the metadata for groupby options
d3.tsv("../data/6932_metadata.tsv", function(error, data) {
    metadata = data;

    /*
    For the tsv file, we expect rows as sample ids
    and columns as group by options
    (except for 1st one which is sample id and
    columns with name ReadFile1 & ReadFile2 which are irrelevant to group by options)
    */
    /*
    After load the file, all data are stored in metadata.
    metadata is an array of objects. All bojects use same column names (eg. SampleType) as keys.
    We want to get these keys as groupByOptions.
    */
    groupByOptions = Object.keys(metadata[0]);

    //We would like to remove SampleID, ReadFile1 and ReadFile2 from groupByOptions, because they won't be used as groupby options.
    var itemsToBeRemoved = ["SampleID", "ReadFile1", "ReadFile2"];
    for (var i = 0; i < itemsToBeRemoved.length; i++) {
      var index = groupByOptions.indexOf(itemsToBeRemoved[i]); //find index of target item in groupByOptions
      groupByOptions.splice(index, 1);
    }

    /*In order to allow usedrs to choose different groupByOptions,
    we need to creaet option elements in the select list for each groupByoption.
    */
    for (var i = 0; i < groupByOptions.length; i++) {
        var option = document.createElement("option");
        option.text = groupByOptions[i];
        if (i === 0) {
          option.defaultSelected = true; // set the first option element as default option
        }
        groupBySelectList.appendChild(option); // append the option element to the select list
    }

    //set the default groupByoption
    groupByoption = groupByOptions[0];
});

//create and append the reset button
var resetButton = document.createElement("button");
resetButton.innerHTML = "Reset";

/*
when click the reset button, first reset the variables, then re-draw the graph.
*/
resetButton.onclick = function(){
  numOfClickedBars = 0;
  clickedBarId = [];
  xDomain = "PC1";
  yDomain = "PC2";
  groupByoption = groupByOptions[0];
  default_graph();
  groupBySelectList.options[0].selected = true; //reset the select list
};
body.appendChild(resetButton);

var brushButton = document.createElement("button");
brushButton.innerHTML = "Toggle Brush";
brushButton.className = "brushButton";
body.appendChild(brushButton);

// create the tooltip for points in scatter plot
var tooltip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0, +110])
    .html(function(d){
        sampleID = d.SampleID;
        component1 = d[xDomain];
        component2 = d[yDomain];
        temp = "SampleID: " + sampleID + "<br/>" +
               component1 + ", " + component2
        return temp;
    });

//load the bar chart data
d3.tsv("../data/PCA_transcript_expression_TMM_RPKM_log2_screetable_prcomp_variance.6932.tsv", function(error, data) {
    data.forEach(function(d) {
      d.eigenvalue = +d.eigenvalue;
    });
    barChartData = data;
});

default_graph();

// render the default graph, use SampleType as color domain
function default_graph(){
d3.tsv("../data/PCA_transcript_expression_TMM_RPKM_log2_sample_data.6932.tsv", function(error, data) {
      data.forEach(function(d) {
        d.PC1 = +d.PC1;
        d.PC2 = +d.PC2;
        d.PC3 = +d.PC3;
        d.PC4 = +d.PC4;
        d.PC5 = +d.PC5;
      });

      target = rootDiv;
      var options = {
        metadata: metadata,
        clickedBars: clickedBarId,
        numOfClickedBars: numOfClickedBars,
        numberOfComponents: numberOfComponents,  //used to determine how many components will be showed in the bar chart
        barChartData: barChartData,
        barChartHeight:500,
        barChartWidth: numberOfComponents * 40,
        groupByoption: groupByoption,
        allGroupByOptions: groupByOptions,
        xDomain: "PC1",
        yDomain: "PC2",
        circle_radius: 8,
        data: data,
        height: 500, // height for scatter plot
        width: 960,  //width for scatter plot
        fullWidth: 1500, //width for the whole graph
        fullHeight: 500, //height for the whole graph
        marginForPCA: {
          top: 10,
          right: 50,
          bottom: 30,
          left: 40
        },
        marginForBar: {
          top: 10,
          right: 10,
          bottom: 30,
          left: 50
        },
        target: target,
        tooltip: tooltip,
        x_axis_title: "PC1",
        y_axis_title: "PC2",
      };

      //merge each SampleID's metadata to its raw data
       for (var i = 0; i < data.length; i++) {
         jQuery.extend(options.data[i],options.metadata[i]);
       }

      var instance = new app(options);

      // Get the d3js SVG element
      var tmp = document.getElementById(rootDiv.id);
      var svgForPCA = tmp.getElementsByTagName("svg")[0];
      var svgForBar = tmp.getElementsByTagName("svg")[1];
      // Extract the data as SVG text string
      var svgForScatter_xml = (new XMLSerializer).serializeToString(svgForPCA);
      var svgForBar_xml = (new XMLSerializer).serializeToString(svgForBar);
  
});
}
