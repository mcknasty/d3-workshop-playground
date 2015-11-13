(function() {
  'use strict';

  // set up margins
  var el = d3.select('.pie'),
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
      .attr("transform", "translate(" + elWidth/2 + "," + elHeight/2 + ")");

  d3.json("/data/browser.json", function(error, data) {
    data.forEach(function(d) {
      d.value = +d.value;
    });
    visualize(data);
  });

  function visualize(data) {
    // let's eat some pie
		
		var radius = Math.min(width, height) / 2
		
		var pie = d3.layout.pie()
			.value(function(d){
				return d.value;
			})
		
		//arc function
		var arc = d3.svg.arc()
			.innerRadius(radius * 0.6)
			.outerRadius(radius)
			
		function arcTween(a) {
			var i = d3.interpolate(this._current, a)
			this._current - i(0);
			return function (t) {
				return arc(i(t));
			}
		}
		
		// set up arcs
			/**
		var arcs = svg.selectAll('.arc')
			.data(pie(data))
			.enter()
			.append('g')
			.attr('class', 'arc')

			.on('mouseover', function (d, i) {
				var ele = d3.select(this)
				ele
					.attr('transform', 'scale(1.4)')
			})
			.on('mouseleave', function (d, i) {
				var ele = d3.select(this)
				ele
					.attr('transform', 'scale(1)')
			})
			**/
		
		var color = d3.scale.category20c();
		
		var arcs = svg.selectAll('.arc')
			.data(pie(data))	
		
		arcs.enter()
			.append('path')
				.attr('class', 'arc')
				.attr('fill', function(d, i){
					return color(i);
				})
				.each(function(d) {
					this._current = {
						startAngle: 0,
						endAngle: 0
					}
				});
				
		arcs.transition()
				.duration(2000)
				.attrTween('d', arcTween)
				.each('end', function(d) {
					var translate = arc.centroid(d);
					svg.append('text')
						.attr('text-anchor', 'middle')
						.text(function(){
							return d.data.browser + '-' + d.data.value
						})
						.attr('transform', 'translate(' + translate + ')')
				})
		
		/**
		arcs
			.append('path')
			.attr('d', arc)
			.attr('fill', function (d, i) {
				return color(i);
			})
		**/
		
		//append tooltip
		arcs.append('text')
			.text(function(d) {
				return d.data.browser + '-' + d.data.value
			})
			.attr('text-anchor', 'middle')
			.attr('transform', function(d) {
				return 'translate(' + arc.centroid(d) + ')';
			})
  }

}());
