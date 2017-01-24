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
        marginForPCA:{top: 20, right: 20, bottom: 30, left: 40},
        width: 960 - 40 - 20,
        height: 500 - 20 - 30
    }
    return options;
  };

//setup margins
  setup_margins = function(graph){
    options = graph.options;
    page_options.marginForPCA = options.marginForPCA;
    page_options.marginForBar = options.marginForBar;

    page_options.width = options.width - page_options.marginForPCA.left - page_options.marginForPCA.right;
    page_options.height = options.height - page_options.marginForPCA.top - page_options.marginForPCA.bottom;

    page_options.barChartWidth = options.barChartWidth - page_options.marginForBar.left - page_options.marginForBar.right;
    page_options.barChartHeight = options.barChartHeight - page_options.marginForBar.top - page_options.marginForBar.bottom;

    page_options.fullWidth = options.fullWidth;
    page_options.fullHeight = options.fullHeight;

    graph.page_options = page_options;
    return graph;
  };

  setup_x_axis = function(graph){
    var page_options = graph.page_options;
    var svg = graph.svgForPCA;
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
        .attr("class", "xAxis axis")
        .attr("transform", "translate(0," + page_options.height +")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", page_options.width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(options.x_axis_title);
    graph.svgForPCA = svg;
    graph.scaleX = scaleX;
    return graph;
  };

  setup_y_axis = function(graph){
    var page_options = graph.page_options;
    var svg = graph.svgForPCA;
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
        .attr("class", "yAxis axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(options.y_axis_title);
    graph.svgForPCA = svg;
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
    svg = graph.svgForPCA;
    options = graph.options;
    page_options = graph.page_options;

    tooltip = options.tooltip;
    svg.call(tooltip);

    if(options.colorDomain != undefined){
      page_options.colorDomain = options.colorDomain;
      page_options.color = d3.scale.ordinal().domain(page_options.colorDomain).range(options.domain_colors);
    } else {
      page_options.color = d3.scale.category20();
    }

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
          var groupByoption;
          groupByoption = d[options.groupByoption];
          return color(groupByoption);})
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide);

    graph.svgForPCA = svg;
    return graph;

  };

//re-color all points based on the groupByoption
change_scatter_color = function(graph){
  svg = graph.svgForPCA;
  options = graph.options;

  var color = d3.scale.category20();
  svg.selectAll(".dot")
    .style("fill", function(d) {
      var groupByoption;
      groupByoption = d[options.groupByoption];
      return color(groupByoption);
    })
  graph.page_options.color = color;
  graph.svgForPCA = svg;
  return graph;
};

setup_zoom = function(graph){
  var svg = graph.svgForPCA;
  var options = graph.options;
  var page_options = graph.page_options;

  var zoom = d3.behavior.zoom()
      .x(graph.scaleX)
      .y(graph.scaleY)
      .on("zoom", function(){
        var x = d3.svg.axis()
             .scale(graph.scaleX)
             .orient("bottom");
        var y = d3.svg.axis()
             .scale(graph.scaleY)
             .orient("left");
        svg.select(".xAxis").call(x);
        svg.select(".yAxis").call(y);
        svg.selectAll(".dot")
          .attr("cx", function(d){
            var xDomain;
            xDomain = d[options.xDomain];
            return graph.scaleX(xDomain);})
          .attr("cy", function(d){
            var yDomain;
            yDomain = d[options.yDomain];
            return graph.scaleY(yDomain);});
      });


  svg.append("rect")
    .attr("width", page_options.width)
    .attr("height", page_options.height)
    .attr("class", "zoom")
    .style("fill", "none")
    .style("pointer-events", "fill")
    .style("visibility", "hidden")
    .call(zoom);


  graph.svgForPCA = svg;
  return graph;
};

