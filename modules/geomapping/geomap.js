(function() {
  'use strict';

  // set up margins
  var el = d3.select('.geomap'),
      elWidth = parseInt(el.style('width'), 10),
      elHeight = parseInt(el.style('height'), 10),
      margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = elWidth - margin.left - margin.right,
      height = elHeight - margin.top - margin.bottom;

  // create svg element
  var svg = el.append("svg")
    .attr("width", elWidth)
    .attr("height", elHeight)
     .append("g")
       .attr('transform', 'translate(' + margin.left + "," + margin.top + ')');

  d3.json("/data/us-states.json", function(error, data) {
    visualize(data);
  });

  function visualize(data) {
		var projection = d3.geo.albersUsa()
		.translate([width/2, height/2])
		.scale([1200])
		
		var path = d3.geo.path()
			.projection(projection);
			
		var format = d3.format(',');
			
		var tip = d3.tip()
			.attr('class', 'd3-tip')
			.html(function(d){
				return d.place + ' - ' + format(d.views) + ' Views';
			})
		
		svg.call(tip);
			
		svg.selectAll('path')
			.data(data.features)
			.enter()
			.append('path')
			.attr('d', path)
			.attr('fill', '#6c789c')
			.attr('stroke', '#8893A4');
		
		//add cities
		d3.csv('/data/us-cities.csv', function(pointData){
			svg.selectAll('circle')

				.data(pointData)
				.enter()
				.append('circle')
				.attr('cx', function(d) {
					return projection([d.lon, d.lat])[0]
				})
				.attr('cy', function(d) {
					return projection([d.lon, d.lat])[1]
				})
				.attr('fill', '#59A2F0')
				.attr('r', '0')
				.on('mouseover', tip.show)
				.on('mousesout', tip.hide)
				.transition()
				.duration(500)
				.delay(function(d, i){
					return i * 100;
				})
				.attr('r', function(d){
					var value = parseInt(d.views);
					return Math.sqrt(value * 0.008)
				})
				.style('opacity', '0.75')
				
		})
		
		
  }

}());
