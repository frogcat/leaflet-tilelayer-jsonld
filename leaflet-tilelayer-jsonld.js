(function(window) {
	L.tileLayer.jsonld = function(id) {
		var a = JSON.parse(document.getElementById(id).textContent);
		var url = a["@id"];
		var opt = a;
		opt.attribution = "<a href='" + a["cc:attributionURL"] + "'>" + a["cc:attributionName"] + "</a>";
		return L.tileLayer(url, opt);
	};
})(window);
