//

"use strict"

const fs = require("fs")
const elasticsearch = require("elasticsearch")

const ESBGReader = require("./ESBGReader")
const ESBGDater = require("./ESBGDater")

module.exports = class {
    constructor(conf = null) {
        if ( conf ) {
            this.configure(conf)
        }
    }

    configure(conf) {
        if ( typeof conf == "object" ) {
            this.conf = conf
        } else {
            this.conf = this.loadConf(conf)
        }

        return this
    }

    loadConf(path) {
        return JSON.parse(fs.readFileSync(path))
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.es = new elasticsearch.Client(this.conf.connection)

            this.es.ping({
                requestTimeout: this.conf.pingTimeout || 10000,
            }, error => {
                if ( !error ) {
                    resolve(this.es)
                } else {
                    reject(error)
                }
            })
        })
    }

    reader(query) {
        return new ESBGReader(this.es, query)
    }

    dater(daysToProcess = 1, dateFrom = null) {
        return new ESBGDater(daysToProcess, dateFrom)
    }
}
