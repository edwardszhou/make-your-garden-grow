window.onload = () => {
    let volumeOn = true;
    let volume = document.getElementById("home-volume");

    let action = document.getElementById("home-action");
    volume.addEventListener("click", ()=> {
        if(volumeOn) {
            volume.innerHTML = "Volume Off ✕";
            volume.style.color = "white"
            action.href = "/prelude?volume=off"
        } else {
            volume.innerHTML = "Volume On ✓";
            volume.style.color = "rgb(214,255,164)"
            action.href = "/prelude?volume=on"
        }
        volumeOn = !volumeOn;

    })
}