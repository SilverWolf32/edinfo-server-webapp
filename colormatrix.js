// get the color matrix
async function useHUDColor() {
	// let toChange = document.getElementById("current-location")
	let toChange = document.body
	toChange.style = "filter: url(\"hudcolorfilter.svg#HUD\");"
}

useHUDColor()

