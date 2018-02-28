//

"use strict"

module.exports = class {
    constructor(es, query) {
        this.es = es
        this.query = query

        this.cleanup()
    }

    void() {}

    cleanup() {
        if ( this.scrollId ) {
            this.es.clearScroll({
                scrollId: this.scrollId,
            })
            .then(this.void)
            .catch(this.void)

            this.scrollId = null
        }

        this.total = 0
        this.processed = 0
        this.done = false
    }

    scrollStart() {
        return new Promise((resolve, reject) => {
            this.es.search(this.query).then(r => {
                if ( r._scroll_id ) {
                    this.scrollId = r._scroll_id
                }

                if ( r.timed_out ) {
                    reject("scrollStart timeout: " + JSON.stringify(r))
                } else if ( !r._shards || r._shards.failed ) {
                    reject("scrollStart shards: " + JSON.stringify(r))
                } else {
                    this.total = r.hits.total
                    this.processed = 0
                    this.done = false

                    resolve(r.hits.hits)
                }
            }).catch(err => {
                reject("scrollStart search: " + JSON.stringify(err))
            })
        })
    }

    scrollNext() {
        return new Promise((resolve, reject) => {
            this.es.scroll({
                scrollId: this.scrollId,
                scroll: this.query.scroll,
            }).then(r => {
                if ( r.timed_out ) {
                    reject("scrollNext timeout: " + JSON.stringify(r))
                } else if ( !r._shards || r._shards.failed ) {
                    reject("scrollNext shards: " + JSON.stringify(r))
                } else {
                    resolve(r.hits.hits)
                }
            }).catch(err => {
                reject("scrollNext search: " + JSON.stringify(err))
            })
        })
    }

    next() {
        return new Promise((resolve, reject) => {
            if ( this.done ) {
                return resolve([])
            }

            let promise = !this.scrollId
                ? this.scrollStart()
                : this.scrollNext()

            promise.then(records => {
                this.processed += records.length

                if ( this.processed >= this.total ) {
                    this.done = true
                }

                resolve(records)
            }).catch(reject)
        })
    }
}
