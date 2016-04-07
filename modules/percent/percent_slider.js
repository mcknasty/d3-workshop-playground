var slider = (function(){
	console.log(progressSpinner.getPercent());
	var mySlider = $('#percent').slider({
		ticks_labels: '["25%", "50%", "75%", "100%"]',
		min: 1,
		max: 100,
		step: 1,
		value: progressSpinner.getPercent() * 100,
		formatter: function(value) {
			return value + "%";
		}
	});
	mySlider.on("slide", function(event) {
		progressSpinner.setPercent(event.value);
		console.log(event.value)
	});
	mySlider.on("change", function(event){
		progressSpinner.setPercent(event.value.newValue);
	});
	return mySlider;
})()