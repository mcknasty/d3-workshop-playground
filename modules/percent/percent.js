(function() {
  'use strict';
	
  function progressSpinner() {
		var elem = $('.spinner').eq(0);
    var controller = function ($scope) {
        $scope.log = function (variable) {
            console.log(variable);
        };
        $scope.$watch('percent', function (newVal) {
            _this.transition($scope.percent);
        });
    };
    var link = function (height, width, percent) {
			
			var tempPercent = 0,
      _this = this,
			interval;
			elem.css({ height, width });
			this.pi = Math.PI;
			this.height = height;
			this.width = percent;
      this.setUpSVG(height, width);
      this.setRadius();
      this.addText();
			this.drawCircles(0);
			this.transition(percent);
			var time = 750 / percent * 0.01;
			console.log(time);
			interval = window.setInterval(function(){
				if(tempPercent < percent) {
					_this.setText(tempPercent)
					tempPercent += 0.01;
				}
				else {
					_this.setText(percent)
					window.clearInterval(interval);
				}
			}, time)
    };
		
		return $.extend(this, {
			link: link,
			controller: controller,
			elem: elem
		});
  }
  progressSpinner.prototype.setUpSVG = function (height, width) {
      var el = d3.select('.spinner'), elWidth = parseInt(height, 10), elHeight = parseInt(width, 10), margin = { top: 5, right: 5, bottom: 5, left: 5 };
      this.width = elWidth - margin.left - margin.right;
      this.height = elHeight - margin.top - margin.bottom;
      this.svg = el.append("svg")
          .attr("width", elWidth)
          .attr("height", elHeight)
          .append("g")
          .attr("transform", "translate(" + elWidth / 2 + "," + elHeight / 2 + ")");
  };
  progressSpinner.prototype.setRadius = function () {
      this.radius = Math.min(this.width, this.height) / 2;
  };
  progressSpinner.prototype.drawCircles = function (percent, forColor, backColor) {
      if (percent === void 0) { percent = 0; }
      this.arc = d3.svg.arc()
          .innerRadius(this.radius)
          .outerRadius(this.radius * 0.9)
          .startAngle(0);
      this.backgound = this.svg.append("path")
          .datum({ endAngle: 2 * this.pi })
          .style("fill", "#ddd")
          .attr("d", this.arc);
      this.foreground = this.svg.append("path")
          .datum({ endAngle: percent * 2 * this.pi })
          .style("fill", "orange")
          .attr("d", this.arc);
  };
  progressSpinner.prototype.addText = function (textColor) {
      var _this = this;
      this.status = this.svg.append('text')
          .text(function (d) {
          return _this.formatPercentString(0);
      })
          .attr('text-anchor', 'middle')
          .attr("font-size", function () {
          return (_this.radius * 0.40).toString() + 'px';
      })
          .attr("fill", "#ddd");
  };
  progressSpinner.prototype.setText = function (percent) {
      this.status.text(this.formatPercentString(percent));
  };
  progressSpinner.prototype.transition = function (percent) {
      var _this = this;
      var newAngle = percent * 2 * this.pi;
      this.status.text(this.formatPercentString(percent));
      this.foreground.transition()
          .duration(750)
          .attrTween("d", function (d) {
          var interpolate = d3.interpolate(d.endAngle, newAngle);
          return function (t) {
              d.endAngle = interpolate(t);
              return _this.arc(d);
          };
      });
  };
  progressSpinner.prototype.formatPercentString = function (percent) {
      return (percent.toFixed(2) * 100).toString().substring(0, 2) + '%';
  };
	
	var p = new progressSpinner();
	p.link('847', '350', 0.4);

}());