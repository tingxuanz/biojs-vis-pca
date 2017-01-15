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
groupBySelectList.onchange = function(){if (typeof(this.selectedIndex) != 'undefined')
                                {
                                  color_by_option(this.selectedIndex);
                                }
};
body.appendChild(groupBySelectList); // append the select list to body

//load the metadata for groupby options
d3.tsv("../data/6932_metadata.tsv", function(error, data) {
    metadata = data;

    /*metadata is an array of objects. Each object in this array has same keys (eg. SampleType).
      We only want the keys as groupByOptions*/
    groupByOptions = Object.keys(metadata[0]);

    //We would like to remove SampleID, ReadFile1 and ReadFile2 from groupByOptions, because they won't be used as groupby options.
    var index1 = groupByOptions.indexOf("SampleID");
    groupByOptions.splice(index1,1);
    var index2 = groupByOptions.indexOf("ReadFile1");
    groupByOptions.splice(index2,1);
    var index3 = groupByOptions.indexOf("ReadFile2");
    groupByOptions.splice(index3,1);

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
  //colorDomain = colorBy.SampleType;
  default_graph();
  groupBySelectList.options[0].selected = true; //reset the select list

};
body.appendChild(resetButton);

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
      });

      target = rootDiv;
      var options = {
        metadata: metadata,
        clickedBars: clickedBarId,
        numberOfComponents: numberOfComponents,  //used to determine how many components will be showed in the bar chart
        barChartData: barChartData,
        barChartHeight:900,
        barChartWidth: numberOfComponents * 30,
        groupByoption: groupByoption,
        xDomain: "PC1",
        yDomain: "PC2",
        circle_radius: 8,
        data: data,
        height: 500, // height for scatter plot
        width: 960,  //width for scatter plot
        fullWidth: 1300, //width for the whole graph
        fullHeight: 930, //height for the whole graph
        margin: {
          top: 10,
          right: 20,
          bottom: 10,
          left: 40
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
      var svg = tmp.getElementsByTagName("svg")[0];

      // Extract the data as SVG text string
      var svg_xml = (new XMLSerializer).serializeToString(svg);

      clickBar();
});
}
//re-render the graph according to the color option
function color_by_option(index){
  var chosenOption = groupBySelectList.options[index];

  if (chosenOption.selected === true) {
    for (var i = 0; i < groupByOptions.length; i++) {
      if (chosenOption.text === groupByOptions[i]) {
        groupByoption = groupByOptions[i];
      }
    }
  }
  // each time the option is changed, we need to read the file and redener the svg again.
  d3.tsv("../data/PCA_transcript_expression_TMM_RPKM_log2_sample_data.6932.tsv", function(error, data) {
    data.forEach(function(d) {
      d[xDomain] = +d[xDomain];
      d[yDomain] = +d[yDomain];
    });

    target = rootDiv;
    var options = {
      clickedBars: clickedBarId,
      numberOfComponents: numberOfComponents,  //used to determine how many components will be showed in the bar chart
      barChartData: barChartData,
      barChartHeight:900,
      barChartWidth: numberOfComponents * 30,
      groupByoption: groupByoption,
      xDomain: xDomain,
      yDomain: yDomain,
      circle_radius: 8,
      data: data,
      height: 500, // height for scatter plot
      width: 960,  //width for scatter plot
      fullWidth: 1300, //width for the whole graph
      fullHeight: 930, //height for the whole graph
      margin: {
        top: 10,
        right: 20,
        bottom: 10,
        left: 40
      },
      target: target,
      tooltip: tooltip,
      x_axis_title: xDomain,
      y_axis_title: yDomain,
    };

    for (var i = 0; i < data.length; i++) {
      jQuery.extend(options.data[i],metadata[i]);
    }

    var instance = new app(options);

    // Get the d3js SVG element
    var tmp = document.getElementById(rootDiv.id);
    var svg = tmp.getElementsByTagName("svg")[0];

    // Extract the data as SVG text string
    var svg_xml = (new XMLSerializer).serializeToString(svg);
    clickBar();
  });
}

//re-render the graph according to the chosen components
function choose_components(){
   xDomain = clickedBarId[0];
   yDomain = clickedBarId[1];

  // each time the option is changed, we need to read the file and redener the svg again.
  d3.tsv("../data/PCA_transcript_expression_TMM_RPKM_log2_sample_data.6932.tsv", function(error, data) {
    data.forEach(function(d) {
      d[xDomain] = +d[xDomain];
      d[yDomain] = +d[yDomain];
    });

    target = rootDiv;
    var options = {
      clickedBars: clickedBarId,
      numberOfComponents: numberOfComponents,  //used to determine how many components will be showed in the bar chart
      barChartData: barChartData,
      barChartHeight:900,
      barChartWidth: numberOfComponents * 30,
      groupByoption: groupByoption,
      xDomain: xDomain,
      yDomain: yDomain,
      circle_radius: 8,
      data: data,
      height: 500, // height for scatter plot
      width: 960,  //width for scatter plot
      fullWidth: 1300, //width for the whole graph
      fullHeight: 930, //height for the whole graph
      margin: {
        top: 10,
        right: 20,
        bottom: 10,
        left: 40
      },
      target: target,
      tooltip: tooltip,
      x_axis_title: xDomain,
      y_axis_title: yDomain,
    };

    for (var i = 0; i < data.length; i++) {
      jQuery.extend(options.data[i],metadata[i]);
    }


    var instance = new app(options);

    // Get the d3js SVG element
    var tmp = document.getElementById(rootDiv.id);
    var svg = tmp.getElementsByTagName("svg")[0];

    // Extract the data as SVG text string
    var svg_xml = (new XMLSerializer).serializeToString(svg);
    var bars = d3.selectAll(".bar")
                .on("click",function(d,i){
                    if (numOfClickedBars >= 2) {
                      alert("Two components have been chosen, please reset");
                    }
                });
  });
}

function clickBar(){
  var bars = d3.selectAll(".bar")
              .on("click",function(d,i){
                  var clicked = this.getAttribute("clicked");
                  var id = this.getAttribute("id");

                  if (numOfClickedBars < 2) {
                    if (clicked === "false") {
                      d3.select(this)
                      .attr("clicked", "true")
                      .attr("fill", "red");
                      numOfClickedBars = numOfClickedBars + 1;
                      clickedBarId.push(id);
                    }
                    /*
                    if (numOfClickedBars === 2) {
                      choose_components();
                    }
                    */
                  }
                  if (numOfClickedBars === 2) {
                    choose_components();
                  }

              });
}
