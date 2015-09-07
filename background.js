function doit() {
	getProxy(function(a) {
		var b = {
			mode: "pac_script",
			pacScript: {
				data: ["function FindProxyForURL(url, host) { \n", "if(" + createUrl(host) + ") \n", '   return "' + a + '"\n', "else \n", "   return 'DIRECT'", "}"].join("")
			}
		};
		console.log(b.pacScript.data),
		chrome.proxy.settings.set({
			value: b,
			scope: "regular"
		})
	})
}
function createUrl(a) {
	var c, b = "";
	for (c in a) b += "shExpMatch(url,'" + a[c] + "')||";
	return b.replace(/\|\|$/, "")
}
function getProxy(a) {
	$.ajax({
		type: "post",
		url: "http://51proxy.duapp.com/server/getproxy",
		async: ! 1,
		success: function(b) {
			a(b)
		}
	})
}
var host = ["*google.com*", "*ip-adress.com*", "*facebook.com*", "*twitter.com*", "*youtube.com*"];
chrome.runtime && chrome.runtime.onStartup && chrome.runtime.onStartup.addListener(function() {
    console.log('startup returnd');
    return;
	//doit()
}),
chrome.runtime.onInstalled.addListener(function() {
    console.log('install returnd');
    return;
	//doit()
});

