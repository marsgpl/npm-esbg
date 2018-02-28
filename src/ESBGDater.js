//

"use strict"

module.exports = class {
    constructor(daysToProcess = 1, dateFrom = null) {
        this.daysLeft = daysToProcess || 1

        dateFrom = dateFrom || new Date

        let tzOffsetMs = dateFrom.getTimezoneOffset() * 60 * 1000

        this.from = new Date(dateFrom)
        this.to = new Date(dateFrom)

        this.from.setHours(0,0,0,0)
        this.to.setHours(23,59,59,0)

        this.from.setTime(this.from.getTime() - tzOffsetMs)
        this.to.setTime(this.to.getTime() - tzOffsetMs)
    }

    next(steps = 1) {
        steps = steps || 1

        if ( this.daysLeft <= 0 ) {
            return null
        } else {
            this.daysLeft--

            let day = {
                from: new Date(this.from),
                to: new Date(this.to),
            }

            this.from.setDate(this.from.getDate() - 1)
            this.to.setDate(this.to.getDate() - 1)

            return day
        }
    }
}
