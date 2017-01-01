var _w = chrome.extension.getBackgroundPage();
var _c = _w.console;
var _defaultList = {"https?://www.google.com.hk/" : "https://www.google.com.tw/"}; 
var _domainList = [];
var _enable = true;

function get_version() {
	return chrome.app.getDetails().version;
}

function set_config_list(items) {
	chrome.storage.sync.get(["replace_domains", "replace_enable", "replace_version"], function(items) {
		if(items.replace_version == undefined) {
			items.replace_enable = _enable;
			items.replace_domains = _defaultList;
			items.replace_version = get_version();
			chrome.storage.sync.set(items, function() {});
		} 

		var list = items.replace_domains;
		_enable = items.replace_enable;
		_domainList = [];
		for(var i in list) {
			_domainList.push([new RegExp(i), list[i], new RegExp(list[i])]);	
		}
	});
}


function change_url(tabId, url) {
	var t = null;
	for(var i = 0, len = _domainList.length; i < len; i ++) {
		t = _domainList[i];
		if(t[0].test(url)) {
			url = url.replace(t[0], t[1]);
			//chrome.pageAction.show(tabId);
			return {redirectUrl : url};
		}	
	}
}
function add_headers(tabId, url, details) {
	var t = null;
	for(var i = 0, len = _domainList.length; i < len; i ++) {
		t = _domainList[i];
		if(t[2].test(url)) {
            var headers = details.requestHeaders;
            headers.push({name: "X-ID", value: "5cbabe0f0e7ba7e0631a32fc4a7b2cf5"});
			return {requestHeaders : headers};
		}	
	}
}

chrome.webRequest.onBeforeRequest.addListener(function(details) {
	if(_enable && details && details.tabId > 0) {// && details.type == 'main_frame') {
		return change_url(details.tabId, details.url);
	}
}, {"urls" : ["*://*/*"]}, ['blocking']);

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
	if(_enable && details && details.tabId > 0) {// && details.type == 'main_frame') {
		return add_headers(details.tabId, details.url, details);
	}
}, {"urls" : ["*://*/*"]}, ['blocking', 'requestHeaders']);


chrome.storage.onChanged.addListener(function(changes, areaName) {
	set_config_list();
});

set_config_list();
