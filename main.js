const OpenMenuIcon = document.querySelector('.hamburger-icon');
const MobileNav = document.querySelector('.mobile-nav');
const CloseMenuIcon = document.querySelector('.close-icon');
const URLInput = document.querySelector('input');
const ShortenButton = document.querySelector('.shorten .main button');
const ErrorMessage = document.querySelector('span.error');

OpenMenuIcon.addEventListener('click', () => {
    MobileNav.classList.toggle('show');
    OpenMenuIcon.classList.toggle('hide');
    CloseMenuIcon.classList.toggle('hide');
});

CloseMenuIcon.addEventListener('click', () => {
    MobileNav.classList.toggle('show');
    OpenMenuIcon.classList.toggle('hide');
    CloseMenuIcon.classList.toggle('hide');
});

const LinksDiv = document.querySelector('.links');

function CreateLinkElement(link) {
    const linkDiv = document.createElement('div');
    linkDiv.classList.add('link');
    const FirstH4 = document.createElement('h4');
    FirstH4.textContent = URLInput.value;
    const hr = document.createElement('hr');
    const SecondH4 = document.createElement('h4');
    SecondH4.classList.add('link-text');
    SecondH4.textContent = link;
    const button = document.createElement('button');
    button.textContent = 'Copy';
    linkDiv.appendChild(FirstH4);
    linkDiv.appendChild(hr);
    linkDiv.appendChild(SecondH4);
    linkDiv.appendChild(button);
    LinksDiv.appendChild(linkDiv);
    button.addEventListener('click', () => {
        console.log('clicked');
        console.log(link);
        try {
            copy(link);
        }
        catch (e) {
            console.error(e);
        }
        button.textContent = 'Copied!';
        button.classList.add('copied');
    })
}

function copy(text) {
    return new Promise((resolve, reject) => {
        if (typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined" && navigator.permissions !== "undefined") {
            const type = "text/plain";
            const blob = new Blob([text], { type });
            const data = [new ClipboardItem({ [type]: blob })];
            navigator.permissions.query({name: "clipboard-write"}).then((permission) => {
                if (permission.state === "granted" || permission.state === "prompt") {
                    navigator.clipboard.write(data).then(resolve, reject).catch(reject);
                }
                else {
                    reject(new Error("Permission not granted!"));
                }
            });
        }
        else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";
            textarea.style.width = '2em';
            textarea.style.height = '2em';
            textarea.style.padding = 0;
            textarea.style.border = 'none';
            textarea.style.outline = 'none';
            textarea.style.boxShadow = 'none';
            textarea.style.background = 'transparent';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand("copy");
                document.body.removeChild(textarea);
                resolve();
            }
            catch (e) {
                document.body.removeChild(textarea);
                reject(e);
            }
        }
        else {
            reject(new Error("None of copying methods are supported by this browser!"));
        }
    });
    
}


function ShortenURL(url) {
    //https://api.shrtco.de/v2/shorten?url=example.org/very/long/link.html
    fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
    .then(response => response.json())
    .then(data => {
        CreateLinkElement(data.result.full_short_link);
    })
    .catch(error => {
            ErrorMessage.classList.remove('hide');
            URLInput.classList.add('error');
    });
}


ShortenButton.addEventListener('click', () => {
    const URL = URLInput.value;
    if (URL === '') {
        ErrorMessage.classList.remove('hide');
        URLInput.classList.add('error');
    } 
    else {
        ErrorMessage.classList.add('hide');
        URLInput.classList.remove('error');
        ShortenURL(URL);
    }
});
