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

    // PRODUCTS OVERVIEW
    if (pathName === '/products' || pathName === '/') {
        // setting the http header, a message coming with the response to let the browser know what type of data is coming in. 200 is the http status code
        res.writeHead(200, { 'Content-type': 'text/html' });

        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let initialOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('')
                initialOutput = initialOutput.replace('{%CARDS%}', cardsOutput)
                res.end(initialOutput);
            });
        });
    }
    
    // LAPTOP DETAIL
    else if ((pathName === '/laptop') && (id < laptopData.length)) {
        // setting the http header, a message coming with the response to let the browser know what type of data is coming in. 200 is the http status code
        res.writeHead(200, { 'Content-type': 'text/html' });
        
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
            if (err) console.log(err);
        });
    }

    // IMAGES ROUTE
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg' });
            res.end(data)
        });
    }
    
    //WRONG URL
    else {
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end('<div style="text-align: center; margin-top: 45vh;"><h1>404</h1>not found</div>')
    }
});

server.listen(2468, '127.0.0.1', () => {
    console.log('The server has started listening...');
});

function replaceTemplate(originalHtml, laptop) {
    // regex / /g operates on all matches, global
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
	output = output.replace(/{%SCREEN%}/g, laptop.screen);
	output = output.replace(/{%PRICE%}/g, laptop.price);
	output = output.replace(/{%RAM%}/g, laptop.ram);
	output = output.replace(/{%STORAGE%}/g, laptop.storage);
	output = output.replace(/{%CPU%}/g, laptop.cpu);
	output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}