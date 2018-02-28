//

"use strict"

const ESBG = require("../esbg")

const conf = {
    connection: {
        host: "https://etbot.connect.club/elastic/",
        apiVersion: "5.5",
    },
    pingTimeout: 1000,
}

let fail = err => {
    console.log("Error:", err)
    process.exit(1)
}

let es = new ESBG(conf)

es.connect().then(() => {
    console.log("TODO")
}).catch(fail)
