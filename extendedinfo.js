let extendedInfoTable = document.getElementById("extendedinfo-table")
let fetchButton = document.getElementById("extendedinfo-fetch-button")

var nearbyStations = []

async function updateExtendedInfo() {
	// ask server to get nearby stations
	console.log("Getting nearby station information")
	
	let table = extendedInfoTable
	
	// tell the user what's happening
	{
		while (table.hasChildNodes()) {
			table.removeChild(table.firstChild)
		}
		let tr = document.createElement("tr")
		let td = document.createElement("td")
		td.textContent = "Fetching..."
		tr.appendChild(td)
		table.appendChild(tr)
	}
	
	fetch("/api/nearby-stations?r=30")
	.then(function(response) {
		if (response.status != 200) {
			// it's an error
			return Promise.reject(response)
		}
		return response.json()
	})
	.then(function(stations) {
		nearbyStations = stations
		populateTable()
	})
	.catch(function(response) {
		console.log(response)
		
		response.json().then(function(error) {
			while (table.hasChildNodes()) {
				table.removeChild(table.firstChild)
			}
			{
				let thead = document.createElement("thead")
				let tr = document.createElement("tr")
				let td = document.createElement("td")
				let div = document.createElement("div")
				div.textContent = response.statusText
				td.appendChild(div)
				tr.appendChild(td)
				thead.appendChild(tr)
				table.appendChild(thead)
			}
			{
				let tbody = document.createElement("tbody")
				let tr = document.createElement("tr")
				let td = document.createElement("td")
				td.textContent = error.message
				// td.textContent = JSON.stringify(error, null, "\t")
				td.style.fontFamily = "monospace"
				tr.appendChild(td)
				tbody.appendChild(tr)
				table.appendChild(tbody)
			}
			// debugger
		})
	})
}
function populateTable() {
	let stations = nearbyStations
	
	stations = filterStations(stations)
	
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
		let displayName = unCamelCase(property)
		let cell = document.createElement("td")
		// div to contain the text, that way we can set a margin on it
		let div = document.createElement("div")
		div.textContent = displayName
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
			
			let text = station[property]
			if (text == Number(text)) {
				text = Math.round(text)
			}
			cell.textContent = text
			
			if (property == "distance") {
				cell.textContent += " Ly"
				cell.style.textTransform = "none"
				cell.style.fontFamily = '"Menlo", "DejaVu Sans Mono", monospace'
			}
			if (property == "distanceToArrival") {
				cell.textContent += " Ls"
				cell.style.textTransform = "none"
				cell.style.fontFamily = '"Menlo", "DejaVu Sans Mono", monospace'
			}
			
			row.appendChild(cell)
		}
		tbody.appendChild(row)
	}
	table.appendChild(tbody)
}

// updateExtendedInfo()

function filterStations(stations) {
	// see https://stackoverflow.com/a/15839451
	let selectedType = document.querySelector('input[name="filter-selector"]:checked').value
	console.log("Filtering stations for " + unCamelCase(selectedType).toLowerCase())
	stations = stations.filter((station) => {
		switch (selectedType) {
			case "fuel":
				return station.otherServices.includes("Refuel")
				break
			case "repair":
				return station.otherServices.includes("Repair")
				break
			case "restock":
				return station.otherServices.includes("Restock")
				break
			case "interstellarFactors":
				return station.otherServices.includes("Interstellar Factors Contact")
				break
			case "materialTrader":
				return station.otherServices.includes("Material Trader")
				break
			case "techBroker":
				return station.otherServices.includes("Technology Broker")
				break
		}
		return false
	})
	console.log(stations.length + " results")
	return stations
}
// make selector filter the stations
{
	let radios = document.querySelectorAll('input[name="filter-selector"]')
	for (let i = 0; i < radios.length; i++) {
		radios[i].addEventListener("click", populateTable)
	}
}

function unCamelCase(s) {
	return (s.toUpperCase()[0] + s.slice(1).replace(/([A-Z])/g, " $1"))
		// Got any more things that shouldn't be capitalized? Put them here!
		.replace(/ (To|The|And|A|An|Of|On) /, (word) => word.toLowerCase())
}
