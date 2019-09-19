

// {/* <div id="chartdiv" style="width: 100%; height: 400px;"></div> */}

// {/* <script> */}
// // Create chart instance

// var chart = am4core.create(document.getElementById('piechart'), am4charts.PieChart);

// // Add data
// chart.data = [{
//   "country": "Lithuania",
//   "litres": 501.9
// }, {
//   "country": "Czech Republic",
//   "litres": 301.9
// }, {
//   "country": "Ireland",
//   "litres": 201.1
// }, {
//   "country": "Germany",
//   "litres": 165.8
// }, {
//   "country": "Australia",
//   "litres": 139.9
// }, {
//   "country": "Austria",
//   "litres": 128.3
// }, {
//   "country": "UK",
//   "litres": 99
// }, {
//   "country": "Belgium",
//   "litres": 60
// }, {
//   "country": "The Netherlands",
//   "litres": 50
// }];

// // Add and configure Series

// var pieSeries = chart.series.push(new am4charts.PieSeries());
// pieSeries.dataFields.value = "litres";
// pieSeries.dataFields.category = "country";


google.setOnLoadCallback(drawChart);
      function drawChart() {

        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Owner',     10],
          ['Invester',      70],
          ['Partner',  10],
          // ['Watch TV', 2],
          // ['Sleep',    7],
		  ['Development',    10]
        ]);

        var options = {
          title: ' Token Distribution Percentages'
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
      }