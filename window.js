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
// All methods should be created as members of this.

/**
 * pic.getRotation returns the current picture rotation.
 *
 * @return rotation clockwise in units of 90 degrees
 */
DRAWLIB.m_getRotation = function() { return this.p_rotation; };

/**
 * pic.setRotation rotates the window relative to the canvas.
 * 
 * @param rotation is the position to rotate clockwise in units of 90 degrees
 */
DRAWLIB.m_setRotation = function( rotation ) {
    if (rotation < 0 || rotation > 3) { return; }
    // Remember the scale and mid-point
    var xMid = this.p_window[0] + this.p_window[2]*0.5;
    var yMid = this.p_window[1] + this.p_window[3]*0.5;
    var scale;
    if (this.p_rotation === 0 || this.p_rotation === 2) {
        scale = this.p_window[2] / this.p_canvasWidth;
        }
    else {
        scale = this.p_window[3] / this.p_canvasWidth;
        }
    this.p_rotation = rotation;
    var xWid, yHgt;
    // reset window dimensions to same scale
    if ( rotation === 0 || rotation === 2) {
        xWid = this.p_canvasWidth * scale;
        yHgt = this.p_canvasHeight * scale;
        }
    else {
        xWid = this.p_canvasHeight * scale;
        yHgt = this.p_canvasWidth * scale;
        }
    this.setWindow( xMid-(xWid*0.5), yMid-(yHgt*0.5), xWid, yHgt );
    };

/**
 * pic.setWindow sets how much of the window is shown in the canvas.
 * It allows panning and zooming. The amount shown may be increased,
 * if necessary, to avoid skewing.
 *
 * @param minX Minimum X co-ordinate
 * @param minY Minimum Y co-ordinate
 * @param width Window width
 * @param height Window height
 */
DRAWLIB.m_setWindow = function(minX, minY, width, height) {
   var wb = this.p_windowBoundary;
    // Set scale to minimum of X and Y
    // This may get revised if we need to scale up to avoid showing
    // anything beyond the allowed area
    var scaleX, scaleY, scale, minScaleX, minScaleY;
    if (this.p_rotation === 0 || this.p_rotation === 2) {
        scaleX = width / this.p_canvasWidth;
        scaleY = height / this.p_canvasHeight;
        scale = Math.min(scaleX, scaleY);
        if (this.p_windowBoundary) { // Check if we need to scale up
            minScaleX = this.p_windowBoundary[2] / this.p_canvasWidth;
            minScaleY = this.p_windowBoundary[3] / this.p_canvasHeight;
            scale = Math.min(scale, minScaleX, minScaleY);
            }
        height = Math.round(scale * this.p_canvasHeight);
        width = Math.round(scale * this.p_canvasWidth);
        }
    else {
        scaleX = width / this.p_canvasHeight;
        scaleY = height / this.p_canvasWidth;
        scale = Math.min(scaleX, scaleY);
        if (this.p_windowBoundary) { // Check if we need to scale up
            minScaleX = this.p_windowBoundary[2] / this.p_canvasHeight;
            minScaleY = this.p_windowBoundary[3] / this.p_canvasWidth;
            scale = Math.min(scale, minScaleX, minScaleY);
            }
        height = Math.round(scale * this.p_canvasWidth);
        width = Math.round(scale * this.p_canvasHeight);
        }
    // Check within boundary
    if (this.p_windowBoundary) {
        if(minX<this.p_windowBoundary[0]) { minX = this.p_windowBoundary[0]; }
        if(minY<this.p_windowBoundary[1]) { minY = this.p_windowBoundary[1]; }
        if(width>this.p_windowBoundary[2]){ width = this.p_windowBoundary[2]; }
        if(height>this.p_windowBoundary[3]){ height = this.p_windowBoundary[3];}
        if(minX+width > this.p_windowBoundary[0]+this.p_windowBoundary[2]) {
            minX = this.p_windowBoundary[0] + this.p_windowBoundary[2] - width;
            }
        if(minY+height > this.p_windowBoundary[1]+this.p_windowBoundary[3]) {
            minY = this.p_windowBoundary[1] + this.p_windowBoundary[3] - height;
            }
        }
    this.p_window = [minX, minY, width, height];
    };

