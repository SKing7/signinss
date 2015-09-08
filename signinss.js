(function() {
	var _cache = {
		"data": []
	};
	if (!chrome.cookies) {
		chrome.cookies = chrome.experimental.cookies
	}
	$(function() {
		initTable();
        initUpdateTime();
		$(".btn-default").click(function() {
			var ssList = [];
			chrome.tabs.query({
				active: true,
				windowType: "normal",
				currentWindow: true
			},
			function(d) {
				getCookies(d[0].url, "user_name", function(c) {
					if (c) {
						ssList.push(c)
					}
					getCookies(d[0].url, "user_pwd", function(c1) {
						if (c1) {
							ssList.push(c1)
						}
						getCookies(d[0].url, "user_uid", function(c2) {
							if (c2) {
								ssList.push(c2)
							}
							getCookies(d[0].url, "user_email", function(c3) {
								if (c3) {
									ssList.push(c3)
								}
								getCookies(d[0].url, "uid", function(c4) {
									if (c4) {
										ssList.push(c4)
									}
									addCacheData({
										"webUrl": (c3 || c).domain,
										"webUserName": (c3 || c).value,
										"cookies": ssList,
										"vc": c ? "0": "1"
									});
									initTable()
								})
							})
						})
					})
				})
			})
		});
		$(".btn-success").click(function() {
			var purl = ["/user/docheckin.php", "/user/_checkin.php", "/user/checkin"];
			if (_cache && _cache.data && _cache.data.length > 0) {
				for (var i = 0; i < _cache.data.length; i++) {
					REQ(_cache.data[i], purl[_cache.data[i].vc], _cache.data[i].cookies)
				}
                setLastestTime();
                initUpdateTime();
			}
		});
		$(".btn-danger").click(function() {
			if (window.confirm("are you sure ???")) {
				clearCacheData();
				initTable()
			}
		})
	});
	$("body").on("click", "a", function() {
		chrome.tabs.create({
			url: $(this).attr("href")
		});
		return false
	});
	function REQ(webObj, purl, cookie) {
		request("http://" + webObj.webUrl + purl, getCookieStr(cookie), function(body) {
            var bodyObj;
            try {
                bodyObj = JSON.parse(body || '{}');
            }catch (e) {
                bodyObj = {msg: 'parseError'};
            }
            document.getElementById(webObj.webUrl + webObj.webUserName).innerHTML = "<span color='green'>"+ bodyObj.msg + "</span>"
		})
	}
	function getCookieStr(cookies) {
		var str = "";
		for (var i = 0; i < cookies.length; i++) {
			if (cookies[i] && cookies[i].name) {
				str += cookies[i].name + "=" + cookies[i].value + ";"
			}
		}
		return str
	}
	function getCookies(domain, name, callback) {
		chrome.cookies.get({
			url: domain,
			name: name
		},
		function(cookie) {
			callback(cookie)
		})
	}
	function addTableRow(obj) {
		$("#ruyo_table tbody").append("<tr><td scope='row'>" + obj.webUrl + "</td><td>" + obj.webUserName + "</td><td id='" + obj.webUrl + obj.webUserName + "'>----</td></tr>")
	}
	function addCookieList(name, obj) {
		localStorage.removeItem(name);
		localStorage.setItem(name, JSON.stringify(obj))
	}
	function getCookieList(name) {
		return JSON.parse(localStorage.getItem(name))
	}
	function setLastestTime() {
		localStorage.setItem('signin-time', new Date().getTime())
	}
	function getLastestTime() {
		return localStorage.getItem('signin-time')
	}
	function delCookieList(name) {
		localStorage[name] = null
	}
	function getCacheData() {
		var __cache = getCookieList("ccc");
		if (__cache && __cache.data && __cache.data.length > 0) {
			_cache = __cache
		} else {
			__cache = []
		}
		return __cache
	}
	function clearCacheData() {
		delCookieList("ccc")
	}
	function addCacheData(obj) {
		for (var i = 0; i < _cache.length; i++) {
			if (_cache[i].webUrl === obj.webUrl && _cache[i].webUserName === obj.webUserName) {
				_cache.splice(i, i)
			}
		}
		_cache.data.push(obj);
		addCookieList("ccc", _cache)
	}
    function initUpdateTime() {
		var _time = getLastestTime();
        var dTime = new Date(+_time);
        var dNow = new Date();

        var diff = parseInt((dNow.getTime() - dTime.getTime()) / (10 * 60 * 60), 10) / 100;
		$(".J-lastest-update").html('<p>距上次更新:' + diff + '小时</p><p>上次更新:' + dTime.toLocaleString('zh') + '</p>');
    }
	function initTable() {
		$("#ruyo_table tbody").empty();
		var _data = getCacheData().data;
		if (_data && _data.length > 0) {
			for (var i = 0; i < _data.length; i++) {
				addTableRow(_data[i])
			}
		}
	}
})();

