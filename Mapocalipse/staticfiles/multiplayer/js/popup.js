function createPopup(id, title = '', text = '', callback = async () => {}) {
    let popupNode = document.querySelector(id);
    let overlay = popupNode.querySelector(".overlay");
    let closeBtn = popupNode.querySelector(".submit-btn");
    popupNode.querySelector("#title").innerText = title;
    popupNode.querySelector("#text").innerText = text;
    function openPopup() {
        popupNode.classList.add("active");
    }
    overlay.addEventListener("click", callback);
    closeBtn.addEventListener("click", callback);
    return openPopup;
}