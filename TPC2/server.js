const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer(function (req, res) {
    const q = url.parse(req.url, true);

    const allowed_file_regex = /\/(c\d+)/;

    if (q.pathname === "/") {
        fs.readFile('generated/index.html', function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    } else if (allowed_file_regex.test(q.pathname)) {
        const file = q.pathname.substring(1);
        fs.readFile('generated/' + file + '.html', function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write("<h1>404 Not Found</h1>");
        res.end();
    }
}).listen(7777);