/**
 * pic.setWindowWithResize sets how much of the window is shown in the canvas.
 * It allows panning and zooming. The amount shown may be increased,
 * if necessary, to avoid skewing.
 * It may shrink the canvas to show more without skewing.
 *
 * @param minX Minimum X co-ordinate
 * @param minY Minimum Y co-ordinate
 * @param width Window width
 * @param height Window height
 */
DRAWLIB.m_setWindowWithResize = function(minX, minY, width, height) {
    var wb = this.p_windowBoundary;
    var mcWidth = this.p_maxCanvasWidth;
    var mcHeight = this.p_maxCanvasHeight;
//alert("swwr max canvas "+mcWidth+','+mcHeight+"param w,h="+width+','+height);
    var scaleX, scaleY, scale;
    // Normalise width & height against windowBoundary if necessary
    // Then calculate separate scales in X and Y based on maximum canvas
    // dimension. Choose the larger scale (that will show the greater
    // amount of the window) and then adjust the width and height for the
    // window and the canvas accordingly.
    var width2 = width;
    var height2 = height;
    if (wb) { 
        width2 = Math.min(width, wb[2]);
        height2 = Math.min(height, wb[3]);
        }
    if (this.p_rotation === 0 || this.p_rotation === 2) {
        scaleX = width2 / mcWidth;
        scaleY = height2 / mcHeight;
        scale = Math.max(scaleX, scaleY);
        height = Math.round(scale * mcHeight);
        width = Math.round(scale * mcWidth);
        }
    else { // Rotated through 90 or 270 degrees
        scaleX = width2 / mcHeight;
        scaleY = height2 / mcWidth;
        scale = Math.max(scaleX, scaleY);
        height = Math.round(scale * mcWidth);
        width = Math.round(scale * mcHeight);
        }
    // Check within boundary, we may need to truncate move the minimum point
    if (wb) {
        if(minX<wb[0]) { minX = wb[0]; }
        if(minY<wb[1]) { minY = wb[1]; }
        if(width>wb[2]){ width = wb[2]; }
        if(height>wb[3]){ height = wb[3];}
        if(minX+width > wb[0]+wb[2]) {
            minX = wb[0] + wb[2] - width;
            }
        if(minY+height > wb[1]+wb[3]) {
            minY = wb[1] + wb[3] - height;
            }
        }
    // Now set the window and also reset the canvas dimensions.
    // Note that resetting the canvas will blank it and require a redraw
    this.p_window = [minX, minY, width, height];
    if (this.p_rotation === 0 || this.p_rotation === 2) {
        this.p_canvasWidth = Math.floor(width / scale);
        this.p_canvasHeight = Math.floor(height / scale);
        } else {
        this.p_canvasWidth = Math.floor(height / scale);
        this.p_canvasHeight = Math.floor(width / scale);
    }
    this.p_canvas.width = this.p_canvasWidth;
    this.p_canvas.height = this.p_canvasHeight;
//alert("swwr win "+minX+','+minY+' '+width+','+height+' cw='+this.p_canvasWidth+','+this.p_canvasHeight);
    };

/**
 * pic.setWindowBoundary sets the maximum dimensions of the window.
 * Once this is set, zooming or panning cannot move beyond these boundaries.
 * If the window boundary is not set then zooming or panning are not
 * constrained.
 *
 * @param minX Minimum X co-ordinate
 * @param minY Minimum Y co-ordinate
 * @param width Window width
 * @param height Window height
 */
DRAWLIB.m_setWindowBoundary = function(minX, minY, width, height) {
    // Set boundaries for a drawing surface, cannot zoom or pan past this
    this.p_windowBoundary = [minX, minY, width, height];
    // Ensure that we are only viewing within the boundary
    var win = this.p_window;
    this.setWindow(win[0], win[1], win[2], win[3]);
    // rReset the QuadTree of items
    //this.QT.clear();
    //delete this.QT;
    //this.QT = createQTNode( minX, minY, minX+width, minY+width, 0, 4, this);
    //for (var id in this.items) { this.QT.insertInto(this.items[id]); }
    };

/**
 * pic.getWindowBoundary returns the maximum dimensions of the window.
 *
 * return undefined or a 4 element array, min X, min Y, width, height
 */
DRAWLIB.m_getWindowBoundary = function() {
    if (!this.p_windowBoundary) { return undefined; }
    return [this.p_windowBoundary[0], this.p_windowBoundary[1],
            this.p_windowBoundary[2], this.p_windowBoundary[3]];
    };

