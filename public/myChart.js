//var labels = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
//var votes = [12, 19, 3, 5, 2, 3];

var ctx = document.getElementById("myChart");

function newPie(labels, votes) {
  function newColor() {
    var rgb = [0, 64, 127, 191, 255]
    return rgb[Math.floor(Math.random() * 5)]
  }
  var bgColors = [];
  var bdColors = [];
  labels.forEach(function() {
    var color1 = newColor();
    var color2 = newColor();
    var color3 = newColor();
    bgColors.push('rgba(' + color1 + ', ' + color2 + ', ' + color3 + ', 0.2)');
    bdColors.push('rgba(' + color1 + ', ' + color2 + ', ' + color3 + ', 1)');
  })
  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: votes,
        backgroundColor: bgColors,
        borderColor: bdColors,
        borderWidth: 1
      }]
    }
  });
}
newPie(labels, votes);