function restore_options() {
	chrome.storage.sync.get(["replace_domains", "replace_enable"], function(items) {
		var domains = items.replace_domains;
		var html = [];
		for(var i in domains) {
			html.push(i + "=" + domains[i]);
		}
		if(html.length > 0) {
			var s = document.getElementById("J_config");
			s.value = html.join("\n");
		}
		document.getElementById("J_enable").checked = items.replace_enable;
	});
}

function save_options() {
	var html = document.getElementById("J_config").value;
	var checked = document.getElementById("J_enable").checked;
	
	var list = html.split("\n"), data = {}, v;
	for(var i = 0, len = list.length; i < len; i ++) {
		v = list[i].split("=");
		if(v.length == 2 && v[0].trim() != '') {
			data[v[0].trim()] = v[1].trim();
		}
	}

	chrome.storage.sync.set({"replace_domains" : data, "replace_enable" : checked}, function() {
		window.close();
	});
}

document.addEventListener("DOMContentLoaded", function() {
	restore_options();
	document.getElementById('J_save').addEventListener('click', save_options);
});
