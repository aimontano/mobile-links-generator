let btnCopy = document.querySelector("#btnCopy");
let result = "";

document.querySelector('#btnGenerate').addEventListener('click', function (evt) {
    evt.preventDefault();

    let label = document.querySelector("#customLabel")
    let limitParagraph = document.querySelector("#limit");

    limitParagraph.setAttribute('hidden', true);
    btnCopy.setAttribute('hidden', true);

    if (label.value.trim()) {
        let labelArr = label.value.trim().split(' ');

        labelArr.forEach((item, index) => {
            if (item.startsWith('href=')) {
                item = item.replace("href=", '');
                if (item[0] === '"')
                    item = `onclick='sforce.one.navigateToURL(window.top.location.origin + ${item})'`;
                else
                    item = `onclick="sforce.one.navigateToURL(window.top.location.origin + ${item})"`;

                labelArr[index] = item;
            }
        })

        result = labelArr.join(' ').trim();

        customLabel.value = "";

        document.querySelector("#result").textContent = result

        if (result.length > 1000) {
            limitParagraph.removeAttribute('hidden');
        } else {
            btnCopy.removeAttribute("hidden")
        }
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