/*
  Delete existing zoom behavior at brushstart and setup a new one at brushend.
  This can keep the scale and points' position in consistency.
*/
setup_brush = function(graph){
  var svg = graph.svgForPCA;
  var options = graph.options;
  var page_options = graph.page_options;
  var color = page_options.color;
  var durationTime = 500; //duration time of the transition

  tooltip = options.tooltip;
  svg.call(tooltip);

  var brush = d3.svg.brush()
       .x(graph.scaleX)
       .y(graph.scaleY)
       .on("brushstart", function() { //delete the existing zoom behavior at brushstart
         d3.selectAll(".zoom").remove();
       })
       .on("brushend", function() {
         var x = graph.scaleX;
         var y = graph.scaleY;

         /*
            brush.extent() returns the current brush extent.
            The extent is a two-demensional array [[x0, y0], [x1,y1]],
            where x0 and y0 are the lower bounds of the extent, and x1 and y1 are the upper bounds of the extent.

            Check https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Controls.md#brush_extent
            or details about brush.extent().
         */
         var extent = brush.extent();

         /* the set of x.domain and y.domain aims to acheieve the zoom after brush*/

         // set the domain of x axis scale to current lower and upper bounds of brush extent along x axis.
         x.domain([extent[0][0], extent[1][0]]);
         // set the domain of y axis scale to current lower and upper bounds of brush extent along y axis.
         y.domain([extent[0][1], extent[1][1]]);

         var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");
         var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left");

         // Setup a new zoom behavior so that we can zoom and pan the plot after brush finish.
         setup_zoom(graph);

         /*
         if you append your zoom/brush after your data points, the zoom/brush overlay will catch all of the pointer events,
         and your tooltips will disappear on hover.
         You want to append the zoom/brush before your data points, so that pointer events on the data generate a tooltip,
         and those on the overlay generate a zoom/brush.
         */
         /* Remove and append all dots again, so that all dots are appended after the zoom.
            Thus the tooltip can work correctly.
         */
         svg.selectAll(".dot").remove();
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
               var groupByoption;
               groupByoption = d[options.groupByoption];
               return color(groupByoption);})
             .on('mouseover', tooltip.show)
             .on('mouseout', tooltip.hide);

            svg.select(".xAxis")
              .call(xAxis);

            svg.select(".yAxis")
              .call(yAxis);

            d3.event.target.clear();
            d3.select(this).call(d3.event.target);

            // Delete the brush so that we can switch to zoom automatically.
            d3.selectAll(".brush").remove();
       });

  svg.append("g")
    .attr("class", "brush")
    .call(brush);

  graph.svgForPCA = svg;
  return graph;
};





  setup_legend = function(graph){
      var svg = graph.svgForPCA;
      var page_options = graph.page_options;
      var color = page_options.color;
      var width = page_options.width

      var legend = svg.selectAll(".legend")
          .data(color.domain())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0,"+ i * 20 +")"; });

      legend.append("rect")
          .attr("x", width + 20)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", width + 14)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });

      graph.svgForPCA = svg;
      return graph;
  };

  setup_x_axis_for_bar_chart = function(graph){
    var page_options = graph.page_options;
    var svg = graph.svgForBar;
    var options = graph.options;
    var data = [];
    //only store the top components, number of components is decided by options.numberOfComponents
    for (var i = 0; i < options.numberOfComponents; i++) {
      data[i] = options.barChartData[i];
    }
    //setup the scale for x axis, this is a linear scale
    var barChartScaleX = d3.scale.ordinal()
        .rangeRoundBands([0,page_options.barChartWidth], .1);
    //setup domain
    barChartScaleX.domain(data.map(function(d) {return d.prcomp}));
    //setup xaxis
    var xAxis = d3.svg.axis()
        .scale(barChartScaleX)
        .orient("bottom");

    //append as a group
    svg.append("g")
        .attr("class", "barChartXAxis axis")
        .attr("transform", "translate(0," + page_options.barChartHeight +")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", page_options.barChartWidth)
        .attr("y", -6)
        .style("text-anchor", "end")
        //.text(options.x_axis_title);
    graph.svgForBar = svg;
    graph.barChartScaleX = barChartScaleX;
    return graph;
  };

  setup_y_axis_for_bar_chart = function(graph){
    var page_options = graph.page_options;
    var svg = graph.svgForBar;
    var options = graph.options;
    var data = [];

    //only store the top components, number of components is decided by options.numberOfComponents
    for (var i = 0; i < options.numberOfComponents; i++) {
      data[i] = options.barChartData[i];
    }
    //setup the scale for y axis, this is a linear scale
    var barChartScaleY = d3.scale.linear()
        .range([page_options.barChartHeight,0]);
    //setup domain
    barChartScaleY.domain([0, d3.max(data, function(d) { return d.eigenvalue;})]);
    //setup y axis
    var yAxis = d3.svg.axis()
        .scale(barChartScaleY)
        .orient("left");

    //append as a group
    svg.append("g")
        .attr("class", "barChartYAxis axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        //.text(options.y_axis_title);
    graph.svgForBar = svg;
    graph.barChartScaleY = barChartScaleY;
    graph.barChartYAxis = yAxis;
    return graph;
  };

  setup_bar = function(graph){
    var page_options = graph.page_options;
    var svg = graph.svgForBar;
    var options = graph.options;
    var data = [];
    //only store the top components, number of components is decided by options.numberOfComponents
    for (var i = 0; i < options.numberOfComponents; i++) {
      data[i] = options.barChartData[i];
    }

    svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("clicked", "false")
      .attr("id", function(d) {return d.prcomp;})
      .attr("x", function(d) {return graph.barChartScaleX(d.prcomp); })
      .attr("y", function(d) {return graph.barChartScaleY(d.eigenvalue); })
      .attr("height", function(d) {return page_options.barChartHeight - graph.barChartScaleY(d.eigenvalue); })
      .attr("width", graph.barChartScaleX.rangeBand())
      .attr("fill", function(d) {
        var color;
        // if a bar is clicked, fill it with red
        if ((d.prcomp === options.clickedBars[0]) || (d.prcomp === options.clickedBars[1])) {
          color = "red";
        } else {
          color = "steelblue";
        }
        return color;
      });
    graph.svgForBar = svg;
    return graph;
  };

// update PCA according to the bars that user clicks.
  update_PCA = function(graph){
    var svg = graph.svgForPCA;
    var page_options = graph.page_options;
    var options = graph.options;

    options.xDomain = options.clickedBars[0];
    options.yDomain = options.clickedBars[1];
    options.x_axis_title = options.clickedBars[0];
    options.y_axis_title = options.clickedBars[1];

    //remove these elements first, or the new elements will overlap with old ones
    d3.select(".xAxis").remove();
    d3.select(".yAxis").remove();
    d3.selectAll(".zoom").remove();
    d3.selectAll(".dot").remove();

    graph = setup_x_axis(graph);
    graph = setup_y_axis(graph);
    graph = setup_zoom(graph);
    graph = setup_scatter(graph);

    graph.svgForPCA = svg;
    return graph;

  };

  setup_svg = function(graph){
    var options = graph.options;
    var page_options = graph.page_options;

    var marginForPCA = page_options.marginForPCA;
    var marginForBar = page_options.marginForBar;

    var scatterWidth = options.width;
    var scatterHeight = options.height;
    var full_width = page_options.fullWidth;
    var full_height = page_options.fullHeight;
    // clear out html
    $(options.target)
            .html('')
            .css("width", full_width + "px" )
            .css("height", full_height + "px")

    // setup the SVG. We do this inside the d3.tsv as we want to keep everything in the same place
    // and inside the d3.tsv we get the data ready to go (called options.data here)
    var svgForPCA = d3.select(options.target).append("svg")
        .attr("width", scatterWidth)
        .attr("height",scatterHeight)
      .append("g")
        // this is just to move the picture down to the right margin length
        .attr("transform", "translate(" + (marginForPCA.left) + "," + (marginForPCA.top) + ")");

    /*
    The zoom function works in the whole svg area.
    If we put 2 plots in one svg element, we will find that the circles in the scatter plot can reach the bar chart area when zooming in.
    So, we use one svg for scatter plot, one svg for bar chart to make sure that the zoom function only works in the scatter plot.
    */
    var svgForBar = d3.select(options.target).append("svg")
        .attr("width", full_width - scatterWidth)
        .attr("height",options.barChartHeight)
      .append("g")
        // this is just to move the picture down to the right margin length
        .attr("transform", "translate(" + (marginForBar.left) + "," + (marginForBar.top) + ")");

    graph.svgForPCA = svgForPCA;
    graph.svgForBar = svgForBar;
    return graph;
  };



  setup_graph = function(graph){
    //setup all the graph elements
    graph = setup_margins(graph);
    graph = setup_svg(graph);
    graph = setup_x_axis(graph);
    graph = setup_y_axis(graph);

    var svg = graph.svgForPCA;
    var page_options = graph.page_options;
    var positonY = 0;
    var positonXForBrush = page_options.width - 80;
    var options = graph.options;

    /*
      if you append your zoom/brush after your data points, the zoom/brush overlay will catch all of the pointer events,
      and your tooltips will disappear on hover.
      You want to append the zoom/brush before your data points, so that pointer events on the data generate a tooltip,
      and those on the overlay generate a zoom/brush.
    */
    graph = setup_zoom(graph);
    graph = setup_scatter(graph);

    graph = setup_legend(graph);
    graph = setup_x_axis_for_bar_chart(graph);
    graph = setup_y_axis_for_bar_chart(graph);
    graph = setup_bar(graph);

    d3.select(".brushButton")
      .on("click", function(){
        graph = setup_brush(graph);
      });

    d3.select("#colorSelect")
      .on("change", function(){
        // update the groupByoption
        var groupBySelectList = document.getElementById("colorSelect");
        for (var i = 0; i < groupBySelectList.childNodes.length; i++) {
          if (groupBySelectList.childNodes[i].checked === true) {
            options.groupByoption = groupBySelectList.childNodes[i].id;
          }
        }

        //change the color of scatter points
        graph = change_scatter_color(graph);

        // the legend needs to be updated
        svg.selectAll(".legend").remove();
        graph = setup_legend(graph);
      });

    d3.selectAll(".bar")
                  .on("click",function(){
                      var clicked = this.getAttribute("clicked");
                      var id = this.getAttribute("id");

                      if (options.numOfClickedBars < 2) {
                        if (clicked === "false") {
                          d3.select(this)
                          .attr("clicked", "true")
                          .attr("fill", "red");
                          options.numOfClickedBars = options.numOfClickedBars + 1;
                          options.clickedBars.push(id);
                        }

                        if(options.numOfClickedBars === 2){
                          graph = update_PCA(graph);
                        }
                      }
                  });
    graph.svgForPCA = svg;
    return graph;
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
      svgForPCA = graph.svgForPCA;
      svgForBar = graph.svgForBar;
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
