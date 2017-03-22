var loadCharts = function(selector,chartData,seriesData){
    debugger
    var chart = {
       plotBackgroundColor: null,
       plotBorderWidth: null,
       plotShadow: false
   };
   var title = {
      text: seriesData.seriesTitle,
      margin: 0,
      style: {
                color: 'rgba(23, 66, 136, 0.66)',
                fontSize:'15px'
             }
   };      
   /*var tooltip = {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
   };*/
   var plotOptions = {
      pie: {
         allowPointSelect: true,
         cursor: 'pointer',
         dataLabels: {
            enabled: false           
         },
         showInLegend: true,
         size: '70%'
      }
   };
   var credits = {enabled:false}
   var series= [{
      type: 'pie',
      name: seriesData.seriesName,
      data: chartData/*[
         ['Firefox',   45.0],
         ['IE',       26.8],
         {
            name: 'Chrome',
            y: 12.8,
            sliced: true,
            selected: true
         },
         ['Safari',    8.5],
         ['Opera',     6.2],
         ['Others',   0.7]
      ]*/
   }];     
      
   var json = {};   
   json.chart = chart; 
   json.title = title;   
   json.credits = credits;  
  // json.tooltip = tooltip;  
   json.series = series;
   json.plotOptions = plotOptions;
   $('#'+selector).highcharts(json);
}