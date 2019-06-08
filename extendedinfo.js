let extendedInfoTable = document.getElementById("extendedinfo-table")

async function updateExtendedInfo() {
	// ask server to get nearby stations
	console.log("Getting nearby station information")
	fetch("/api/nearby-stations?r=30")
	.then(function(response) {
		return response.json()
	})
	.then(function(stations) {
		console.log("Stations:", stations)
		
		let table = extendedInfoTable
		
		// remove all columns
		while (table.hasChildNodes()) {
			table.removeChild(table.firstChild)
		}
		// add rows
		let properties = ["name", "systemName", "distanceToArrival", "distance"]
		
		let thead = document.createElement("thead")
		// add headers
		for (let i = 0; i < properties.length; i++) {
			let property = properties[i]
			let cell = document.createElement("td")
			// div to contain the text, that way we can set a margin on it
			let div = document.createElement("div")
			div.textContent = property
			cell.appendChild(div)
			thead.appendChild(cell)
		}
		table.appendChild(thead)
		
		let tbody = document.createElement("tbody")
		for (let i = 0; i < stations.length; i++) {
			let station = stations[i]
			let row = document.createElement("tr")
			for (let j = 0; j < properties.length; j++) {
				let property = properties[j]
				let cell = document.createElement("td")
				cell.textContent = station[property]
				row.appendChild(cell)
			}
			tbody.appendChild(row)
		}
		table.appendChild(tbody)
	})
	.catch(function(error) {
		console.log(error)
	})
}

updateExtendedInfo()
