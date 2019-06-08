// get the color matrix
async function useHUDColor() {
	// let toChange = document.getElementById("current-location")
	let toChange = document.body
	toChange.style = "filter: url(\"hudcolorfilter.svg#HUD\");"
	// tell the server to regenerate the filter SVG file
	console.log("Telling server to regenerate HUD color filter...")
	socketio.emit("regenHUDfilter", "foo", function(result) {
		console.log("Got result:", result)
		
	})
}

