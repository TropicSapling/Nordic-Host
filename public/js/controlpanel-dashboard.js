var values = [];
var host = "N/A";
var port = -1;

function getCookie(name) {
	name += "=";
	var ca = document.cookie.split(';');
	for(i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	return "";
}

$(document).ready(function() {
    $.get("../properities.txt", function(data) {
        values = data.split("\n");
		
		host = values[0].trim();
		port = Number(values[1]);
		
		if(host == "N/A" || port == -1) {
			swal("Unable to connect to server.", "", "error");
		} else {
			console.log("Creating socket...");
			var socket = io('http://' + host + ":" + port);
			if(typeof socket === 'undefined') {
				console.log("Failed to create socket");
			} else {
				console.log("Successfully created socket");
			}
		}
		
		socket.emit('get-status', {"server": Number(getCookie("user_id")), "session": getCookie("session")});
		
		socket.on('server-checked', function(data){
			if(!data.success) {
				swal("Failed to start server", "Reason: " + data.reason + "\nID: " + data.id, "error");
			}
		});
		
		socket.on('server-stopped', function(data){
			if(!data.success) {
				swal("Failed to stop server", "Reason: " + data.reason + "\nID: " + data.id, "error");
			}
		});
		
		socket.on('server-stats', function(data) {
			if(data.success){
				$('ip').text(data.info.IP);
				$('version').text(data.info.version);
			} else {
				swal("Failed to get server status", "Reason: " + data.reason + "\nID: " + data.id, "error");
			}
		});
		
		$('button #start-server').click(function(){
			socket.emit('start-server', { "server": Number(getCookie("user_id")), "session": getCookie("session") });
			return false;
		});
		
		$('button #stop-server').click(function(){
			socket.emit('stop-server', { "server": Number(getCookie("user_id")), "session": getCookie("session") });
			return false;
		});
    }, 'text');
});