// if you don't specify a html file, the sniper will generate a div with id "rootDiv"
var app = require("biojs-vis-pca");

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

d3.tsv("../data/usarrests.tsv", function(error, data) {
  data.forEach(function(d) {
    d.component1 = +d.component1;
    d.component2 = +d.component2;
  });

  target = rootDiv;
  var options = {
    circle_radius: 3.5,
    data: data,
    height: 600,
    width: 960,
    domain: ['Republican', 'Democrat'],
    domain_colors: ["blue", "red"],
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
