// fs - default node module
const fs = require('fs');
const http = require('http');
const url = require('url');

// passing the absolute path first (dirname: home folder)
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
// parsing an imported string into a json
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        return;
    }

    console.log('Someone accessed the server!');

    // routing - responding differently for different URLs
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;
    console.log(id);

    if (pathName === '/home' || pathName === '/') {
        // setting the http header, a message coming with the response to let the browser know what type of data is coming in. 200 is the http status code
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end(`<h1 style="text-align: center; margin-top: 45vh;    background: linear-gradient(81deg, #36ffcb, #f674fd, #13b5f3); color: white;"><em>this is the HOME page ${id}!</em><h1>`);
    } else if ((pathName === '/products') && (id < laptopData.length)) {
        // setting the http header, a message coming with the response to let the browser know what type of data is coming in. 200 is the http status code
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end('<h1 style="text-align: center; margin-top: 45vh;     background: linear-gradient(81deg, #36ffcb, #f674fd, #13b5f3); color: white;"><em>this is the PRODUCTS page!</em><h1>');
    } else {
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end('<div style="text-align: center; margin-top: 45vh;"><h1>404</h1> poopy brain (stink!)</div>')
    }
});

server.listen(2468, '127.0.0.1', () => {
    console.log('The server has started listening...');
});
