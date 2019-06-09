let rateLimitPool = null
let rateLimitMax = null
let rateLimitTimeToFull = null // seconds
let rateLimitSafeInterval = 5 // seconds
let rateLimitLastUsed = null

let rateLimitEstimatedPool = null
let rateLimitEstimatedTimeToFull = null
let rateLimitEstimateRegen = 5 // seconds to regenerate 1 request

function calcRateLimitEstimate() {
	if (rateLimitLastUsed == null) {
		return false
	}
	let now = new Date()
	let timeElapsed = (now.getTime() - rateLimitLastUsed.getTime()) / 1000
	rateLimitEstimatedPool = rateLimitPool + Math.floor(timeElapsed/rateLimitEstimateRegen)
	rateLimitEstimatedTimeToFull = rateLimitTimeToFull - Math.floor(timeElapsed)
	
	if (rateLimitEstimatedPool > rateLimitMax) {
		rateLimitEstimatedPool = rateLimitMax
	}
	if (rateLimitEstimatedTimeToFull < 0) {
		rateLimitEstimatedTimeToFull = 0
	}
	return true
}

socketio.on("rate-limit-info", function(info) {
	console.log("Got rate limit info", info)
	// let info = JSON.parse(payload)
	// console.log(info)
	
	rateLimitPool = info.available
	rateLimitMax = info.max
	rateLimitTimeToFull = info.timeToFull
	rateLimitLastUsed = new Date(info.asOf)
	
	rateLimitEstimatedPool = rateLimitPool
	rateLimitEstimatedTimeToFull = rateLimitTimeToFull
	
	let indicator = document.getElementById("rateLimitIndicator")
	indicator.textContent = `${rateLimitPool}/${rateLimitMax} (${rateLimitTimeToFull}s)`
})
function displayRateLimitEstimate() {
	console.log("Calculating rate limit estimate")
	if (calcRateLimitEstimate() == false) {
		return
	}
	let indicator = document.getElementById("rateLimitIndicator")
	indicator.textContent = `${rateLimitEstimatedPool}/${rateLimitMax} (${rateLimitEstimatedTimeToFull}s)`
}

setInterval(displayRateLimitEstimate, 200)
