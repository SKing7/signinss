var request; ! function() {
	var a = "http://51http.duapp.com/http/post";
	request = function(b, c, d) {
		var e = {
			url: b,
			headers: {
				Cookie: c
			}
		};
		$.post(a, {
			option: JSON.stringify(e)
		},
		function(a) {
			d(a)
		})
	}
} ();

