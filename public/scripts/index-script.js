window.onload = () => {

    setTimeout(title1Fade, 500)
    setTimeout(titleGrowFade, 1000)
    setTimeout(linksFade, 2000)

    function title1Fade () {
        let title1 = document.getElementById("index-title1");
        let opacity = 0;
        let title1FadeIn = setInterval(()=> {
            if(opacity >= 1) {
                clearInterval(title1FadeIn);
            }
            title1.style.opacity = opacity;
            opacity += 0.01;
        }, 10);
    }

    function titleGrowFade () {
        let titleGrow = document.getElementById("index-title-grow");
        let opacity = 0;
        let size = 4;
        let titleGrowFadeIn = setInterval(()=> {
            if(opacity >= 1) {
                clearInterval(titleGrowFadeIn);
            }
            titleGrow.style.fontSize = size+'vw';
            titleGrow.style.opacity = opacity;
            opacity += 0.01;
            size += 0.04;
        }, 10);
    }
    function linksFade () {
        let links = document.getElementById("main-page-links");
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