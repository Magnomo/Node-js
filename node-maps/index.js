//Importação da biblioteca Restify
const restify = require('restify');

//Configurando a chave de api googlemaps

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBHLMKlA0-p4BHPzOVCVeOK1CYoRNWXeBw',
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
server.post('/geocode', function (req, res, next) {
    const { lat, lng } = req.body
    // Geocode an address.
    googleMapsClient.reverseGeocode({ latlng: [lat, lng] }).asPromise()
        .then((response) => {
            const address = response.json.results[0].formatted_address;
            const place_id = response.json.results[0].place_id;
            const image = `https://maps.googleapis.com/maps/api/staticmap?center=${lat, lng}&zoom=5&size=300x300&sensor=false`
            knex('places')
                .insert({place_id, address, image})
                .then(() => {
                    res.send({address,image});
                }, next)
            
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
server.get(/\/(.*)?.*/,restify.plugins.serveStatic({
    directory:'./dist',
    default:'index.html',
}))
//definição da porta a qual o servidor vai ficar escutando
server.listen(8080, function () {
    console.log("%s listening in %s", server.name, server.url);
});