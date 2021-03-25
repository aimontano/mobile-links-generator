let btnCopy = document.querySelector("#btnCopy");
let result = "";

const getAllOccurrencesIndex = (key, text) => {
    let count = 0;
    let position = text.indexOf(key);

    let indexLoc = [];

    while (position !== -1) {
        count++;
        if (text.indexOf(key, position + 1) !== -1) {
            indexLoc.push(text.indexOf(key, position + 1));
        } else {
            indexLoc.push(text.indexOf(key));
        }
        position = text.indexOf(key, position + 1);
    }

    return indexLoc;
};

const singleOrDoubleQuote = (str) => {
    if (str.indexOf('"') > -1) {
        return '"';
    } else {
        return "'";
    }
};

const getFileName = (str) => {
    str = str.split("fileName=")[1];
    str = str.split(singleOrDoubleQuote(str))[0];
    return str;
};

const getExternalLink = (str) => {
    let div = document.createElement("div");
    div.innerHTML = str;
    let link = div.firstChild.getAttribute("href");

    return link;
};

const isSFLink = (str) => {
    let temp = str.split("href=")[1];
    temp = temp.split(singleOrDoubleQuote(temp))[1];
    console.log(temp, temp.slice(0, 4), temp.slice(0, 4) !== "http", temp.slice(0, 3) !== "www")
    return (temp.slice(0, 4) !== "http" && temp.slice(0, 3) !== "www");
};

const getFixedLinkString = (text) => {
    let start_cut = getAllOccurrencesIndex("<a", text).sort((a, b) => a - b);
    let end_cut = getAllOccurrencesIndex("</a>", text).sort((a, b) => a - b);

    let linkElements = [];
    let filenames = [];

    for (let i = 0; i < start_cut.length; i++) {
        linkElements.push(text.slice(start_cut[i], end_cut[i] + 4));
    }

    linkElements.forEach((el, index) => {
        if (isSFLink(el)) {
            if (el.indexOf("fileName=") > -1) {
                text = text.replace(
                    linkElements[index],
                    linkElements[index].replace("href", "onclick")
                );
                filenames.push(`/s/fileReaderService?fileName=${getFileName(el)}`);
            } else {
                let link = getExternalLink(el);
                text = text.replace(
                    linkElements[index],
                    linkElements[index].replace("href", "onclick")
                );

                text = text.replace(link, `sforce.one.navigateToURL(window.top.location.origin + '${link}')`);
            }
        } else {
            let link = getExternalLink(el);
            if (link) {
                let hasHTTP = link.slice(0, 4) == "http";
                let hasWWW = link.slice(0, 4) == 'www';
                if (hasHTTP || hasWWW) {
                    text = text.replace(
                        linkElements[index],
                        linkElements[index].replace("href", "onclick")
                    );

                }
                text = text.replace(link, `sforce.one.navigateToURL('${link}')`);
            }
        }
    });

    filenames.forEach((file) => {
        text = text.replace(
            file,
            "baseCtrl.prototype.cignaGHBMobileFileOpener('" +
            file +
            "', {fullURL:true})"
        );
    });

    return text;
};

document.querySelector('#btnGenerate').addEventListener('click', function (evt) {
    evt.preventDefault();

    let label = document.querySelector("#customLabel")
    let limitParagraph = document.querySelector("#limit");

    limitParagraph.setAttribute('hidden', true);
    btnCopy.setAttribute('hidden', true);

    result = getFixedLinkString(label.value.trim());

    customLabel.value = "";

    document.querySelector("#result").textContent = result

    if (result.length > 1000) {
        limitParagraph.removeAttribute('hidden');
    } else if(result.length > 0){
        btnCopy.removeAttribute("hidden")
    }
});

btnCopy.addEventListener('click', function () {
    if (result.length <= 1000) {
        let textToCopy = result;
        let myTemporaryInputElement = document.createElement("input");

        myTemporaryInputElement.type = "text";
        myTemporaryInputElement.value = textToCopy;

        document.body.appendChild(myTemporaryInputElement);

        myTemporaryInputElement.select();
        document.execCommand("Copy");

        document.body.removeChild(myTemporaryInputElement);

        document.querySelector("#copied").removeAttribute("hidden");

        setTimeout(function () {
            document.querySelector("#copied").setAttribute("hidden", true)
        }, 1200)
    }
})