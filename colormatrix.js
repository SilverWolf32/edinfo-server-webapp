// get the color matrix
async function useHUDColor() {
	// let toChange = document.getElementById("current-location")
	// let toChange = document.body
	// toChange.style = "filter: url(\"hudcolorfilter.svg#HUD\");"
	
	fetch("/api/hudcolorfilter.svg")
	.then(function(response) {
		if (response.status != 200) {
			// it's an error
			return Promise.reject(response)
		}
		return response.text()
	})
	.then(function(svg) {
		console.log("SVG:", svg)
		let container = document.getElementById("hudFilterContainer")
		container.innerHTML = svg
		
		// see https://stackoverflow.com/a/41022696
		// document.body.insertAdjacentHTML("beforeend", svg)
		
		// see https://stackoverflow.com/a/24109000
		// let parser = new DOMParser()
		// let element = parser.parseFromString(svg, "image/svg+xml")
		// document.querySelector("body").appendChild(element)
		
		return svg
	})
	.then(function() {
		// adding the filter to document.body works just fine, but messes up `position: fixed;` elements in Firefox
		let toChange = document.body.children
		for (element of toChange) {
			element.style.filter = "url(\"#HUD\")"
		}
	})
	.catch(function(error) {
		console.log(error)
	})
}

useHUDColor()
