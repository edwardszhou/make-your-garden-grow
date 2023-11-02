window.onload = () => {
    console.log('running')

    let rightRootsCanv = new p5(rightRoots, 'right-roots-1');
    let leftRootsCanv, rightVinesCanv;

    let lineNum = 1;
    let divOffset = 0;
    
    if(document.getElementById("story-frame-6")) divOffset = 5;

    textFade();
    let fadeIn = setInterval(textFade, 3000)
    
    function textFade () {
        
        if(lineNum == 8) {
            clearInterval(fadeIn);
        }
        if(lineNum == 5) {
            leftRootsCanv = new p5(leftRoots, 'left-roots-1');
        }
        if(lineNum == 3) {
            rightVinesCanv = new p5(rightVines, 'right-vines-1');
        }
        let line;
        if(lineNum%2 == 0) {
            line = document.getElementsByClassName("story-line-2")[Math.floor(lineNum/2) - 1];
        } else {
            document.getElementById("story-frame-" + ((lineNum+1)/2 + divOffset)).scrollIntoView(true);
            line = document.getElementsByClassName("story-line-1")[Math.floor(lineNum/2)];
        }
        let opacity = 0;
        let lineFadeIn = setInterval(()=> {
            if(opacity >= 1) {
                clearInterval(lineFadeIn);
            }
            line.style.opacity = opacity;
            opacity += 0.01;
        }, 10);

        lineNum++;
        
        
    }

}