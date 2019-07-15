login = function(email, password)
{
	$.ajax({
		url: "/login",
		type: "post",
		data: {
			email: email,
			password: password
		}
	}).done(function(response, textStatus, jqXHR) {
		if(response == "SUCCESS")
		{
			window.location.reload();
		}
		else
		{
			alert(response);
		}
	});
};

loginAction = function()
{
	login($('#email').val(), $('#password').val());
}