/**
 * pic.resetCanvasDimensions sets the canvas size and page.
 * It should be called initially and whenever the browser window is re-sized.
 * It appears to work better when the canvas is placed absolutely.
 */
DRAWLIB.m_resetCanvasDimensions = function(canvasWidth, canvasHeight) {
    var obj = this.p_canvas;
    obj.width = canvasWidth;
    obj.height = canvasHeight;
    this.p_canvasWidth = obj.width;
    this.p_canvasHeight = obj.height;
    this.p_maxCanvasWidth = obj.width;
    this.p_maxCanvasHeight = obj.height;
    obj.style.top = "0px";
    var curleft = 0;
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
            obj = obj.offsetParent;
            } while (obj);
        }
    this.p_canvasOffset = [curleft, curtop];
    };

/**
 * pic.zoomIn shrinks the current window. It halves the width and height
 * while keeping the centre point.
 */
DRAWLIB.m_zoomIn = function() {
    var midX = this.p_window[0]+this.p_window[2]/2;
    var midY = this.p_window[1]+this.p_window[3]/2;
    var wid = this.p_window[2]/2;
    var hgt = this.p_window[3]/2;
    this.setWindow(midX-wid/2, midY-hgt/2, wid, hgt);
    this.redrawAll();
    };

/**
 * pic.zoomout expands the current window. It doubles the width and height
 * while trying to keep the centre point. However, the window dimensions and
 * centre may be constrained if a window boundary has been set.
 */
DRAWLIB.m_zoomOut = function() {
    var midX = this.p_window[0]+this.p_window[2]/2;
    var midY = this.p_window[1]+this.p_window[3]/2;
    var wid = this.p_window[2]*2;
    var hgt = this.p_window[3]*2;
    this.setWindow(midX-wid/2, midY-hgt/2, wid, hgt);
    this.redrawAll();
    };

/**
 * pic.pan moves the window centre while leaving the width and height
 * unchanged.
 * The new dimensions may be constrained if a window boundary has been set.
 *
 * @param direction The direction to pan in:
 * 0 = pan right
 * 1 = pan down
 * 2 = pan left
 * 3 = pan up
 */
DRAWLIB.m_panPic = function( direction ) {
    direction += this.p_rotation;
    if (direction < 0) { direction += 4; }
    if (direction > 3) { direction -= 4; }
    var midX, midY;
    var wid = this.p_window[2];
    var hgt = this.p_window[3];
    if (direction === 0) { // pan right
        midX = this.p_window[0]+this.p_window[2];
        midY = this.p_window[1]+this.p_window[3]/2;
        }
    else if (direction === 1) { // pan down
        midX = this.p_window[0]+this.p_window[2]/2;
        midY = this.p_window[1]+this.p_window[3];
        }
    else if (direction === 2) { // pan left
        midX = this.p_window[0];
        midY = this.p_window[1]+this.p_window[3]/2;
        }
    else if (direction === 3) { // pan up
        midX = this.p_window[0]+this.p_window[2]/2;
        midY = this.p_window[1];
        }
    else { return; } // Bad direction
    this.setWindow(midX-wid/2, midY-hgt/2, wid, hgt);
    this.redrawAll();
    };

/**
 * pic.panRight pans the picture to the right within the window boundaries.
 */
DRAWLIB.m_panRight = function() { this.panPic(0); };

/**
 * pic.panLeft pans the picture to the left within the window boundaries.
 */
DRAWLIB.m_panLeft = function() { this.panPic(2); };

/**
 * pic.panup pans the picture upwards within the window boundaries.
 */
DRAWLIB.m_panUp = function() { this.panPic(3); };

/**
 * pic.panDown pans the picture downwards within the window boundaries.
 */
DRAWLIB.m_panDown = function() { this.panPic(1); };

/**
 * pic.panToCentre pans the picture to have a specified centre.
 * This may be moved to keep within the window boundary
 *
 * @param midX X co-ord of new centre
 * @param midY Y co-ord of new centre
 */
DRAWLIB.m_panToCentre = function( midX, midY ) {
    var wid, hgt;
    wid = this.p_window[2];
    hgt = this.p_window[3];
    this.setWindow(midX-wid/2, midY-hgt/2, wid, hgt);
    this.redrawAll();
    };

