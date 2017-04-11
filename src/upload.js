var fs = require('fs')
var pkgcloud = require('pkgcloud')

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

// Uploading to container
storageClient.createContainer({
    name: 'salsas'
}, function (err, container) {
    if (err) {
        console.error(err)
    }
    else {
        var myFile = fs.createReadStream('files/start.mp4')
        var upload = storageClient.upload({
            container: container.name,
            remote: 'start.mp4'
        })
        upload.on('error', function(err) {
            console.error(err)
        })
        upload.on('success', function(file) {
            console.log(file.toJSON())
        })
        myFile.pipe(upload)
    }
})