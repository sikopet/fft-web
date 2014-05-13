var chart = d3.select(".spectrum");
var width = chart.attr("width");
var height = chart.attr("height");
var sx = d3.scale.linear()
    .domain([0, 1024])
    .rangeRound([0, width]);
var sy = d3.scale.pow()
    .exponent(4)
    .domain([0, 255])
    .rangeRound([0, height]);

ws = new WebSocket("ws://127.0.0.1:8080/spectrum");
ws.binaryType = "arraybuffer";
ws.onopen = function() { console.log("spectrum websocket opened"); };
ws.onclose = function() { console.log("spectrum websocket closed"); };

ws.onmessage = function(evt) {
    if (evt.data instanceof ArrayBuffer) {
        spectrum = new Uint8Array(evt.data);

        var updt = chart.selectAll("rect")
            .data(spectrum)
            .attr("y", function(d, i) { return height - sy(d); })
            .attr("height", function(d, i) { return sy(d); } );

        updt.enter().append("rect")
            .attr("fill", "#ccc")
            .attr("x", function(d, i) { return sx(i); })
            .attr("width", sx(1));

        updt.exit().remove();
    }
};
