/// <reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.2-vsdoc.js" />
/// <reference path="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.8.1/jquery.validate-vsdoc.js" />

myApp = {};

_app = window.myApp;

_app.init = function () {
	_app.setupRules();
	$("#signup").validate(_app.validationOptions);
	$("#signup").submit(function () {
		if ($("#signup").valid()) {
			return true;
		}
		else {
			return false;
		}
	});
};

_app.initConfirm = function () {
	$("#getAllUsers").click(function () {
		// var url = "http://ellipsetours/SignupSvc/";
		var url = location.protocol + "//" + location.host + "/SignupSvc/";
		$.getJSON(
			url,
			function (data) {
				$.each(data, function (index, value) {
					var htm = "<div class='showName'>" + value.email + ", Name: " + value.firstName + " " + value.lastName + "</div>";
					$(htm).appendTo($(document.body));
				});
			}
		);
	});

	$("div.waiting img").css("top", ($(document.body).height() / 2) + "px");
	$("div.waiting img").css("left", ($(document.body).width() / 2) + "px");

	setTimeout(function () {
		$("div.waiting").toggle("slow");
	}, 1000);
};

_app.setupRules = function () {
	$.validator.addMethod(
		"email",
		function (value) {
			return /^[a-zA-Z][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/.test(value);
		},
		"Please enter a valid email address."
	);
	$.validator.addMethod(
		"terms",
		function (value, element) {
			if (element.checked)
				return true;
			return false;
		},
		"You must agree to terms and conditions to continue."
	);
};

_app.validationOptions = {
	errorPlacement: function (error, element) {
		if (element.attr("name") == "chkAgree")
			error.insertAfter("#lblAgree");
		else
			error.insertAfter(element);
	},
	rules: {
		emailAddr: {
			required: true,
			email: true
		},
		firstName: {
			required: true,
			minlength: 3,
			maxlength: 80
		},
		lastName: {
			required: true,
			rangelength: [3, 80]
		},
		chkAgree: {
			terms: true
		}
	},
	messages: {
		firstName: {
			minlength: "Name is too short",
			maxlength: "Name is too long"
		}
	}
};
