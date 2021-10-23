/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry
 * https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
 */
// Create a class for the element
class B4uHead extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="assets/eyes-20x20.css">
            
            <div class="head">
                <b4u-eye side="left"></b4u-eye>
                <b4u-eye side="right"></b4u-eye>
            </div>
        `
    }
}

class B4uEye extends HTMLElement {
    /** @type {HTMLElement} */
    #eyeElt;
    get eyeElt() {
        return this.#eyeElt
    }
    /** @type {HTMLElement} */
    #headElt;

    constructor(type) {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="assets/eyes-20x20.css">
        `;
        //<div class="eye"></div>

        this.#eyeElt = document.createElement("div");
        this.#eyeElt.setAttribute("class", "eye");
        this.shadowRoot.appendChild(this.#eyeElt);
        //eyeElt.setAttributeNode(classAttr);
        console.log(this.eyeElt);
    }
    connectedCallback() { // runs each time the element is added to the DOM
        console.log('Custom eye element added to page, on ' + this.getAttribute("side") + ' side.');
        //this.classList.add(this.getAttribute("side"))
        this.#eyeElt.classList.add(this.getAttribute("side") + "-eye" );
        this.#headElt = this.parentElement;
        //console.log(this.parentElement);
        // console.log(window.document.title);
        window.addEventListener("mousemove", (event) => this.mouseListener(event)); // inject "this" as 2nd param if needed (see below)
        this.#headElt.addEventListener("", (event) => console.log(event))
    }

    /**
     * 
     * @param {MouseEvent} mouseEvent 
     * @param {B4uEye} me a replacement for unusable "this" (because in listeners, "this" is bound to the event originator)
     */
    mouseListener(mouseEvent, me=this) { // beware : in method body, this==window (if listener is bound to it) => use "me"
        // head = this.document.querySelector(".head")
        let head = me.#headElt;
        // console.log("Eye mouseListener : head is : ")
        // console.log(head);
        // return;
        
        let rxPxExtractor = /([0-9]*)px/;
        const HEAD_WIDTH = window.getComputedStyle(head, null).width.replace(rxPxExtractor, "$1");
        const HEAD_HEIGHT = window.getComputedStyle(head, null).height.replace(rxPxExtractor, "$1");
        // console.log("head : " + HEAD_WIDTH + "x" + HEAD_HEIGHT);
        let eventDomCoord = {
            x: window.scrollX + mouseEvent.clientX,
            y: window.scrollY + mouseEvent.clientY
        };
        let dx = eventDomCoord.x - head.offsetLeft - (HEAD_WIDTH / 2)
        let dy = eventDomCoord.y - head.offsetTop - (HEAD_HEIGHT / 2)
            // console.log(window.getComputedStyle(head, null).width);
            // console.log(eventDomCoord.x + "\t" + head.offsetLeft + "\t" + dx);
            // console.log(eventDomCoord.y + "\t" + head.offsetTop + "\t" + dy);
        let dirX = 0;
        if (dx > HEAD_WIDTH / 2) {
            dirX = 1;
        } else if (dx < -HEAD_WIDTH / 2) {
            dirX = -1
        }
        let dirY = 0;
        if (dy > HEAD_HEIGHT / 2) {
            dirY = 1;
        } else if (dy < -HEAD_HEIGHT / 2) {
            dirY = -1
        }
        // console.log(dy + "\t=>\t" + dirY);
        let classes = me.#eyeElt.classList
        // console.log(classes);
        if (dirX < 1) classes.remove("right")
        if (0 < dirX) classes.add("right")
        if (-1 < dirX) classes.remove("left")
        if (dirX < 0) classes.add("left")

        if (dirY < 1) classes.remove("bottom")
        if (0 < dirY) classes.add("bottom")
        if (-1 < dirY) classes.remove("top")
        if (dirY < 0) classes.add("top")
    }
}


window.customElements.define('b4u-eye', B4uEye)
window.customElements.define('b4u-head', B4uHead)