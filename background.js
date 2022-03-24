//Copyright (c) 2009-2020, Ian McDowall
//All rights reserved.
//
//Redistribution and use in source and binary forms, with or without 
//modification, are permitted provided that the following conditions are met:
//
//    * Redistributions of source code must retain the above copyright notice,
//      this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

/**
 * pic.addBackground adds an image for use as background
 * The image is not considered to exist on any layer, it lies behind them all
 *
 * @param p_imgName The URL of the image to use
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @return the created item
 */
DRAWLIB.m_addBackground = function(imgName, width, height) {
    // Derive from Rectangle
    var oneImg = {'p_imgName':imgName, 'p_width':width, 'p_height':height};
    oneImg.getStr = DRAWLIB.m_getStrBack;
    var imgFileName = DRAWLIB.p_pathEnd(imgName);
    if (!DRAWLIB.p_IMGLIST[imgFileName]) { // Track unloaded images
        DRAWLIB.p_IMGLIST[imgFileName] = {"loaded":false};
        } 
    oneImg.p_Image = new Image();
    oneImg.p_Image.onload = DRAWLIB.p_onImageLoad;
    oneImg.p_Image.src = imgName;
    oneImg.draw = DRAWLIB.m_doDrawBack;
    oneImg.drawBackgroundCanvasSect = DRAWLIB.m_doDrawBackgroundCanvasSect;
    oneImg.p_pic = this;
    this.p_backgroundImage = oneImg;
    };

DRAWLIB.p_mkImgPart = function(imgName) {
    var imgFileName = DRAWLIB.p_pathEnd(imgName);
    if (!DRAWLIB.p_IMGLIST[imgFileName]) {
	DRAWLIB.p_IMGLIST[imgFileName] = {"loaded":false};
	} 
    var img = new Image();
    img.onload = DRAWLIB.p_onImageLoad;
    img.src = imgName;
    return img;
}

/**
 * pic.addBackground4 adds a set of images for use as background
 * The image is not considered to exist on any layer, it lies behind them all
 *
 * @param id Item identifier
 * @param width Width of the image in pixels
 * @param height Height of the image in pixels
 * @param p_imgName0 The URL of the image to use in 0 rotation
 * @param p_imgName1 The URL of the image to use in 1 rotation
 * @param p_imgName2 The URL of the image to use in 2 rotation
 * @param p_imgName3 The URL of the image to use in 3 rotation
 * @return the created item
 */
DRAWLIB.m_addBackground4 = function(width, height, imgName0, imgName1, imgName2, imgName3) {
    var oneImg = {'p_imgName':imgName0, 'p_width':width, 'p_height':height};
    oneImg.p_ImageSet = [
        DRAWLIB.p_mkImgPart(imgName0),
        DRAWLIB.p_mkImgPart(imgName1),
        DRAWLIB.p_mkImgPart(imgName2),
        DRAWLIB.p_mkImgPart(imgName3)];
    oneImg.draw = DRAWLIB.m_doDrawBack4;
    oneImg.drawBackgroundCanvasSect = DRAWLIB.m_doDrawBackgroundCanvasSect;
    oneImg.p_pic = this;
    this.p_backgroundImage4 = oneImg;
    };

//TODO extend for back4
DRAWLIB.m_getStrBack = function() { // Return JSON version of the object
    var itemStr = '{"t":"BK","wid":'+this.p_width+',"ht":'+this.p_height+
         ',"img":"'+this.p_imgName+'"}';
    return itemStr;
    };

