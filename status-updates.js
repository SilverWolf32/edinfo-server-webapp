socketio.on("status-update", function(payload) {
	console.log("Decoding status update")
	let data = JSON.parse(payload)
	let message = data.message
	console.log("Received status update:", message)
	
	let table = document.getElementById("extendedinfo-table")
	
	if (table.querySelector("thead") != null) {
		// if it has a header, it's not in the middle of fetching
		console.log("Discarding - not during fetch")
		return
	}
	
	{
		while (table.hasChildNodes()) {
			table.removeChild(table.firstChild)
		}
		let tr = document.createElement("tr")
		let td = document.createElement("td")
		td.textContent = message
		tr.appendChild(td)
		table.appendChild(tr)
	}
})
