(function() {
  'use strict';
  var el = d3.select('.timeseries'),
      elWidth = parseInt(el.style('width'), 10),
      elHeight = parseInt(el.style('height'), 10),
      margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = elWidth - margin.left - margin.right,
      height = elHeight - margin.top - margin.bottom;

  var svg = el.append("svg")
      .attr("width", elWidth)
      .attr("height", elHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("/data/timeseries.json", function(error, data) {
    if (error) throw error;
    visualize(data);
  });

  function visualize(data) {
    // code here
		
		// scales
		var x = d3.time.scale()
			.domain(d3.extent(data, function(d){
				return d.date;
			}))
			.range([0, width]);
		
		var y = d3.scale.linear().domain(d3.extent(data, function(d){
			return d.value;
		})).range([height, 0]);
		
		var xAxis = d3.svg.axis()
			.scale(x)
			.ticks(d3.time.day, 3)
			.tickFormat(d3.time.format('%m/%d'));
		
		var yAxis = d3.svg.axis()
			.orient('left')
			.innerTickSize(-width)
			.scale(y);
		
		svg.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(' + [0, height] + ')')
			.call(xAxis);
			
		svg.append('g')
			.attr('class', 'axis')
			.call(yAxis);
		
		var line = d3.svg.line()
			.x(function(d){ 
				return x(d.date)
			})
			.y(function(d){
				return y(d.value)
			})
			.interpolate('monotone');
			
		var path = svg.append('path')
			.datum(data)
			.attr('d', line)
			.attr('class', 'line');
		
		var totalLength = path.node().getTotalLength();
		
		path
			.attr('stroke-dasharray', totalLength + " " + totalLength)
			.attr('stroke-dashoffset', totalLength)
			.transition()
			.duration(2000)
			.attr('stroke-dashoffset', 0);
			
			// let's overlay some data points
			
			svg.selectAll('cicle')
				.data(data)
				.enter()
				.append('circle')
				.attr('cx', function(d,i){
					return x(d.date)
				})
				.attr('cy', function(d,i) {
					return y(d.value)
				})
				.attr('r', 3)
				.attr('fill', 'white')
				.style('opacity', 0)
				.transition()
				.delay(2000)
				.style('opacity', 1)
  }
}());
