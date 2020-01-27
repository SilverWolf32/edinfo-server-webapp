socketio.on("status-update", function(payload) {
	console.log("Decoding status update")
	let data = JSON.parse(payload)
	let message = data.message
	console.log("Received status update:", message)
	
	let table = document.getElementById("extendedinfo-table")
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
