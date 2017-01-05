// if you don't specify a html file, the sniper will generate a div with id "rootDiv"
var app = require("biojs-vis-pca");

//metaData contains different options
var metaData = {"option1": ["a", "b"], "option2": ["a", "b", "c"], "option3": ["x", "y", "z"]};

//set default values for color domain, xDomain, yDomain and colorOption
var colorDomain = metaData.option1;
var xDomain = "PC1";
var yDomain = "PC2";
var colorOption = "option1";


var barChartData = [];
var scatterPlotData = [];
var numberOfComponents = 5;

var numOfClickedBars = 0;
var clickedBarId = [];

var body = document.getElementsByTagName("body")[0];

//Create array of color options to be added
var colorOptions = ["option1", "option2", "option3"];

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



/*
//create array of components options
var componentOptions = ["PC1","PC2","PC3","PC4","PC5","PC6","PC7","PC8","PC9","PC10","PC11","PC12","PC13","PC13","PC15","PC16","PC17","PC18",
                        "PC19","PC20","PC21","PC22","PC23","PC24","PC25","PC26","PC27","PC28","PC29","PC30","PC31","PC32","PC33","PC34","PC35","PC36",];

//Need 2 select lists, one for x axis, one for y axis
//Create and append select list for x axis component options
var xComponentSelectList = document.createElement("select");
xComponentSelectList.id = "xComponentSelect";
xComponentSelectList.onchange = function(){
  if (typeof(this.selectedIndex) != 'undefined')
    {
      choose_components(this.selectedIndex, yComponentSelectList.selectedIndex);
    }
};
body.appendChild(xComponentSelectList);
for (var i = 0; i < componentOptions.length; i++) {
    var option = document.createElement("option");
    option.value = componentOptions[i];
    option.text = componentOptions[i];
    option.id = componentOptions[i];
    if (i === 0) {
      option.defaultSelected = true;
    }

    xComponentSelectList.appendChild(option);
}

//Create and append select list for y axis component options
var yComponentSelectList = document.createElement("select");
yComponentSelectList.id = "yComponentSelect";
yComponentSelectList.onchange = function(){
  if (typeof(this.selectedIndex) != 'undefined')
    {
      choose_components(xComponentSelectList.selectedIndex, this.selectedIndex);
    }
};
body.appendChild(yComponentSelectList);
for (var i = 0; i < componentOptions.length; i++) {
    var option = document.createElement("option");
    option.value = componentOptions[i];
    option.text = componentOptions[i];
    option.id = componentOptions[i];
    if (i === 1) {
      option.defaultSelected = true;
    }

    yComponentSelectList.appendChild(option);
}
*/




var tooltip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0, +110])
    .html(function(d){
        gene = d.gene;
        component1 = d[xDomain];
        component2 = d[yDomain];
        temp = "gene: " + gene + "<br/>" +
               component1 + ", " + component2
        return temp;
    });

  d3.tsv("../data/PCA_transcript_expression_TMM_RPKM_log2_screetable_prcomp_variance.6932.tsv", function(error, data) {

          data.forEach(function(d) {
                //d.prcomp = +d.prcomp;
              d.eigenvalue = +d.eigenvalue;
          });

          barChartData = data;
  });

d3.tsv("../data/PCA_transcript_expression_TMM_RPKM_log2_sample_data.6932.tsv", function(error, data){
  data.forEach(function(d) {
    d.PC1 = +d.PC1;
    d.PC2 = +d.PC2;
    d.PC3 = +d.PC3;
    d.PC4 = +d.PC4;
    d.PC5 = +d.PC5;
    d.PC6 = +d.PC6;
    d.PC7 = +d.PC7;
    d.PC8 = +d.PC8;
    d.PC9 = +d.PC9;
    d.PC10 = +d.PC10;
    d.PC11 = +d.PC11;
    d.PC12 = +d.PC12;
    d.PC13 = +d.PC13;
    d.PC14 = +d.PC14;
    d.PC15 = +d.PC15;
    d.PC16 = +d.PC16;
    d.PC17 = +d.PC17;
    d.PC18 = +d.PC18;
    d.PC19 = +d.PC19;
    d.PC20 = +d.PC20;
    d.PC21 = +d.PC21;
    d.PC22 = +d.PC22;
    d.PC23 = +d.PC23;
    d.PC24 = +d.PC24;
    d.PC25 = +d.PC25;
    d.PC26 = +d.PC26;
    d.PC27 = +d.PC27;
    d.PC28 = +d.PC28;
    d.PC29 = +d.PC29;
    d.PC30 = +d.PC30;
    d.PC31 = +d.PC31;
    d.PC32 = +d.PC32;
    d.PC33 = +d.PC33;
    d.PC34 = +d.PC34;
    d.PC35 = +d.PC35;
    d.PC36 = +d.PC36;
  });
  scatterPlotData = data;
});

