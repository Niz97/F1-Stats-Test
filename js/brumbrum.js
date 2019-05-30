function load_constructor_standings(callback) {
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
        // console.log("#" + standing.position, standing.Constructor.name,"-", standing.points);
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

function load_driver_standings(callback) {
    const http_req = new XMLHttpRequest();
    const url = 'https://ergast.com/api/f1/current/driverStandings.json';
    http_req.open('GET', url);
    http_req.send();

    http_req.onreadystatechange = function(e) {
        if (http_req.readyState === 4 && http_req.status === 200) {
        let response_data = JSON.parse(http_req.responseText);

        let standings = response_data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        //console.log(standings);

        var driver_standings = [['Driver', 'Points']];

        for (var i = 0; i < 5; i++) {
            driver_standings.push([standings[i].Driver.driverId, parseInt(standings[i].points,10)]);
            // console.log(standings[i].Driver.driverId + ": " + standings[i].points);
        }

        // console.log(driver_standings);


        callback(driver_standings);

    
        }
    }
}


function driver_table(callback) {
    const http_req = new XMLHttpRequest();
    const url = 'https://ergast.com/api/f1/current/driverStandings.json';
    http_req.open('GET', url);
    http_req.send();

    http_req.onreadystatechange = function(e) {
        if (http_req.readyState === 4 && http_req.status === 200) {
        let response_data = JSON.parse(http_req.responseText);

        let standings = response_data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        //console.log(standings);

        var driver_standings = [['Driver', 'Points']];

        for (var i = 0; i < standings.length; i++) {
            driver_standings.push([standings[i].Driver.givenName + " " + standings[i].Driver.familyName, parseInt(standings[i].points, 10)]);
        }


        console.log(driver_standings);

        callback(driver_standings);

    
        }
    }
}



window.onload = function() {
    // constructors championship
    load_constructor_standings(function(standings_table) {
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(function() {
            var chart_standings_table = google.visualization.arrayToDataTable(standings_table);
            var chart = new google.visualization.PieChart(document.getElementById('piechart'));
            var options = { title: 'F1 2019' };
            chart.draw(chart_standings_table, options);
      });
    });

    // top 5 in driver standings
    load_driver_standings(function(driver_standings) {
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(function() {
            var top_five = google.visualization.arrayToDataTable(driver_standings);
            var chart = new google.visualization.PieChart(document.getElementById('TopFivepiechart'));
            var options = { 
                title: 'Top 5 Drivers', 
                pieHole: 0.4,
                pieSliceText: 'value'
            };
            chart.draw(top_five, options);
      });
    });

    driver_table(function(driver_standings) {
        google.charts.load('current', {'packages':['table']});
        google.charts.setOnLoadCallback(function() {
            var data = new google.visualization.arrayToDataTable(driver_standings);
        

            var table = new google.visualization.Table(document.getElementById('driverTable'));

            table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});

        });
    });


}