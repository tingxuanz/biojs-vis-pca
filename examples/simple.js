// if you don't specify a html file, the sniper will generate a div with id "rootDiv"
var app = require("biojs-vis-pca");
/*
var button = document.createElement("button");
button.innerHTML = "Do Something";
// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);
*/
var metaData = {"option1": ["Republican", "Democrat"], "option2": ["a", "b", "c"], "option3": ["x", "y", "z"]};
var body = document.getElementsByTagName("body")[0];

//Create array of options to be added
var array = ["option1", "option2", "option3"];

//Create and append select list
var selectList = document.createElement("select");
selectList.id = "mySelect";
selectList.onclick = function(){if (typeof(this.selectedIndex) != 'undefined')
                                {
                                  color_by_option(this.selectedIndex);
                                }
};
body.appendChild(selectList);

//Create and append the options
for (var i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    option.id = array[i];
    if (i === 0) {
      option.defaultSelected = true;
    }

    selectList.appendChild(option);
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

d3.tsv("../data/demo.tsv", function(error, data) {
      data.forEach(function(d) {
        d.component1 = +d.component1;
        d.component2 = +d.component2;
      });

      target = rootDiv;
      var options = {
        metaData: metaData,
        circle_radius: 8,
        data: data,
        height: 600,
        width: 960,
        domain: metaData.option1,
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

function color_by_option(index){
  var chosenOption = selectList.options[index];
  var domain;
  if (chosenOption.selected === true) {
    if (chosenOption.id === "option1") {
      domain = metaData.option1;
    } else {
      if (chosenOption.id === "option2") {
        domain = metaData.option2;
      } else {
        if (chosenOption.id === "option3") {
          domain = metaData.option3;
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
      metaData: metaData,
      circle_radius: 8,
      data: data,
      height: 600,
      width: 960,
      domain: domain,
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
}
