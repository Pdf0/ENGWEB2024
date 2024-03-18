// Criar uma aplicação para a gestão de uma base de dados de compositores musicais:
// Montar a API de dados com o json-server a partir do dataset de compositores em anexo;
// Criar uma aplicação Web com as seguintes caraterísticas:
// CRUD sob re compositores;
// CRUD sobre periodos musicais.
// Investigar e inserir pelo menos 5 compositores do período moderno ou serialista.

const http = require('http');
const fs = require('fs');
const url = require('url');
const axios = require('axios');

const server = http.createServer((req, res) => {

    console.log(req.url);

    var q = url.parse(req.url, true);

    if (q.pathname == "/") {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'></link>");
        res.write("<h1 class='w3-container w3-teal'>Página sobre compositores musicais</h1>");
        res.write("<ul class='w3-ul'>");
        res.write("<li><a href='/compositores' class='w3-button'>Compositores</a></li>");
        res.write("<li><a href='/periodos'class='w3-button'>Periodos</a></li>");
        res.write("</ul>");
        res.end();
    }
    else if (q.pathname == "/compositores") {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        axios.get('http://localhost:3000/compositores?_sort=nome')
            .then((response) => {
                res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'></link>");
                res.write("<div class='w3-container w3-teal'>");
                res.write("<span style='font-size: 40px; padding-right: 20px;'><b>Compositores</b></span>");
                res.write("<a href='/compositores/create' class='w3-button w3-green'>Adicionar Compositor</a>");
                res.write("</div>");
                res.write("<ul class='w3-ul'>");
                for (let i = 0; i < response.data.length; i++) {
                    res.write("<li><a href='/compositores/" + response.data[i].id + "' class='w3-button'>" + response.data[i].nome + "</a></li>");
                }
                res.end();
            });
    } else if (q.pathname == "/periodos") {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        axios.get('http://localhost:3000/periodos')
            .then((response) => {
                res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'></link>");
                res.write("<h1 class='w3-container w3-teal'>Periodos</h1>");
                res.write("<ul class='w3-ul'>");
                for (let i = 0; i < response.data.length; i++) {
                    res.write("<li><a href='/periodos/" + response.data[i].id + "' class='w3-button'>" + response.data[i].nome + "</a></li>");
                }
                res.end();
                });
    } else if (q.pathname.match(/compositores\/(?!create$|delete$).*/)) {
        let id = q.pathname.split("/")[2];
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        axios.get('http://localhost:3000/compositores/' + id)
            .then((response) => {
                res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'></link>");
                res.write("<h1 class='w3-container w3-teal'>"+response.data.nome+"</h1>");
                res.write("<table class='w3-table'>")
                res.write("<tr>\n<td><b>Biografia:</b></td>\n<td>" + response.data.bio + "</td></tr>");
                res.write("<tr>\n<td><b>Data de Nascimento:</b></td>\n<td>" + response.data.dataNasc + "</td></tr>");
                res.write("<tr>\n<td><b>Data de Morte:</b></td>\n<td>" + response.data.dataObito + "</td></tr>");
                res.write("<tr>\n<td><b>Periodo:</b></td>\n<td>" + response.data.periodo + "</td></tr>\n</table>");
                res.write("<form action='/compositores/delete' method='post'>");
                res.write("<input type='hidden' name='id' value='" + response.data.id + "'>");
                res.write("<input type='submit' value='Apagar' class='w3-button w3-red'>");
                res.write("</form>");
                res.write("<form action='/compositores/edit' method='post'>");
                res.write("<input type='hidden' name='id' value='" + response.data.id + "'>");
                res.write("<input type='submit' value='Editar' class='w3-button w3-blue'>");
                res.write("</form>");
                res.end();
            });
        } else if (q.pathname.match(/periodos\/P[0-9]+/)) {
            let id = q.pathname.split("/")[2];
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
            axios.get('http://localhost:3000/periodos/' + id)
                .then((response) => {
                    res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'></link>");
                    res.write("<h1 class='w3-container w3-teal'>"+response.data.nome+"</h1>");
                    res.write("<h2>Descrição:</h2>\n<p>" + response.data.descricao + "</p>");
                    let nome = response.data.nome;
                    
                    console.log('http://localhost:3000/compositores?periodo=' + nome);
                    axios.get('http://localhost:3000/compositores?periodo=' + nome)
                        .then((response) => {
                            res.write("<h2>Compositores</h2>");
                            res.write("<ul class='w3-ul'>");
                            for (let i = 0; i < response.data.length; i++) {
                                res.write("<li><a href='/compositores/" + response.data[i].id + "' class='w3-button'>" + response.data[i].nome + "</a></li>");
                            }
                            res.end();
                        });
                });
    } else if (q.pathname == "/compositores/delete" && req.method == "POST") {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            let post = require("querystring").parse(body);
            console.log(post);
            axios.delete('http://localhost:3000/compositores/' + post.id)
                .then((response) => {
                    console.log("HELLO");
                    res.writeHead(302, { 'Location': '/compositores' });
                    res.end();
                });
        });
    } else if (q.pathname == "/compositores/create" && req.method == "GET") {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
        res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'></link>");
        res.write("<h1 class='w3-container w3-teal'>Adicionar Compositor</h1>");
        res.write("<form action='/compositores/create' method='post'>");
        res.write("<label style='margin: 8px 8px;'>Nome:</label><input type='text' name='nome' class='w3-input' style='border: 2px solid; border-radius: 8px; margin: 8px 8px;'>");
        res.write("<label style='margin: 8px 8px;'>Biografia:</label><textarea name='bio' class='w3-input' style='border: 2px solid; border-radius: 8px; margin: 8px 8px;'></textarea>");
        res.write("<label style='margin: 8px 8px;'>Data de Nascimento:</label><input type='date' name='dataNasc' class='w3-input' style='border: 2px solid; border-radius: 8px; margin: 8px 8px;'>");
        res.write("<label style='margin: 8px 8px;'>Data de Morte:</label><input type='date' name='dataObito' class='w3-input' style='border: 2px solid; border-radius: 8px; margin: 8px 8px;'>");
        res.write("<label style='margin: 8px 8px;'>Periodo:</label><input type='text' name='periodo' class='w3-input' style='border: 2px solid; border-radius: 8px; margin: 8px 8px;'>");
        res.write("<input type='submit' value='Adicionar' class='w3-button w3-green'>");
        res.write("</form>");
        res.end();
    } else if (q.pathname == "/compositores/create" && req.method == "POST")  {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            let post = require("querystring").parse(body);
            console.log(post);
            axios.post('http://localhost:3000/compositores', post)
                .then((response) => {
                    res.writeHead(302, { 'Location': '/compositores' });
                    res.end();
                });
        });
    } else if (q.pathname == "/compositores/edit" && req.method == "POST") {
        console.log("HELLO");
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            let post = require("querystring").parse(body);
            console.log(post);
            axios.get('http://localhost:3000/compositores/' + post.id)
                .then((response) => {
                    res.write("<link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'></link>");
                    res.write("<h1 class='w3-container w3-teal'>Editar Compositor</h1>");
                    res.write("<form action='/compositores/edit' method='post'>");
                    res.write("<input type='hidden' name='id' value='" + response.data.id + "'>");
                    res.write("<label style='margin: 8px 8px;'>Nome:</label><input type='text' name='nome' value='" + response.data.nome + "' class='w3-input' style='border: 2px solid; border-radius: 8px; margin: 8px 8px;'>");
                    res.write("<label style='margin: 8px 8px;'>Biografia:</label><textarea name='bio' class='w3-input' style='border: 2px solid; border-radius: 8px; margin: 8px 8px;'>" + response.data.bio + "</textarea>");
                    res.write("<label style='margin: 8px 8px;'>Data de Nascimento:</label><input type='date' name='dataNasc' value='" + response.data.dataNasc + "' class='w3-input' style='border: 2px solid; border-radius: 8px; margin: 8px 8px;'>");
                    res.write("<label style='margin: 8px 8px;'>Data de Morte:</label><input type='date' name='dataObito' value='" + response.data.dataObito + "' class='w3-input' style='border: 2px solid; border-radius: 8px; margin: 8px 8px;'>");
                    res.write("<label style='margin: 8px 8px;'>Periodo:</label><input type='text' name='periodo' value='" + response.data.periodo + "' class='w3-input' style='border: 2px solid; border-radius: 8px; margin: 8px 8px;'>");
                    res.write("<input type='submit' value='Editar' class='w3-button w3-blue'>");
                    res.write("</form>");
                    res.end();
                });       
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8'});
        res.write("<h1>Página não encontrada</h1>");
        res.end();
    }
}).listen(8080, () => {
    console.log('Servidor a correr na porta 8080...');
});
