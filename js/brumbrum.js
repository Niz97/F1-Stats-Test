function load_standings(callback) {
  const http_req = new XMLHttpRequest();
  const url = 'https://ergast.com/api/f1/current/constructorStandings.json';
  http_req.open('GET', url);
  http_req.send();

  http_req.onreadystatechange = function(e) {
    if (http_req.readyState === 4 && http_req.status === 200) {
      let response_data = JSON.parse(http_req.responseText);

      let standings = response_data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

      for (let i = 0; i < standings.length; i++) {
        let standing = standings[i];
        console.log("#" + standing.position, standing.Constructor.name,"-", standing.points);
      }
      
      // Table "columns"
      var standings_table = [['Team', 'Points']];

      // add constructor names and respective points to constructorStandings array
      for (let i = 0; i < standings.length; i++) {
        let standing = standings[i];
        standings_table.push([standing.Constructor.name, parseInt(standing.points, 10)]);
      }

      callback(standings_table);
    }
  };
}


window.onload = function() {
    load_standings(function(standings_table) {
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(function() {
        var chart_standings_table = google.visualization.arrayToDataTable(standings_table);
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        var options = { title: 'F1 2019' };
        chart.draw(chart_standings_table, options);
      });
    });

}