joinGame = function(server_id)
{
	$.ajax({
		url: "/joingame",
		type: "post",
		data: {
			server_id: server_id
		}
	}).done(function(response, textStatus, jqXHR) {
		if(response == "SUCCESS")
		{
			alert("Logged In!");
			window.location.reload();
		}
		else
		{
			alert(response);
		}
	});
};