function cookies() {
	var msg = "";
	
	if (document.cookie == "") {
		msg = "There were no cookies accessible by JavaScript.";
	}else{
		var c = document.cookie.split("; ");
		msg = "I was able to access the following cookie"+(c.length==1?'':'s')+" via JavaScript injected into the page:\n\n";
		for (var i=0;i<c.length;i++) {
			msg += " \u2022 " + c[i];
			if (c[i].toLowerCase().indexOf("sess") > -1) {
				msg += " (Dangerous!)";
			}
			msg += "\n";
		}
		msg += "\n";
		
		if (msg.indexOf("Dangerous") > -1) {
			msg += "At least one of the cookies above appears to be related to user authentication and session management. ";
			msg += "In almost no circumstances should such cookies be accessible via JavaScript.\n\n";
			msg += "Dangerous cookies should be reviewed, and should be issued with the HTTPOnly flag to prevent JavaScript from reading and/or setting its value.";
		}else{
			msg += "None of the identified cookies appeared to be related to session management, which means user sessions are likely not at risk by having these cookies exposed.";
			msg += "\n\nNevertheless, if cookies are not explictly required to be access by JavaScript, they should as a matter of best practice be issued with the HTTPOnly flag.";
		}
	}
		
	alert(msg);
}

window.callback();