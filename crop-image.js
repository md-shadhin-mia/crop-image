function gcd(a, b) {
  return b == 0 ? a : gcd(b, a % b);
}

function cropImage(cavasEle, url, hight = 1, width = 1) {
  const ctx = cavasEle.getContext("2d");
  cavasEle.style.background = "black";
  const virsualCanvas = document.createElement("canvas");
  const vctx = virsualCanvas.getContext("2d");
  virsualCanvas.style.position = "fixed";
  virsualCanvas.style.background = "green";
  virsualCanvas.style.right = "0px";
  virsualCanvas.style.bottom = "0px";
  virsualCanvas.style.width = "20%";
  // document.body.appendChild(virsualCanvas);

  let image = new Image();
  let scrHight = window.innerHeight - 64;
  let scrWidth = window.innerWidth - 8;
  let canvasGcd = Math.min(scrHight, scrWidth);
  cavasEle.width = canvasGcd;
  cavasEle.height = canvasGcd;
  image.src = url;
  let GCD = 1;

  let imgMove = { 
      x: 0, 
      y: 0 
    };
  let maxMove = { 
      x: 0, 
      y: 0 
    };
  let minMove = { 
      x: 0, 
      y: 0 
    };
  let mouseDownKey = {
    unDown: 0,
    toImage: 1,
    toCropCanvas: 2,
    topLeft: 3,
    topRight: 4,
    bottomRight: 5,
    bottomLeft: 6,
  };
  let isMouseDown = mouseDownKey.unDown;
  let downPonter = { x: 0, y: 0 };
  let tempMove = { x: 0, y: 0 };
  let tempPoint = { x: 0, y: 0 };

  let cropMove = { x: canvasGcd / 4, y: canvasGcd / 4 };
  let cropAria = {
    x: canvasGcd / 4,
    y: canvasGcd / 4,
    h: canvasGcd / 2,
    w: canvasGcd / 2,
  };
  let cropMaxMove = { x: canvasGcd - cropAria.h, y: canvasGcd - cropAria.w };
  let cropCanvas = new Path2D();
  let boundBox = {
    topLeft: null,
    topRight: null,
    bottomRight: null,
    bottomLeft: null,
  };
  let bBPoint = {
    topLeft: { x: 0, y: 0 },
    topRight: { x: 0, y: 0 },
    bottomRight: { x: 0, y: 0 },
    bottomLeft: { x: 0, y: 0 },
  };
  let layerData;

  const imgLoadHanle = function () {
    GCD = canvasGcd / Math.min(image.width, image.height);
    maxMove.x = canvasGcd - image.width * GCD;
    maxMove.y = canvasGcd - image.height * GCD;
    virsualCanvas.width = cropAria.w / GCD;
    virsualCanvas.height = cropAria.h / GCD;
    //     bBPoint.topLeft = {x:cropAria.x, y:cropAria.y}
    // bBPoint.topRight = {x:cropAria.x + cropAria.w, y:cropAria.y}
    // bBPoint.bottomRight = {x:cropAria.x + cropAria.w, y:cropAria.y + cropAria.h}
    // bBPoint.bottomLeft = {x:cropAria.x, y:cropAria.y + cropAria.h}
    drow();
  };
  const drow = function () {
    ctx.clearRect(0, 0, canvasGcd, canvasGcd);
    bBPoint.topLeft = { 
        x: cropAria.x, 
        y: cropAria.y 
    };
    bBPoint.topRight = { 
        x: cropAria.x + cropAria.w, 
        y: cropAria.y 
    };
    bBPoint.bottomRight = {
      x: cropAria.x + cropAria.w,
      y: cropAria.y + cropAria.h,
    };
    bBPoint.bottomLeft = { x: cropAria.x, y: cropAria.y + cropAria.h };
    for (let i in bBPoint) {
      boundBox[i] = new Path2D();
      boundBox[i].arc(bBPoint[i].x, bBPoint[i].y, 12, 0, 2 * Math.PI);
    }
    cropCanvas = new Path2D();
    cropCanvas.ellipse(
      cropAria.x + cropAria.w / 2,
      cropAria.y + cropAria.h / 2,
      cropAria.w / 2,
      cropAria.h / 2,
      1,
      0,
      2 * Math.PI
    );
    ctx.rect(0, 0, canvasGcd, canvasGcd);
    ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fill(cropCanvas);
    layerData = ctx.getImageData(0, 0, canvasGcd, canvasGcd);
    ctx.clearRect(0, 0, canvasGcd, canvasGcd);
    ctx.putImageData(layerData, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      imgMove.x,
      imgMove.y,
      image.width * GCD,
      image.height * GCD
    );
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(cropAria.x, cropAria.y, cropAria.w, cropAria.h);

    ctx.fillStyle = "#00ff00";
    for (let i in bBPoint) {
      ctx.fill(boundBox[i]);
    }

    virsualCanvas.width = cropAria.w / GCD;
    virsualCanvas.height = cropAria.h / GCD;

    vctx.drawImage(
      image,
      cropAria.x / GCD - imgMove.x / GCD,
      cropAria.y / GCD - imgMove.y / GCD,
      cropAria.w / GCD,
      cropAria.h / GCD,
      0,
      0,
      cropAria.w / GCD,
      cropAria.h / GCD
    );
  };
  const chageCrop = function () {
    // cropAria = {x: bBPoint.topLeft.x, y:bBPoint.topLeft.y, w:bBPoint.bottomRight.x-bBPoint.topLeft.x, h:bBPoint.bottomRight.y - bBPoint.topLeft.y};
    cropMove = { 
        x: cropAria.x, 
        y: cropAria.y 
    };
    cropMaxMove = { 
        x: canvasGcd - cropAria.h, 
        y: canvasGcd - cropAria.w 
    };
  };
  const mouseDownHanle = function (event) {
    // console.log(event.offsetX, event.offsetY);
    downPonter.x = event.offsetX;
    downPonter.y = event.offsetY;
    if (ctx.isPointInPath(cropCanvas, event.offsetX, event.offsetY)) {
      tempMove.x = cropMove.x;
      tempMove.y = cropMove.y;
      isMouseDown = mouseDownKey.toCropCanvas;
    } else if (
      ctx.isPointInPath(boundBox.topLeft, event.offsetX, event.offsetY)
    ) {
      tempMove.x = bBPoint.topLeft.x;
      tempMove.y = bBPoint.topLeft.y;
      isMouseDown = mouseDownKey.topLeft;
    } else if (
      ctx.isPointInPath(boundBox.topRight, event.offsetX, event.offsetY)
    ) {
      tempMove.x = bBPoint.topRight.x;
      tempMove.y = bBPoint.topRight.y;
      isMouseDown = mouseDownKey.topRight;
      console.log("mouse down to topRight");
    } else if (
      ctx.isPointInPath(boundBox.bottomRight, event.offsetX, event.offsetY)
    ) {
      tempMove.x = bBPoint.bottomRight.x;
      tempMove.y = bBPoint.bottomRight.y;
      isMouseDown = mouseDownKey.bottomRight;
      console.log("mouse down to bottomRight");
    } else if (
      ctx.isPointInPath(boundBox.bottomLeft, event.offsetX, event.offsetY)
    ) {
      tempMove.x = bBPoint.bottomLeft.x;
      tempMove.y = bBPoint.bottomLeft.y;
      isMouseDown = mouseDownKey.bottomLeft;
      console.log("mouse down to bottomLeft");
    } else {
      tempMove.y = imgMove.y;
      tempMove.x = imgMove.x;
      isMouseDown = mouseDownKey.toImage;
    }
  };

  const mouseMoveHanle = function (event) {
    switch (isMouseDown) {
      case mouseDownKey.toImage:
        imgMove.x = tempMove.x + (event.offsetX - downPonter.x);
        if (imgMove.x < maxMove.x) {
          imgMove.x = maxMove.x;
        }
        if (imgMove.x > minMove.x) {
          imgMove.x = minMove.x;
        }

        imgMove.y = tempMove.y + (event.offsetY - downPonter.y);
        if (imgMove.y < maxMove.y) {
          imgMove.y = maxMove.y;
        }
        if (imgMove.y > minMove.y) {
          imgMove.y = minMove.y;
        }
        break;
      case mouseDownKey.toCropCanvas:
        cropMove.x = tempMove.x + (event.offsetX - downPonter.x);
        cropMove.y = tempMove.y + (event.offsetY - downPonter.y);
        if (cropMove.x < 0) {
          cropMove.x = 0;
        }
        if (cropMove.x > cropMaxMove.x) {
          cropMove.x = cropMaxMove.x;
        }
        if (cropMove.y < 0) {
          cropMove.y = 0;
        }

        if (cropMove.y > cropMaxMove.y) {
          cropMove.y = cropMaxMove.y;
        }
        cropAria.x = cropMove.x;
        cropAria.y = cropMove.y;
        break;
      case mouseDownKey.topLeft:
        tempPoint.x =
          tempMove.x +
          (event.offsetX - downPonter.x + (event.offsetY - downPonter.y)) / 2;
        tempPoint.y =
          tempMove.y +
          (event.offsetX - downPonter.x + (event.offsetY - downPonter.y)) / 2;
        if (tempPoint.x < 0) {
          tempPoint.x = 0;
        }
        if (tempPoint.x > bBPoint.bottomRight.x) {
          tempPoint.x = bBPoint.bottomRight.x;
        }
        if (tempPoint.y < 0) {
          tempPoint.y = 0;
        }
        if (tempPoint.y > bBPoint.bottomRight.y) {
          tempPoint.y = bBPoint.bottomRight.y;
        }
        bBPoint.topLeft.x = tempPoint.x;
        bBPoint.topLeft.y = tempPoint.y;

        cropAria.x = bBPoint.topLeft.x;
        cropAria.y = bBPoint.topLeft.y;
        cropAria.w = bBPoint.bottomRight.x - bBPoint.topLeft.x;
        cropAria.h = bBPoint.bottomRight.y - bBPoint.topLeft.y;
        // bBPoint.topLeft.y = tempPoint.y;
        chageCrop();
        break;
      case mouseDownKey.topRight:
        // tempPoint.x = tempMove.x + (event.offsetX - downPonter.x);
        // tempPoint.y = tempMove.y + (event.offsetY - downPonter.y);
        tempPoint.x =
          tempMove.x +
          (event.offsetX - downPonter.x - (event.offsetY - downPonter.y)) / 2;
        tempPoint.y =
          tempMove.y -
          (event.offsetX - downPonter.x - (event.offsetY - downPonter.y)) / 2;
        if (tempPoint.x < bBPoint.topLeft.x) {
          tempPoint.x = 0;
        }
        if (tempPoint.x > canvasGcd) {
          tempPoint.x = canvasGcd;
        }
        if (tempPoint.y < 0) {
          tempPoint.y = 0;
        }
        if (tempPoint.y > bBPoint.bottomRight.y) {
          tempPoint.y = bBPoint.bottomRight.y;
        }
        bBPoint.topRight.x = tempPoint.x;
        bBPoint.topRight.y = tempPoint.y;

        cropAria.x = bBPoint.bottomLeft.x;
        cropAria.y = bBPoint.topRight.y;
        cropAria.w = bBPoint.topRight.x - bBPoint.bottomLeft.x;
        cropAria.h = bBPoint.bottomLeft.y - bBPoint.topRight.y;
        // bBPoint.topLeft.y = tempPoint.y;
        chageCrop();
        break;
      case mouseDownKey.bottomRight:
        tempPoint.x =
          tempMove.x +
          (event.offsetX - downPonter.x + (event.offsetY - downPonter.y)) / 2;
        tempPoint.y =
          tempMove.y +
          (event.offsetX - downPonter.x + (event.offsetY - downPonter.y)) / 2;
        if (tempPoint.x < bBPoint.topLeft.x) {
          tempPoint.x = bBPoint.topLeft.x;
        }
        if (tempPoint.x > canvasGcd) {
          tempPoint.x = canvasGcd;
        }
        if (tempPoint.y < bBPoint.topLeft.y) {
          tempPoint.y = bBPoint.topLeft.y;
        }
        if (tempPoint.y > canvasGcd) {
          tempPoint.y = canvasGcd;
        }
        bBPoint.bottomRight.x = tempPoint.x;
        bBPoint.bottomRight.y = tempPoint.y;

        cropAria.x = bBPoint.topLeft.x;
        cropAria.y = bBPoint.topLeft.y;
        cropAria.w = bBPoint.bottomRight.x - bBPoint.topLeft.x;
        cropAria.h = bBPoint.bottomRight.y - bBPoint.topLeft.y;
        // bBPoint.topLeft.y = tempPoint.y;
        chageCrop();
        break;
      case mouseDownKey.bottomLeft:
        // tempPoint.x = tempMove.x + (event.offsetX - downPonter.x);
        // tempPoint.y = tempMove.y + (event.offsetY - downPonter.y);
        tempPoint.x =
          tempMove.x +
          (event.offsetX - downPonter.x - (event.offsetY - downPonter.y)) / 2;
        tempPoint.y =
          tempMove.y -
          (event.offsetX - downPonter.x - (event.offsetY - downPonter.y)) / 2;
        if (tempPoint.x < 0) {
          tempPoint.x = 0;
        }
        if (tempPoint.x > bBPoint.topRight.x) {
          tempPoint.x = bBPoint.topRight.x;
        }
        if (tempPoint.y < bBPoint.topRight.y) {
          tempPoint.y = bBPoint.topRight.y;
        }
        if (tempPoint.y > canvasGcd) {
          tempPoint.y = canvasGcd;
        }
        bBPoint.bottomLeft.x = tempPoint.x;
        bBPoint.bottomLeft.y = tempPoint.y;

        cropAria.x = bBPoint.bottomLeft.x;
        cropAria.y = bBPoint.topRight.y;
        cropAria.w = bBPoint.topRight.x - bBPoint.bottomLeft.x;
        cropAria.h = bBPoint.bottomLeft.y - bBPoint.topRight.y;
        chageCrop();
        break;
      default:
        break;
    }
    if (cropAria.w != cropAria.h) {
      cropAria.w = cropAria.h = Math.min(cropAria.w, cropAria.h);
    }
    // console.log(`Y move to : ${ymove}`);
    drow();
  };

  const mouseUpHanle = function (event) {
    if (isMouseDown) {
      // console.log(event.offsetX-downPonter.x, event.offsetY-downPonter.y);
      downPonter.x = 0;
      downPonter.y = 0;
      isMouseDown = mouseDownKey.unDown;
    }
  };

  const imageSave = function (blob){
      let imgurl = URL.createObjectURL(blob);
      window.open(imgurl);
  }
  document.querySelector("#save").addEventListener("click", ()=>virsualCanvas.toBlob(imageSave, "image/jpeg"));
  cavasEle.addEventListener("mousedown", mouseDownHanle);
  cavasEle.addEventListener("mousemove", mouseMoveHanle);
  cavasEle.addEventListener("mouseup", mouseUpHanle);
  cavasEle.addEventListener("mouseleave", mouseUpHanle);
  image.addEventListener("load", imgLoadHanle);
}