// Draw a background image to fill the canvas, zoomed appropriately
// TODO allow picture rotation
DRAWLIB.m_doDrawBack = function(ctxt, canvasWidth, canvasHeight, window) {
    // Don't draw if the image has not yet loaded
    var imgFileName = DRAWLIB.p_pathEnd(this.p_Image.src);
    if (!DRAWLIB.p_IMGLIST[imgFileName].loaded) {
        alert("returning because not yet loaded");
        return;
        }
    this.p_pendingDraw = false;

    var pic = this.p_pic;
    var winRot = pic.p_rotation;
    ctxt.save();
    ctxt.translate(canvasWidth/2, canvasHeight/2);
    ctxt.rotate(-Math.PI*winRot*0.5);
    ctxt.translate(-canvasWidth/2, -canvasHeight/2);

    // p_windowBoundary is the original window boundary - it is fixed and should
    // match the background. it does not change if we zoom, pan or rotate.
    // it is minx, miny, width, height
    var wb = pic.p_windowBoundary;
    // Work out the image section based on rotation
    var icSect = [0, 0];
    if (winRot == 0 || winRot == 2) {
        var iwScale = this.p_width / wb[2] ;
        var iTL = [ iwScale * window[0], iwScale * window[1] ];
        // icScale is the number of image pixels per canvas pixel
        var icScale =  (canvasWidth / this.p_width) * (wb[2]) / (window[2]) ;
        iSect = [ canvasWidth/icScale, canvasHeight/icScale];
        //alert("Window boundary "+wb[0]+","+wb[1]+" "+wb[2]+","+wb[3]+
        //    " viewport window "+window[0]+","+window[1]+" "+window[2]+","+window[3]+
        //    " canvas "+canvasWidth+","+canvasHeight);
        // DEBUG
        //alert(
        //    " image size="+this.p_width+","+this.p_height+" icScale="+icScale+
        //    " Image section "+iTL[0]+","+iTL[1]+" "+iSect[0]+","+iSect[1]);
        ctxt.drawImage(this.p_Image, 
            iTL[0], iTL[1], iSect[0], iSect[1],
            0, 0, canvasWidth, canvasHeight);
        } else {
        var iwScale = this.p_height / wb[2] ;
        var iTL = [ iwScale * window[1], iwScale * window[0] ];
        // icScale is the number of image pixels per canvas pixel
        var icScale =  (canvasWidth / this.p_height) * (wb[2]) / (window[2]) ;
        iSect = [ canvasHeight/icScale, canvasWidth/icScale];
        //DEBUG
        //alert("Window boundary "+wb[0]+","+wb[1]+" "+wb[2]+","+wb[3]+
        //    " viewport window "+window[0]+","+window[1]+" "+window[2]+","+window[3]+
        //    " canvas "+canvasWidth+","+canvasHeight);
        //alert(
        //    " image size="+this.p_width+","+this.p_height+" icScale="+icScale+
        //    " Image section "+iTL[0]+","+iTL[1]+" "+iSect[0]+","+iSect[1]);
        ctxt.drawImage(this.p_Image, 
            iTL[0], iTL[1], iSect[0], iSect[1],
            0, 0, canvasWidth, canvasHeight);
        }
    ctxt.restore(); 
    };