var target = rootDiv;
var options = {
  clickedBars: clickedBarId,
  numberOfComponents: numberOfComponents,  //used to determine how many components will be showed in the bar chart
  //barChartData: barChartData,
  barChartHeight:900,
  barChartWidth: numberOfComponents * 30,
  colorOption: colorOption,
  xDomain: "PC1",
  yDomain: "PC2",
  metaData: metaData,
  circle_radius: 8,
  //data: scatterPlotData,
  height: 500,
  width: 960,
  colorDomain: metaData.option1, //this is the domain for color scale
  domain_colors: ["blue", "red", "green"],
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
options.barChartData = barChartData;
options.data = scatterPlotData;

var instance = new app(options);

// Get the d3js SVG element
var tmp = document.getElementById(rootDiv.id);
var svg = tmp.getElementsByTagName("svg")[0];

// Extract the data as SVG text string
var svg_xml = (new XMLSerializer).serializeToString(svg);

/*
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
        metaData: metaData,
        circle_radius: 8,
        data: data,
        height: 500,
        width: 960,
        colorDomain: metaData.option1, //this is the domain for color scale
        domain_colors: ["blue", "red", "green"],
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
                          console.log(numOfClickedBars);
                          console.log(clickedBarId);
                        }

                        if (numOfClickedBars === 2) {
                          choose_components();
                        }
                      } else {
                        alert("Two components are chosen, please reset")
                      }
                  });
       var resetButton = document.createElement("button");
       resetButton.innerHTML = "reset";
       resetButton.onclick = function() {
         numOfClickedBars = 0;
         clickedBarId = [];
         var bars = d3.selectAll(".bar")
                     .attr("clicked", "false")
                     .attr("fill", "steelblue")
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
                             console.log(numOfClickedBars);
                             console.log(clickedBarId);
                           }

                           if (numOfClickedBars === 2) {
                             choose_components();
                           }
                         } else {
                           alert("Two components are chosen, please reset")
                         }
                     });
       };
       body.appendChild(resetButton);

});
*/


//re-render the graph according to the color option
function color_by_option(index){
  var chosenOption = colorSelectList.options[index];

  if (chosenOption.selected === true) {
    if (chosenOption.id === "option1") {
      colorDomain = metaData.option1;
      colorOption = "option1";
    } else {
      if (chosenOption.id === "option2") {
        colorDomain = metaData.option2;
        colorOption = "option2";
      } else {
        if (chosenOption.id === "option3") {
          colorDomain = metaData.option3;
          colorOption = "option3";
        }
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
      colorOption: colorOption,
      xDomain: xDomain,
      yDomain: yDomain,
      metaData: metaData,
      circle_radius: 8,
      data: data,
      height: 500,
      width: 960,
      colorDomain: colorDomain, //this is the domain for color scale
      domain_colors: ["blue", "red", "green"],
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


    var instance = new app(options);

    // Get the d3js SVG element
    var tmp = document.getElementById(rootDiv.id);
    var svg = tmp.getElementsByTagName("svg")[0];

    // Extract the data as SVG text string
    var svg_xml = (new XMLSerializer).serializeToString(svg);


  });
}

function choose_components(){
  var xDomain = clickedBarId[0];
  var yDomain = clickedBarId[1];
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
      metaData: metaData,
      circle_radius: 8,
      data: data,
      height: 500,
      width: 960,
      colorDomain: colorDomain, //this is the domain for color scale
      domain_colors: ["blue", "red", "green"],
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


    var instance = new app(options);

    // Get the d3js SVG element
    var tmp = document.getElementById(rootDiv.id);
    var svg = tmp.getElementsByTagName("svg")[0];

    // Extract the data as SVG text string
    var svg_xml = (new XMLSerializer).serializeToString(svg);
  });
}
