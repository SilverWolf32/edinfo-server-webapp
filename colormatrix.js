// get the color matrix
async function useHUDColor() {
	// tell the server to regenerate the filter SVG file
	console.log("Telling server to regenerate HUD color filter...")
	fetch("/api/regenerate-hud-filter").then(function(response) {
		console.log("Server has regenerated filter.")
		
		// let toChange = document.getElementById("current-location")
		let toChange = document.body
		toChange.style = "filter: url(\"hudcolorfilter.svg#HUD\");"
	}).catch(function(error) {
		console.log("Error regenerating HUD filter on server:", error)
	})
}