// Draw a background image to fill the canvas, zoomed appropriately
DRAWLIB.m_doDrawBack4 = function(ctxt, canvasWidth, canvasHeight, window) {
    var pic = this.p_pic;
    var winRot = pic.p_rotation;
    var wb = pic.p_windowBoundary;
    // Don't draw if the image has not yet loaded
    var imgFileName = DRAWLIB.p_pathEnd(this.p_ImageSet[winRot].src);
    if (!DRAWLIB.p_IMGLIST[imgFileName].loaded) {
        alert("returning because not yet loaded");
        return;
        }
    this.p_pendingDraw = false;

    // Work out the image section based on rotation
    // ori is the location of the top left point but allowing for rotation
    var ori = [0, 0]
    // iTL is the origin of the displayed section of the image in image pixels
    var iTL = [0, 0];
    // iSect is the dimensions of the displayed section of the image in image pixels
    var iSect = [0, 0];
    if (winRot == 0 || winRot == 2) {
        if (winRot == 0) {
        ori = [window[0], window[1]];
        } else { // 180 degrees
        ori = [wb[2] - (window[0] + window[2]),
               wb[3] - (window[1] + window[3])]
        }
        iTL = [ Math.floor((ori[0] / wb[2]) * this.p_width), 
                Math.floor((ori[1] / wb[2]) * this.p_width)];
        // icScale is the number of image pixels per canvas pixel
        var icScale = (this.p_width / canvasWidth) / (wb[2] / window[2]);
        iSect = [ Math.floor(canvasWidth * icScale), 
                  Math.floor(canvasHeight * icScale)];
    } else { // Rotation 1 or 3
        if (winRot == 1) { // 90 degrees anti-clockwise
          ori = [ window[1], wb[2] - (window[0] + window[2])];
        } else { // 90 degrees clockwise
          ori = [ wb[3] - (window[1] + window[3]), window[0]];
        }
        iTL = [ Math.floor((ori[0] / wb[3]) * this.p_height), 
                Math.floor((ori[1] / wb[3]) * this.p_height)];
        // icScale is the number of image pixels per canvas pixel
        var icScale = (this.p_height / canvasWidth) / (wb[2] / window[2]);
        iSect = [ Math.floor(canvasWidth * icScale),
                  Math.floor(canvasHeight * icScale)];
    }
    //alert("Rotation "+winRot+
    //    " Window boundary "+wb[0]+","+wb[1]+" "+wb[2]+","+wb[3]+
    //    " Supplied window "+window[0]+","+window[1]+" "+window[2]+","+window[3]+
    //    " canvas "+canvasWidth+","+canvasHeight+
    //    " this width+height "+this.p_width+","+this.p_height+
    //    " image size="+this.p_width+","+this.p_height+" icScale="+icScale+
    //    " Image section "+iTL[0]+","+iTL[1]+" "+iSect[0]+","+iSect[1])
    ctxt.drawImage(this.p_ImageSet[winRot], 
        iTL[0], iTL[1], iSect[0], iSect[1],
        0, 0, canvasWidth, canvasHeight);
    };

// Draw a section of the image for a section of the canvas
DRAWLIB.m_doDrawBackgroundCanvasSect = function(cBB) {
    // Don't draw if the image has not yet loaded
    var imgFileName = DRAWLIB.p_pathEnd(this.p_Image.src);
    if (!DRAWLIB.p_IMGLIST[imgFileName].loaded) {
        alert("returning because not yet loaded");
        return;
        }
    this.p_pendingDraw = false;

    var pic = this.p_pic;
    var ctxt = pic.p_canvas.getContext("2d");
    var wb = pic.p_windowBoundary;
    var win = pic.p_window;
    // Work out what proportion of the image will be viewable
    // The scale is based on the full window viewport but only a
    // section will be redrawn
    // We need to calculate the TL of the section in window co-ords
    var wTL = pic.p_canvasToWindowCoords(cBB[0], cBB[1]);
    // And then convert it to image co-ords
    // This assumes that the window origin matches the image origin
    var iwScale = this.p_width / wb[2] ;
    var iTL = [ wTL[0]*iwScale, wTL[1]*iwScale ];
    // icScale is the number of image pixels per canvas pixel
    var icScale =  (pic.p_canvas.width * wb[2]) / (win[2] * this.p_width) ;
    var iSect = [ (cBB[2]+1-cBB[0])/icScale, (cBB[3]+1-cBB[1])/icScale ];
    //
    var dbgstr = "wb[2]="+wb[2]+" win[2]="+win[2]+" img width="+this.p_width+" canvas width="+pic.p_canvas.width+
    " wtl="+wTL[0]+","+wTL[1]+" itl="+iTL[0]+","+iTL[1]+"\n"+
    " Canvas rect "+cBB[0]+","+cBB[1]+","+cBB[2]+","+cBB[3]+
    " icscale="+icScale+" iwScale="+iwScale+"\n"+
    " Image rect "+iTL[0]+","+iTL[1]+" "+iSect[0]+","+iSect[1];
    //alert(dbgstr);
    ctxt.drawImage(this.p_Image, 
        iTL[0], iTL[1], iSect[0], iSect[1],
        cBB[0], cBB[1], cBB[2]+1-cBB[0], cBB[3]+1-cBB[1]);
    };
