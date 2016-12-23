const express = require('express');
const scraper = require('./scraper.js');

const app = express();
app.set('port', (process.env.PORT || 5000));

const errorHandler = (error, httpResponse) => {
    console.log(error.stack);
    console.log("Error: " + error);
    httpResponse.sendStatus(500);
}


/* ENDPOINT: GET /schoolCalendar
--------------------------
A scraper for the general school calendar.
Responds with the parsed calendar data as a JSON array of calendar event objects
sorted from earliest to latest.  Fetches the next two months of calendar data.
Each object has the format:

{
    "month": "September",
    "date": 9,
    "day": "Wednesday",
    "year": 2016,
    "eventName": "US Leadership Workshop",
    "startTime": "6:00 PM",
    "endTime": "7:30 PM",
    "location": "Theatre,Theatre Lobby"
}

All fields except startTime, endTime, and eventLocation are guaranteed to exist.
--------------------------
*/
app.get('/schoolCalendar', (req, res) => {
    "use strict";
    scraper.scrapeSchoolCalendars(new Date()).then(calendarData => {
        res.json(calendarData);
    }, error => {
        errorHandler(error, res);
    });
});


/* ENDPOINT: GET /athleticsCalendar
--------------------------
A scraper for the athletics calendar, including practices and games.
Responds with a dictionary containing a list of game events and practice events:

{
    "games": [
        ...
    ],
    "practices": [
        ...
    ]
}

The array of games, which are sorted chronologically from earliest to latest,
contains objects with the format:

{
    "month": "September",
    "date": 9,
    "day": "Wednesday",
    "year": 2016,
    "team": "Boys' Varsity Soccer",
    "opponent": "Other School"
    "time": "6:00 PM",
    "location": "Back Field",
    "isHome": true,
    "result": null,
    "status": "CANCELLED"
}

All fields except opponent, time, location, isHome, result, and status are
guaranteed to exist.  result is a string that may be either null, "Win", "Loss",
or another string indicating the outcome of the game.  Status may be null or
"CANCELLED" indicating the event was cancelled.

The array of practices, which are also sorted chronologically from earliest to
latest, contains objects with the format:

{
    "month": "September",
    "date": 9,
    "day": "Wednesday",
    "year": 2016,
    "team": "Boys' Varsity Soccer",
    "time": "6:00 PM",
    "location": "Back Field",
    "status": "CANCELLED"
}

All fields except time, location, and status are guaranteed to exist.  Status
may be null or "CANCELLED" indicating the event was cancelled.
--------------------------
*/
app.get('/athleticsCalendar', (req, res) => {
    "use strict";
    scraper.scrapeAthleticsCalendar().then(calendarData => {
        res.json(calendarData);   
    }, error => {
        errorHandler(error, res);
    });
});


/* ENDPOINT: GET /athleticsTeams
-----------------------------------------
A scraper for athletics teams information.  Responds with a collection of three
arrays, one for each season, of athletics team names (as strings):

{
    "Fall": [
        "Cross Country",
        "Girls' Varsity Tennis",
        ...
    ],
    "Winter": [
        ...
    ],
    "Spring": [
        ...
    ]
}
-----------------------------------------
*/
app.get('/athleticsTeams', (req, res) => {
    "use strict";
    scraper.scrapeAthleticsTeams().then(teams => {
        res.json(teams);
    }, error => {
        errorHandler(error, res);
    });
});


/* Start the server */
app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});

