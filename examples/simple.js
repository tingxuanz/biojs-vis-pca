// if you don't specify a html file, the sniper will generate a div with id "rootDiv"
var app = require("biojs-vis-pca");

//metaData contains different options
var metaData = {"option1": ["Republican", "Democrat"], "option2": ["a", "b", "c"], "option3": ["x", "y", "z"]};

//set default values for color domain, xDomain, yDomain and colorOption
var colorDomain = metaData.option1;
var xDomain = "component1";
var yDomain = "component2";
var colorOption = "option1";

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

//create array of components options
var componentOptions = ["component1", "component2"];

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





var tooltip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0, +110])
    .html(function(d){
        state = d.state;
        component1 = d.component1;
        component2 = d.component2;
        temp = "state: " + state + "<br/>" +
               component1 + ", " + component2
        return temp;
    });

// render the default graph, use option1 as domain
d3.tsv("../data/demo.tsv", function(error, data) {
      data.forEach(function(d) {
        d.component1 = +d.component1;
        d.component2 = +d.component2;
      });

      target = rootDiv;
      var options = {
        colorOption: colorOption,
        xDomain: "component1",
        yDomain: "component2",
        metaData: metaData,
        circle_radius: 8,
        data: data,
        height: 600,
        width: 960,
        colorDomain: metaData.option1, //this is the domain for color scale
        domain_colors: ["blue", "red", "green"],
        margin: {
          top: 80,
          right: 20,
          bottom: 30,
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
});

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
  d3.tsv("../data/demo.tsv", function(error, data) {
    data.forEach(function(d) {
      d.component1 = +d.component1;
      d.component2 = +d.component2;
    });

    target = rootDiv;
    var options = {
      colorOption: colorOption,
      xDomain: xDomain,
      yDomain: yDomain,
      metaData: metaData,
      circle_radius: 8,
      data: data,
      height: 600,
      width: 960,
      colorDomain: colorDomain, //this is the domain for color scale
      domain_colors: ["blue", "red", "green"],
      margin: {
        top: 80,
        right: 20,
        bottom: 30,
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

function choose_components(xIndex, yIndex){
  var xChosenOption = xComponentSelectList.options[xIndex];
  var yChosenOption = yComponentSelectList.options[yIndex];

  if (xChosenOption.selected === true) {
    if (xChosenOption.id === "component1") {
      xDomain = "component1";
    } else {
      if (xChosenOption.id === "component2") {
        xDomain = "component2";
      }
    }
  }

  if (yChosenOption.selected === true) {
    if (yChosenOption.id === "component1") {
      yDomain = "component1";
    } else {
      if (yChosenOption.id === "component2") {
        yDomain = "component2";
      }
    }
  }
  // each time the option is changed, we need to read the file and redener the svg again.
  d3.tsv("../data/demo.tsv", function(error, data) {
    data.forEach(function(d) {
      d.component1 = +d.component1;
      d.component2 = +d.component2;
    });

    target = rootDiv;
    var options = {
      colorOption: colorOption,
      xDomain: xDomain,
      yDomain: yDomain,
      metaData: metaData,
      circle_radius: 8,
      data: data,
      height: 600,
      width: 960,
      colorDomain: colorDomain, //this is the domain for color scale
      domain_colors: ["blue", "red", "green"],
      margin: {
        top: 80,
        right: 20,
        bottom: 30,
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
