window.onload = () => {
    let uploadBox = document.getElementById("customization-upload");
    let uploadStatus = document.getElementById("customization-label");
    uploadBox.addEventListener("change", () => {
        if(uploadBox.value != "") {
            if(uploadBox.value.length > 16)
                if(uploadBox.value.length < 36)
                    uploadStatus.innerHTML = "..." + uploadBox.value.slice(-4-(uploadBox.value.length-16));
                else uploadStatus.innerHTML = "..." + uploadBox.value.slice(-24);
            else uploadStatus.innerHTML = "..." + uploadBox.value.slice(-5);
        }
        else uploadStatus.innerHTML = "Browse";
    });

    let modal = document.getElementById("modal-section");
    let imgs = document.getElementsByClassName("preview-img");
    let modalImg = document.getElementById("modal-img");
    let modalTitle = document.getElementById("modal-title");
    let removeHidden = document.getElementById("remove-hidden");

    for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        img.addEventListener("click", () => {
            modal.style.display = "block";
            modalImg.src = img.src;
            modalTitle.innerHTML = img.alt;
            removeHidden.value = img.alt;
        });
     
    }

    let close = document.getElementById("close-modal");
    close.addEventListener("click", () => {
        modalImg.classList.add("modal-closing");
        setTimeout(()=> {
            modal.style.display = "none";
            modalImg.classList.remove("modal-closing");
        }, 240)
    });
    modal.addEventListener("click", () => {
        modalImg.classList.add("modal-closing");
        setTimeout(()=> {
            modal.style.display = "none";
            modalImg.classList.remove("modal-closing");
        }, 240)
    });
    modalImg.addEventListener("click", (ev) => {
        ev.stopPropagation();
    });
}