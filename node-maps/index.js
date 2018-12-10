//Importação da biblioteca Restify
const restify = require('restify');

//Configurando a chave de api googlemaps

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDZ_eMojvRB8QS8MFK9jkDo5zsAB4ixGK0',
    Promise: Promise
});

// Criação do servidor rest
const server = restify.createServer({
    name: 'myapp',
    version: "1.0.0"
});
//Configuração do banco com biblioteca knex
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: "127.0.0.1",
        user: 'root',
        password: "",
        database: 'db',
    }
});
// Instalação de plugins
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

//Rotas
server.get('/geocode', function (req, res, next) {
    // Geocode an address.
    googleMapsClient.geocode({ address: '1600 Amphitheatre Parkway, Mountain View, CA' }).asPromise()
        .then((response) => {
            res.send(response.json.results);
        })
        .catch((err) => {
            res.send(err);
        });
})
server.get('/all', function (req, res, next) {
    knex('places').then((dados) => {
        res.send(dados);
    }, next)
    return next();

});
//definição da porta a qual o servidor vai ficar escutando
server.listen(8080, function () {
    console.log("%s listening in %s", server.name, server.url);
});