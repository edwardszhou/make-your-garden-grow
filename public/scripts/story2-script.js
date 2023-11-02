window.onload = () => {
    let lineNum = 1;
    var globalCanvInc = 0;
    
    let leftTree;
    let flowers = []

    textFade();
    let fadeIn = setInterval(textFade, 3000)
    
    function textFade () {
        
        if(lineNum == 5) {
            leftTree = new p5(fractalTree, 'flower-sketches')
        }
        if(lineNum == 8) {
            clearInterval(fadeIn);
        }
        let line;
        if(lineNum%2 == 0) {
            line = document.getElementsByClassName("story-line-2")[Math.floor(lineNum/2) - 1];
        } else {
            document.getElementById("story-frame-" + ((lineNum+1)/2 + 5)).scrollIntoView(true);
            line = document.getElementsByClassName("story-line-1")[Math.floor(lineNum/2)];
            flowers.push(new p5(rootsSpread, 'flower-sketches'));
            initializeCanvas(flowers[flowers.length-1]);
            if(lineNum == 3 || lineNum == 7) {
                flowers.push(new p5(rootsSpread, 'flower-sketches'));
                initializeCanvas(flowers[flowers.length-1]);
            }
            globalCanvInc+= 1.25;
            
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

    function initializeCanvas(sketch) {
        let randCanvSize = 300 + Math.floor(Math.random()*4)*100
        canvas = sketch.createCanvas(randCanvSize, randCanvSize);
        let randCanvPosX = Math.floor(Math.random()*(sketch.windowWidth-sketch.width))
        let randCanvPosY = Math.floor(Math.random()*(sketch.windowHeight-sketch.height))
        canvas.position(randCanvPosX, randCanvPosY + globalCanvInc * sketch.windowHeight);
        canvas.style('z-index','5')
        sketch.frameRate(60)
    }

}