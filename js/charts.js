var loadCharts = function(selector,chartData,seriesData,chartTitle){
    debugger
    var chart = {
       plotBackgroundColor: null,
       plotBorderWidth: null,
       plotShadow: false,
       type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
   };
   var title = {
      text: chartTitle,
      margin: 0,
      style: {
                color: 'rgba(23, 66, 136, 0.66)',
                fontSize:'15px'
             }
   };      
   
   var plotOptions = {
      pie: {
         allowPointSelect: true,
         cursor: 'pointer',
         dataLabels: {
            enabled: false           
         },
         showInLegend: true,
         size: '70%',
         depth: 35
      }
   };
   var credits = {enabled:false}
   var series= [{
      type: 'pie',
      name: seriesData.seriesName,
      data: chartData
   }];     
      
   var json = {};   
   json.chart = chart; 
   json.title = title;   
   json.credits = credits;   
   json.series = series;
   json.plotOptions = plotOptions;
   $('#'+selector).highcharts(json);
}