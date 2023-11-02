window.onload = () => {

    // let music = document.getElementById("prelude-music")
    // music.play();

    setTimeout(paragraphFade, 1000)
    setTimeout(linksFade, 3000)

    function paragraphFade () {
        let para = document.getElementById("prelude-paragraph");
        let opacity = 0;
        let paraFadeIn = setInterval(()=> {
            if(opacity >= 1) {
                clearInterval(paraFadeIn);
            }
            para.style.opacity = opacity;
            opacity += 0.01;
        }, 10);
    }

    function linksFade () {
        let links = document.getElementById("prelude-continue");
        let opacity = 0;
        let linksFadeIn = setInterval(()=> {
            if(opacity >= 1) {
                clearInterval(linksFadeIn);
            }
            links.style.opacity = opacity;
            opacity += 0.01;
        }, 10);
    }
}