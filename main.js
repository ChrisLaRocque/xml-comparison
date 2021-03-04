function stripTrailingSlash(str) {
	if(str.substr(-1) === '/') {
			return str.substr(0, str.length - 1);
	}
	return str;
}
function makeRequest(method, url) {
	return new Promise(function (resolve, reject) {
			let xhr = new XMLHttpRequest();
			xhr.open(method, url);
			xhr.onload = function () {
					if (this.status >= 200 && this.status < 300) {
							let mapArray = Array.from(xhr.responseXML.querySelectorAll('loc')).map(locItem => locItem.innerHTML)
							resolve(mapArray.map(mapArrayItem => stripTrailingSlash(mapArrayItem)));
					} else {
							reject({
									status: this.status,
									statusText: xhr.statusText
							});
					}
			};
			xhr.onerror = function () {
					reject({
							status: this.status,
							statusText: xhr.statusText
					});
			};
			xhr.send();
	});
}

async function comparisonizer(oldURL, newURL){
	let oldMap = await makeRequest('GET', oldURL)
	let newMap = await makeRequest('GET', newURL)
	let oldOnly = oldMap.filter(oldMapItem => newMap.indexOf(oldMapItem) === -1) // Not in new
	let newOnly = newMap.filter(newMapItem => oldMap.indexOf(newMapItem) === -1)
	console.log('oldMap', oldMap)
	console.log('newMap', newMap)
	console.log('oldOnly', oldOnly)
	console.log('newOnly', newOnly)
	const goodbye = document.getElementById('goodbye')
	oldOnly.forEach(link => {
		let newLink = document.createElement('a');
		newLink.setAttribute('href', link);
		newLink.innerHTML = link;	
		goodbye.appendChild(newLink)
	})
}

comparisonizer('./xml/old-sitemap-en_210303.xml', './xml/new-sitemap-en_210303.xml');