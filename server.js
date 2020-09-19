const http = require('http');
const fs = require('fs');
const path = require('path');
const defaultPage = 'morphing.html';

http.createServer(function (req, res) {
    let url = req.url.substr(1);
    if (url.indexOf('/') == -1 && ( url.indexOf(".")==-1 || url.endsWith('.html') )) {
        if(!url.endsWith('.html')) {
            url += ".html";
        }
        if(! fs.existsSync(path.join('page',url))) url = defaultPage;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(fs.readFileSync(path.join('page',url).toString()));
    }
    else if( url.indexOf('/') == -1 && url.endsWith('.js') ) {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(fs.readFileSync(path.join('lib',url).toString()));
    }
    res.end();

}).listen(8080);