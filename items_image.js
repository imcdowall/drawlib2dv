//Copyright (c) 2009-2011, Ian McDowall
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

DRAWLIB.p_IMGLIST = {}; // List of images to track when they are loaded

// Extracts the last part of a path, after the last /
DRAWLIB.p_pathEnd = function(aString) {
    var slashIndex = aString.lastIndexOf('/');
    if (slashIndex >= 0) { return aString.slice(slashIndex+1); }
    return aString; // No slash so return the whole string
    };

/**
 * pic.createImage creates an image based drawing item and adds it to the
 * drawing item list.
 * The image is created on layer 0.
 *
 * @param id Item identifier
 * @param p_imgName The URL of the image to use
 * @param x X co-ordinate of the centre point
 * @param y Y co-ordinate of the centre point
 * @param winWidth Width of the rectangle in window units
 * @param winHeight Height of the rectangle in window units
 * @param angle the rotation clockwise in degrees
 * @return the created item
 */
DRAWLIB.m_createImage = function(id, imgName, x, y, winWidth, winHeight, angle) {
    // Derive from Rectangle
    var oneImg = this.createRect(id, x, y, winWidth, winHeight, angle);
    oneImg.p_type = 'I';
    oneImg.getStr = DRAWLIB.m_getStrImg;
    oneImg.p_fillStyle = '#000000'; // Not really but allows pick
    oneImg.p_imgName = imgName;
    var imgFileName = DRAWLIB.p_pathEnd(imgName);
    if (!DRAWLIB.p_IMGLIST[imgFileName]) { // Track unloaded images
        DRAWLIB.p_IMGLIST[imgFileName] = {"loaded":false};
        } 
    oneImg.p_Image = new Image();
    oneImg.p_Image.onload = DRAWLIB.p_onImageLoad;
    oneImg.p_Image.src = imgName;
    oneImg.doDrawImageWithOffset = DRAWLIB.m_doDrawImageWithOffset;
    oneImg.p_draw = DRAWLIB.p_drawImageItem;
    oneImg.drawOffset = DRAWLIB.m_drawOffsetImage;
    oneImg.setBoxes();
    return oneImg;
    };

DRAWLIB.m_getStrImg = function() { // Return JSON version of the object
    var itemStr = '{"t":"I","mx":'+this.p_midX+',"my":'+this.p_midY+
         ',"w":'+this.p_winWidth+',"h":'+this.p_winHeight+',"a":'+this.p_angle+
         ',"img":"'+this.p_imgName+'"';
    if (this.p_layer !== 0) { itemStr += ',"layer":'+this.p_layer; }
    if (this.p_z !== 0) { itemStr += ',"z":'+this.p_z; }
    //var connectors = this.getConnectors();
    //if (connectors) {
    //    itemStr += ',"connect":[';
    //    for (var i = 0 ; i < connectors.length ; i++ ) {
    //        itemStr += connectors[i]+',';
    //        }
    //    itemStr += ']';
    //    }
    itemStr += '}';
    return itemStr;
    };

DRAWLIB.p_onImageLoad = function() { // Must not try to draw until loaded
    var imgFileName = DRAWLIB.p_pathEnd(this.src);
    var thisImg = DRAWLIB.p_IMGLIST[imgFileName];
    if ( thisImg.loaded ) { return; } // Was already loaded
    thisImg.loaded = true; // Can safely draw from now on
    // Check for having loaded all images
    var somePending = false;
    for (var name in DRAWLIB.p_IMGLIST) {
        if (!DRAWLIB.p_IMGLIST[name].loaded) { 
            somePending = true;
            break;
            }
        }
    if (!somePending) {
        DRAWLIB.p_IMGINFO.redrawObj.redrawAll();
         }
    };

// Draw an image with an optional offset in canvas co-ords
DRAWLIB.m_doDrawImageWithOffset = function(ctxt, canvasWidth, window, 
    xOff, yOff) {
    // Don't draw if the image has not yet loaded
    var imgFileName = DRAWLIB.p_pathEnd(this.p_Image.src);
    if (!DRAWLIB.p_IMGLIST[imgFileName].loaded) {
        return;
        }
    this.p_pendingDraw = false;
    // If drawing on main window then check for our of view
    if (ctxt === this.p_pic.p_ctxt &&
        !DRAWLIB.p_isInWindow(this.p_pickBB, window)) { return; }
    var scale = this.p_pic.p_windowToCanvasContextScale(canvasWidth, window);
    var cMid = this.p_pic.p_windowToCanvasContextCoords(this.p_midX, this.p_midY,
                                                     canvasWidth, window);
    var winRot = this.p_pic.p_rotation;
    cMid[0] += xOff;
    cMid[1] += yOff;
    var canWidth = this.p_winWidth * scale;
    var canHeight = this.p_winHeight * scale;
    ctxt.save();
    ctxt.translate(cMid[0], cMid[1]);
    ctxt.rotate(this.p_radAngle-Math.PI*winRot*0.5);
    ctxt.translate(-cMid[0], -cMid[1]);
    ctxt.drawImage(this.p_Image, cMid[0]-canWidth/2, cMid[1]-canHeight/2,
                   canWidth, canHeight ); 
    ctxt.restore(); 
    };

DRAWLIB.p_drawImageItem = function(ctxt, canvasWidth, window) {
    this.doDrawImageWithOffset(ctxt, canvasWidth, window, 0, 0);
    };

// Offsets in canvas co-ords
DRAWLIB.m_drawOffsetImage = function(oldXOff, oldYOff, xOff, yOff, blank) {
    if (blank) { this.p_redrawOffset(oldXOff, oldYOff); } 
    this.doDrawImageWithOffset(this.p_pic.p_ctxt, this.p_pic.p_canvasWidth,
        this.p_pic.p_window, xOff, yOff);
    this.p_pic.p_redrawOneFrame();
    };

