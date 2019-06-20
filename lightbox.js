"use strict";

function initialiseLightboxLinks(){
    // Find all <a> elements with the data-lightbox attribute
    let anchors = document.getElementsByTagName("a");
    for (let i = 0; i < anchors.length; i++) {
        const element = anchors[i];
        if("lightbox" in element.dataset){
            element.addEventListener("click", openLightbox);
        }
    }

    // Add our lightbox styling to the webpage
    addCssStyling();
}

function openLightbox(event){
    event.preventDefault();
    let target = getLightboxElement(event.path);
    let isIframe = false;

    let imageUrl = target.href;
    let imageDescription = target.dataset['lightbox'];

    if(imageUrl.startsWith("https://www.youtube.com/watch?")){
        isIframe = true;    
        let params = new URLSearchParams(imageUrl.split("?")[1]);
        console.log(params);
        imageUrl = `https://www.youtube-nocookie.com/embed/${params.get('v')}?autoplay=1&modestbranding&rel=0`;
    }

    /*
    <div id="lightbox-modal">
        <div id="lightbox-content">
            <img id="lightbox-image">
            <!-- or -->
            <iframe id="lightbox-image" src="https://www.youtube-nocookie.com/embed/qh6-UB7SAtM" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div id="lightbox-meta">
            <div id="lightbox-description"></div>
            <a id="lightbox-close"></a>
        </div>
    </div>
    */

    let lightboxModal = createElement("div", "lightbox-modal");
    lightboxModal.addEventListener("click", closeLightbox);

    let lightboxContent = createElement("div", "lightbox-content");
    lightboxModal.appendChild(lightboxContent);

    let lightboxImage = null;
    if(isIframe){
        lightboxImage = createElement("iframe", "lightbox-image");
        lightboxImage.allowFullscreen = "true";
        lightboxImage.src = imageUrl;
        lightboxContent.appendChild(lightboxImage);
    }
    else{
        let lightboxLoading = createElement("div", "lightbox-loading", "Loading...");
        lightboxModal.appendChild(lightboxLoading);

        lightboxImage = createElement("img", "lightbox-image");
        lightboxImage.alt = imageDescription;
        lightboxImage.src = imageUrl;
        lightboxImage.onload = function(){
            lightboxContent.appendChild(lightboxImage);
            lightboxLoading.remove();
        };
    }

    let lightboxMeta = createElement("div", "lightbox-meta");
    lightboxModal.appendChild(lightboxMeta);

    let lightboxDescription = createElement("div", "lightbox-description", imageDescription);
    lightboxMeta.appendChild(lightboxDescription);

    let lightboxClose = createElement("a", "lightbox-close", "Click to close.");
    lightboxClose.href = "#";
    lightboxMeta.appendChild(lightboxClose);
    
    document.body.appendChild(lightboxModal);
    
    return false;
}

function closeLightbox(event){
    event.preventDefault();
    document.getElementById("lightbox-modal").remove();
}

function createElement(tagName, id, text){
    let e = document.createElement(tagName);
    e.id = id;

    if(text != null){
        e.appendChild(document.createTextNode(text));
    }
    return e;
}

function getLightboxElement(path){
    for (let i = 0; i < path.length; i++) {
        let element = path[i];
        if("lightbox" in element.dataset){
            return element;
        }
    }
}

function addCssStyling(){
    let cssStyling = `
        #lightbox-modal{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 15;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(5px);
            animation: 0.5s modal-enter linear;
        }
        #lightbox-image{
            max-height: calc(80vh - 3rem);
            max-width: 80vw;
            animation: 0.5s image-enter ease-out;
        }
        iframe#lightbox-image{
            height: 80vh;
            width: 80vw;
            background-color: #000;
            border: none;
        }
        #lightbox-meta{
            text-align: center;
            animation: 1s text-enter linear;
        }
        #lightbox-loading{
            margin: 128px auto;
        }
        #lightbox-description{
        }
        #lightbox-close{
            display: block;
            opacity: 0.75;
            border: none;
        }
        @keyframes modal-enter{
            from{
                opacity: 0;
            }
            to{
                opacity: 1;
            }
        }
        @keyframes image-enter{
            from{
                transform: scale(0);
            }
            to{
                transform: scale(1);
            }
        }
        @keyframes text-enter{
            0%{
                opacity: 0;
            }
            50%{
                opacity: 0;
            }
            100%{
                opacity: 1;
            }
        }
    `;
    let style = createElement("style", "lightbox-style", cssStyling);
    document.head.appendChild(style);
}



initialiseLightboxLinks();