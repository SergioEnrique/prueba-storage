var express = require('express')
var path = require("path")
var pkgcloud = require('pkgcloud')
var swig = require('swig')

var app = express()

app.set('port', (process.env.PORT || 5000))
app.set('view engine', 'swig')

app.use(express.static(path.join(__dirname, "../public")))

app.get("/", function (res, res) {
    res.send(swig.renderFile('./src/presenter/home.html'))
})

app.get("/start.mp4", function (req, res) {

    var config = {
        provider: 'openstack',
        useServiceCatalog: true,
        useInternal: false,
        keystoneAuthVersion: 'v3',
        authUrl: 'https://identity.open.softlayer.com',
        tenantId: '7753f81a6a8b4a6ca4269600780e21a3',    //projectId from credentials
        domainId: '42539b1999424ece94b6bbc1d6f7ba7b',
        username: 'admin_98357172f0598f651afb5f7bd5f3bf0bcf92f393',
        password: 'q#}Qaps8Y]oDi4ft',
        region: 'dallas'   //dallas or london region
    }

    var storageClient = pkgcloud.storage.createClient(config)

    // Autentication
    storageClient.auth(function(err) {
        if (err) {
            console.error(err)
        }
        else {
            // console.log(storageClient._identity)
            console.log("Conectado correctamente")
        }
    })

    storageClient.download({
        container: 'salsas',
        remote: 'start.mp4'
    }, function(err, result) {
        if (err) {
            console.error(err)
        }
    }).pipe(res)

})

// Error 404
app.use(function(req, res, next){
    res.status(404)

    // respond with html page
    if (req.accepts('html')) {
        return res.send("Página no encontrada")
    }

    // respond with json
    if (req.accepts('json')) {
        return res.json({ error: 'Recurso no encontrado' })
    }

    // default to plain-text. send()
    return res.type('txt').send('Not found')
})

// Start Server
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'))
})
