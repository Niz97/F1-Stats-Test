
google.charts.load('current', {'packages':['corechart']});

var constructorStandings = [];
getData();

google.charts.setOnLoadCallback(drawChart);



function drawChart() {

var data = google.visualization.arrayToDataTable(constructorStandings);

var options = {
  title: 'F1 2019'
};

var chart = new google.visualization.PieChart(document.getElementById('piechart'));

chart.draw(data, options);
}



function getData() {
let data = null;

const http_req = new XMLHttpRequest();
const url = 'https://ergast.com/api/f1/current/constructorStandings.json';
http_req.open("GET", url);
http_req.send();

http_req.onreadystatechange = function(e) {

  if(http_req.readyState === 4 && http_req.status === 200) {

    data = JSON.parse(http_req.responseText);

    let standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

    for (let i = 0; i < standings.length; i++) {
        let standing = standings[i];
        console.log('#' + standing.position, standing.Constructor.name, "-", standing.points);
    }

    // add constructor names and respective points to constructorStandings array
    for (let i = 0; i < standings.length; i++) {
        let standing = standings[i];
        constructorStandings.push([standing.Constructor.name, parseInt(standing.points, 10)]);
    }

    // pie chart categories
    constructorStandings.unshift(['Team', 'Points']);


  }
      
}

}