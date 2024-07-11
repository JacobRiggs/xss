function internalIPs() {
    console.log("Running internalIPs function...");

    window.stolenIPs = [];
    setTimeout(function() {
        if (window.stolenIPs.length > 0) {
            alert("My script was able to determined your local/internal IP address" + (window.stolenIPs.length == 1 ? "" : "es")
                + " to be:\n \u2022 " + window.stolenIPs.join("\n \u2022 ") + "\n\n"
                + "If this address is an mDNS hostnames (ending in .local), an attacker may be able to resolve them to actual IP addresses using other network tools.");
        } else {
            alert("My script was unable to determine your internal IP address at this time.");
        }
    }, 5000); // Increased timeout to 5000 ms

    getIPs(function(ip) {
        window.stolenIPs[window.stolenIPs.length] = ip;
        console.log("IP detected: " + ip);
    });
}

//get the IP addresses associated with an account
function getIPs(callback) {
    var ip_dups = {};

    //compatibility for Firefox and Chrome
    var RTCPeerConnection = window.RTCPeerConnection
        || window.mozRTCPeerConnection
        || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;

    //bypass naive webrtc blocking using an iframe
    if (!RTCPeerConnection) {
        var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection
            || win.mozRTCPeerConnection
            || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
    }

    //minimal requirements for data connection
    var mediaConstraints = {
        optional: [{RtpDataChannels: true}]
    };

    var servers = { iceServers: [{ urls: "stun:stun.services.mozilla.com" }] };

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    function handleCandidate(candidate) {
        console.log("Handling candidate: " + candidate);
        //match IP address or mDNS hostname
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}|[a-zA-Z0-9-]{1,63}\.local)/;
        var ip_match = ip_regex.exec(candidate);

        if (ip_match && ip_match[1]) {
            var ip_addr = ip_match[1];
            if (ip_dups[ip_addr] === undefined) {
                callback(ip_addr);
            }
            ip_dups[ip_addr] = true;
        } else {
            console.error("No IP address found in candidate: " + candidate);
        }
    }

    pc.onicecandidate = function (ice) {
        if (ice.candidate) {
            handleCandidate(ice.candidate.candidate);
        }
    };

    pc.createDataChannel("");

    pc.createOffer(function (result) {
        pc.setLocalDescription(result, function () { }, function () { });
    }, function () { });

    setTimeout(function () {
        var lines = pc.localDescription.sdp.split('\n');
        lines.forEach(function (line) {
            if (line.indexOf('a=candidate:') === 0) {
                handleCandidate(line);
            }
        });
    }, 1000);
}

console.log("Executing internalIPs function...");
internalIPs();
