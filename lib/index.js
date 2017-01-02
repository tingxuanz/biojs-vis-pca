/*
 * biojs-vis-pca
 * https://github.com/tingxuanz/biojs-vis-pca
 *
 * Copyright (c) 2016 tingxuan zhang
 * Licensed under the Apache-2.0 license.
 */

/**
@class biojsvispca
 */

//a tutorial for drawing scatter plot with d3.js
//http://bl.ocks.org/mbostock/3887118
var  biojsvispca;
module.exports = biojsvispca = function(init_options){

  //define options as defaults
  default_options = function(){
    var options = {
        margin:{top: 20, right: 20, bottom: 30, left: 40},
        width: 960 - 40 - 20,
        height: 500 - 20 - 30
    }
    return options;
  };

//setup margins
  setup_margins = function(graph){
    options = graph.options;
    page_options.margin = options.margin;
    page_options.width = options.width - page_options.margin.left - page_options.margin.right;
    page_options.height = options.height - page_options.margin.top - page_options.margin.bottom;

    graph.page_options = page_options;
    return graph;
  };

  setup_x_axis = function(graph){
    var page_options = graph.page_options;
    var svg = graph.svg;
    var options = graph.options;
    //setup the scale for x axis, this is a linear scale
    var scaleX = d3.scale.linear()
        .range([0,page_options.width]);
    //setup domain
    scaleX.domain(d3.extent(options.data,
      function(d){
        var xDomain;
        xDomain = d[options.xDomain];
        return xDomain;
      })).nice();
    //setup xaxis
    var xAxis = d3.svg.axis()
        .scale(scaleX)
        .orient("bottom");

    //append as a group
    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + page_options.height +")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", page_options.width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(options.x_axis_title);
    graph.svg = svg;
    graph.scaleX = scaleX;
    return graph;
  };

  setup_y_axis = function(graph){
    var page_options = graph.page_options;
    var svg = graph.svg;
    var options = graph.options;
    //setup the scale for y axis, this is a linear scale
    var scaleY = d3.scale.linear()
        .range([page_options.height, 0]);
    //setup domain
    scaleY.domain(d3.extent(options.data,
      function(d){
        var yDomain;
        yDomain = d[options.yDomain];
        return yDomain;
      })).nice();
    //setup y axis
    var yAxis = d3.svg.axis()
        .scale(scaleY)
        .orient("left");

    //append as a group
    svg.append("g")
        .attr("class", "yAxis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(options.y_axis_title);
    graph.svg = svg;
    graph.scaleY = scaleY;
    graph.yAxis = yAxis;
    return graph;
  };
  /**
   * Sets up the actual scatter points on the graph, assigns colours based on
   * types also has a tooltip (see simple.js for tooltip setup)
   * with relevent info aobut each point
   * @param {type} graph
   * @returns {unresolved}
   */

  setup_scatter = function(graph){
    svg = graph.svg;
    options = graph.options;
    page_options = graph.page_options;

    tooltip = options.tooltip;
    svg.call(tooltip);


    if(options.colorDomain != undefined){
      page_options.colorDomain = options.colorDomain;
      page_options.color = d3.scale.ordinal().domain(page_options.colorDomain).range(options.domain_colors);
    } else {
      page_options.color = d3.scale.category10();
    }

    //var colorDomain = page_options.colorDomain;
    var color = page_options.color;

    svg.selectAll(".dot")
        .data(options.data)
      .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", options.circle_radius)
        .attr("cx", function(d){
          var xDomain;
          xDomain = d[options.xDomain];
          return graph.scaleX(xDomain);})
        .attr("cy", function(d){
          var yDomain;
          yDomain = d[options.yDomain];
          return graph.scaleY(yDomain);})
        .style("fill", function(d) {
          var colorOption;
          colorOption = d[options.colorOption];
          return color(colorOption);})
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide);
    graph.svg = svg;
    return graph;
  };

  setup_legend = function(graph){
      var svg = graph.svg;
      var page_options = graph.page_options;
      var color = page_options.color;
      var width = page_options.width

      var legend = svg.selectAll(".legend")
          .data(color.domain())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0,"+ i * 20 +")"; });

      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });

      graph.svg = svg;
      return graph;
  };

  setup_svg = function(graph){
    var options = graph.options;
    var page_options = graph.page_options;

    var left = page_options.margin.left,
        right = page_options.margin.right,
        top = page_options.margin.top,
        bottom = page_options.margin.bottom;

    var full_width = options.width;
    var full_height = options.height;
    // clear out html
    $(options.target)
            .html('')
            .css("width", full_width + "px" )
            .css("height", full_height + "px")

    // setup the SVG. We do this inside the d3.tsv as we want to keep everything in the same place
    // and inside the d3.tsv we get the data ready to go (called options.data here)
    var svg = d3.select(options.target).append("svg")
        .attr("width", full_width)
        .attr("height",full_height)
      .append("g")
        // this is just to move the picture down to the right margin length
        .attr("transform", "translate(" + left + "," + top + ")");

    graph.svg = svg;
    return graph;
  };

  setup_graph = function(graph){
    //setup all the graph elements
    graph = setup_margins(graph);
    graph = setup_svg(graph);
    graph = setup_x_axis(graph);
    graph = setup_y_axis(graph);
    graph = setup_scatter(graph);
    graph = setup_legend(graph);

    return graph
  };

  init = function(init_options){
      var options = default_options();
      options = init_options;
      page_options = {}; // was new Object() but jshint wanted me to change this
      var graph = {}; // this is a new object
      graph.options = options;
      graph = setup_graph(graph);
      var target = $(options.target);
      target.addClass('scatter_plot');
      svg = graph.svg;
  } ;
  // constructor to run right at the start
  init(init_options);
};

/**
 * Private Methods
 */

/*
 * Public Methods
 */
