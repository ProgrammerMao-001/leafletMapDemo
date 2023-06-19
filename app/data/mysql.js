const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'mapcache'
});

connection.connect();
// function get(reqArry, response, request) {
//     let type = reqArry[1];
//     let zoom = reqArry[2];
//     let x = reqArry[3];
//     let y = reqArry[4];
//
//     console.log(type, zoom, x, y, 'type zoom')
//     connection.query(`select Tile from gmapnetcache where Type=${type} and Zoom=${zoom} and X=${x} and Y=${y}`, function (error, results, fields) {
//         if (error || !results || !results[0]) {
//             response.statusCode = 500;
//             response.setHeader("Content-Type", "text/plain");
//             response.write(error + "\n");
//             response.end();
//             return;
//         };
//         response.statusCode = 200;
//         response.setHeader('Content-Type', 'image/png');
//         response.write(results[0].Tile, "binary");
//         response.end();
//     });
// }


function get(reqArry, response, request) {
    const type = parseInt(reqArry[1]);
    const zoom = parseInt(reqArry[2]);
    const x = parseInt(reqArry[3]);
    const y = parseInt(reqArry[4]);

    if (isNaN(type) || isNaN(zoom) || isNaN(x) || isNaN(y)) {
        response.statusCode = 400;
        response.setHeader('Content-Type', 'text/plain');
        response.write('Bad Request');
        response.end();
        return;
    }

    const query = 'SELECT Tile FROM gmapnetcache WHERE Type = ? AND Zoom = ? AND X = ? AND Y = ?';
    const params = [type, zoom, x, y];

    connection.query(query, params, function (error, results, fields) {
        if (error || !results || results.length === 0) {
            response.statusCode = 500;
            response.setHeader('Content-Type', 'text/plain');
            response.write('Internal Server Error');
            response.end();
            console.error('Error while executing query:', error);
            return;
        }

        response.statusCode = 200;
        response.setHeader('Content-Type', 'image/png');
        response.write(results[0].Tile, 'binary');
        response.end();
    });
}


exports.get = get;
