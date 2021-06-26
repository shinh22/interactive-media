// Main logic operator loop
window.addEventListener("load", function () {
    //get random image
    var baseImg = document.getElementById("base");
    var baseRImg = new Image();

    // flip the random image imported
    baseImg.onload = function () {
        flip(baseImg, baseRImg);
    }

    //create kaleidoscope after both original image and flipped one has loaded
    baseRImg.onload = function () {
        kaleidoscope(baseImg, baseRImg);
    }

    //image cash deactivator
    baseImg.src = baseImg.getAttribute("src")
     + "?t=" + new Date().getTime();
});

// kaleidoscope creator
function kaleidoscope(baseImg, baseRImg) {
    var c = document.getElementById("c");
    var ctx = c.getContext("2d");
    var pat = ctx.createPattern(baseImg, "repeat");
    var patR = ctx.createPattern(baseRImg, "repeat");
    var patDim = 150; //pattern is 150x150 square.
    var SqrtOf3_4 = Math.sqrt(3) / 2;

// height of triangle side given side length of 150 is:
    var height = SqrtOf3_4 * patDim;
    var offset = 0;
    ctx.translate(-0.5 * patDim, 0);

// aligning the grids(?) of the pattern
    var fn = function (alternateMode) {
        offset = (offset - 1) % 1024;
        var i = 0;

        //draw kaleidoscope first row.
        ctx.save();
        ctx.fillStyle = pat;
        ctx.translate(0, offset);

// move the image towards three different directions
        while (i <= 3) {
            ctx.beginPath();
            ctx.moveTo(0, -offset);
            ctx.lineTo(patDim, -offset);
            ctx.lineTo(0.5 * patDim, height - offset);
            ctx.closePath();
            ctx.fill();
            if (i % 3 == 0) {
                ctx.translate(patDim, -offset);
                ctx.rotate((-120 * Math.PI) / 180);
                ctx.translate(-patDim, offset);
            } else if (i % 3 == 1) {
                if (alternateMode) {
                    ctx.rotate((120 * Math.PI) / 180);
                    ctx.translate(-3 * patDim, 0);
                    ctx.rotate((-120 * Math.PI) / 180);
                }
                ctx.translate(0.5 * patDim, height - offset);
                ctx.rotate((-120 * Math.PI) / 180);
                ctx.translate(-0.5 * patDim, -height + offset);
            } else if (i % 3 == 2) {
                ctx.translate(0, -offset);
                ctx.rotate((-120 * Math.PI) / 180);
                ctx.translate(0, offset);
            }
            i++;
        }
        ctx.restore();
        ctx.save();
        ctx.scale(-1, -1);
        ctx.fillStyle = patR;
        ctx.translate(
            (-i + (i % 3 == 0 ? 0.5 : i % 3 == 1 ? 1.5 : -0.5)) * patDim,
            -height + offset
        );
        ctx.translate(0, -offset);
        ctx.rotate((120 * Math.PI) / 180);
        ctx.translate(0, offset);

        var j = 0;
        while (j < i + 1) {
            ctx.beginPath();
            if (j > 0 || !alternateMode) {
                ctx.moveTo(0, -offset);
                ctx.lineTo(patDim, -offset);
                ctx.lineTo(0.5 * patDim, height - offset);
                ctx.closePath();
                ctx.fill();
            }
            if (j % 3 == 1) {
                ctx.translate(patDim, -offset);
                ctx.rotate((-120 * Math.PI) / 180);
                ctx.translate(-patDim, offset);
            } else if (j % 3 == 2) {
                ctx.translate(0.5 * patDim, height - offset);
                ctx.rotate((-120 * Math.PI) / 180);
                ctx.translate(-0.5 * patDim, -height + offset);
            } else if (j % 3 == 0) {
                ctx.translate(0, -offset);
                ctx.rotate((-120 * Math.PI) / 180);
                ctx.translate(0, offset);
            }
            j++;
        }
        ctx.restore();
    };
    var patternHeight = Math.floor(SqrtOf3_4 * patDim * 2);
    var tile = function () {
        var rowData = ctx.getImageData(0, 0, patDim * 3, patternHeight);
        for (var i = 0; patternHeight * i < c.height + SqrtOf3_4 * patDim; i++) {
            for (var j = 0; j * patDim < c.width + patDim; j += 3) {
                ctx.putImageData(rowData, j * patDim, i * patternHeight);
            }
        }
    };

// animate the movement of image
    var tilingPatternData;
    var target = document.getElementById("target");
    window.setInterval(function () {
        fn(false);
        ctx.translate(1.5 * patDim, height);
        fn(true);
        ctx.translate(-1.5 * patDim, -height);
        tile();
    }, 1000 / 20);
}

// flip the random image
function flip(src, target) {
    var c = document.createElement("canvas");
    c.width = src.width;
    c.height = src.height;
    var ctx = c.getContext("2d");
    ctx.scale(-1, 1);
    ctx.drawImage(src, -src.width, 0);
    target.src = c.toDataURL();
}
