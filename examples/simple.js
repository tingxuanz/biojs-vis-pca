// if you don't specify a html file, the sniper will generate a div with id "rootDiv"
var app = require("biojs-vis-pca");

//colorBy contains different color options
var colorBy = {SampleType: ["0", "Day1", "Day2","Day3", "Day4", "Day5", "Day6", "Day7", "ESRP KD", "CTRL", "RBM47 KD"], ExperimentalSeries: ["PRJNA304414", "PRJNA304419", "PRJNA304418"]};

var colors = ["DarkOrchid", "Orange", "DodgerBlue", "Blue","BlueViolet","Brown", "Deeppink", "BurlyWood","CadetBlue",
"Chartreuse","Chocolate","Coral","CornflowerBlue","Crimson","Cyan", "Red", "DarkBlue"];

//set default values for color domain, xDomain, yDomain and colorOption
var colorDomain = colorBy.SampleType;
var xDomain = "PC1";
var yDomain = "PC2";
var colorOption = "SampleType";

var barChartData;
var metaDataForSampleId;

var numberOfComponents = 5;

var numOfClickedBars = 0;
var clickedBarId = [];

var body = document.getElementsByTagName("body")[0];

//Create array of color options to be added
var colorOptions = ["SampleType", "ExperimentalSeries"];

//Create and append select list for color options
var colorSelectList = document.createElement("select");
colorSelectList.id = "colorSelect";
colorSelectList.onchange = function(){if (typeof(this.selectedIndex) != 'undefined')
                                {
                                  color_by_option(this.selectedIndex);
                                }
};
body.appendChild(colorSelectList);

//Create and append the color options
for (var i = 0; i < colorOptions.length; i++) {
    var option = document.createElement("option");
    option.value = colorOptions[i];
    option.text = colorOptions[i];
    option.id = colorOptions[i];
    if (i === 0) {
      option.defaultSelected = true;
    }

    colorSelectList.appendChild(option);
}

var resetButton = document.createElement("button");
resetButton.innerHTML = "Reset";
resetButton.onclick = function(){
  numOfClickedBars = 0;

  choose_components();
  clickedBarId = [];
};
body.appendChild(resetButton);




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

d3.tsv("../data/PCA_transcript_expression_TMM_RPKM_log2_screetable_prcomp_variance.6932.tsv", function(error, data) {
    data.forEach(function(d) {
      d.eigenvalue = +d.eigenvalue;
    });
    barChartData = data;
});

d3.tsv("../data/6932_metadata.tsv", function(error, data) {
    metaDataForSampleId = data;
});


// render the default graph, use option1 as color domain
d3.tsv("../data/PCA_transcript_expression_TMM_RPKM_log2_sample_data.6932.tsv", function(error, data) {
      data.forEach(function(d) {
        d.PC1 = +d.PC1;
        d.PC2 = +d.PC2;
      });

      target = rootDiv;
      var options = {
        clickedBars: clickedBarId,
        numberOfComponents: numberOfComponents,  //used to determine how many components will be showed in the bar chart
        barChartData: barChartData,
        barChartHeight:900,
        barChartWidth: numberOfComponents * 30,
        colorOption: colorOption,
        xDomain: "PC1",
        yDomain: "PC2",
        circle_radius: 8,
        data: data,
        height: 500,
        width: 960,
        colorDomain: colorBy.SampleType, //this is the domain for color scale
        domain_colors: colors,
        margin: {
          top: 10,
          right: 20,
          bottom: 10,
          left: 40
        },
        target: target,
        tooltip: tooltip,
        x_axis_title: "Principal Component #1",
        y_axis_title: "Principal Component #2",
      };

      //merge each SampleID's metadata to its raw data
       for (var i = 0; i < data.length; i++) {
         jQuery.extend(options.data[i],metaDataForSampleId[i]);
       }

      var instance = new app(options);

      // Get the d3js SVG element
      var tmp = document.getElementById(rootDiv.id);
      var svg = tmp.getElementsByTagName("svg")[0];

      // Extract the data as SVG text string
      var svg_xml = (new XMLSerializer).serializeToString(svg);

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

                        if (numOfClickedBars === 2) {
                          choose_components();
                        }
                      } else {
                        alert("Two components are chosen, please reset")
                      }
                  });
});

//re-render the graph according to the color option
function color_by_option(index){
  var chosenOption = colorSelectList.options[index];

  if (chosenOption.selected === true) {
    if (chosenOption.id === "SampleType") {
      colorDomain = colorBy.SampleType;
      colorOption = "SampleType";
    }

    if (chosenOption.id === "ExperimentalSeries") {
      colorDomain = colorBy.ExperimentalSeries;
      colorOption = "ExperimentalSeries";
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
      colorOption: colorOption,
      xDomain: xDomain,
      yDomain: yDomain,
      circle_radius: 8,
      data: data,
      height: 500,
      width: 960,
      colorDomain: colorDomain, //this is the domain for color scale
      domain_colors: colors,
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
      jQuery.extend(options.data[i],metaDataForSampleId[i]);
    }

    var instance = new app(options);

    // Get the d3js SVG element
    var tmp = document.getElementById(rootDiv.id);
    var svg = tmp.getElementsByTagName("svg")[0];

    // Extract the data as SVG text string
    var svg_xml = (new XMLSerializer).serializeToString(svg);

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

                      if (numOfClickedBars === 2) {
                        choose_components();
                      }
                    } else {
                      alert("Two components are chosen, please reset")
                    }
                });

  });
}

function choose_components(){
   xDomain = clickedBarId[0];
   yDomain = clickedBarId[1];
  /*
  if (xChosenOption.selected === true) {
    xDomain = xChosenOption.id;
  }

  if (yChosenOption.selected === true) {
    yDomain = yChosenOption.id;
  }
  */
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
      colorOption: colorOption,
      xDomain: xDomain,
      yDomain: yDomain,
      circle_radius: 8,
      data: data,
      height: 500,
      width: 960,
      colorDomain: colorDomain, //this is the domain for color scale
      domain_colors: colors,
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
      jQuery.extend(options.data[i],metaDataForSampleId[i]);
    }


    var instance = new app(options);

    // Get the d3js SVG element
    var tmp = document.getElementById(rootDiv.id);
    var svg = tmp.getElementsByTagName("svg")[0];

    // Extract the data as SVG text string
    var svg_xml = (new XMLSerializer).serializeToString(svg);
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

                      if (numOfClickedBars === 2) {
                        choose_components();
                      }
                    } else {
                      alert("Two components are chosen, please reset")
                    }
                });
  });
}
