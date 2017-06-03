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

/**
 * pic.pageToCanvasCoords converts page co-ordinates to canvas co-ordinates
 *
 * @param pX X co-ordinates on the page
 * @param pY Y co-ordinate on the page
 * @return 2-element array of X and Y canvas co-ordinates.
 */
DRAWLIB.m_pageToCanvasCoords = function(pX, pY) {
    pX -= this.p_canvasOffset[0];
    pY -= this.p_canvasOffset[1];
    return [pX, pY];
    };

DRAWLIB.p_canvasToWindowCoords = function(pX, pY) {
    var scale, winX, winY;
    if (this.p_rotation === 0) {
        scale = this.p_window[2] / this.p_canvasWidth;
        winX = Math.round(scale * pX) ;
        winY = Math.round(scale * pY) ;
        }
    else if(this.p_rotation === 1) {
        scale = this.p_window[3] / this.p_canvasWidth;
        winX = Math.round(scale * (this.p_canvasHeight -pY));
        winY = Math.round(scale * pX);
        }
    else if(this.p_rotation === 2) {
        scale = this.p_window[2] / this.p_canvasWidth;
        winX = Math.round(scale * (this.p_canvasWidth - pX));
        winY = Math.round(scale * (this.p_canvasHeight- pY));
        }
    else if(this.p_rotation === 3) {
        scale = this.p_window[3] / this.p_canvasWidth;
        winX = Math.round(scale * pY);
        winY = Math.round(scale * (this.p_canvasWidth - pX));
        }
    return [this.p_window[0] + winX, this.p_window[1] + winY];
    };

/**
 * pic.pageToWindowCoords converts page co-ordinates to window co-ordinates
 *
 * @param pX X co-ordinates on the page
 * @param pY Y co-ordinate on the page
 * @return 2-element array of X and Y window co-ordinates.
 */
DRAWLIB.m_pageToWindowCoords = function(pX, pY) {
    pX -= this.p_canvasOffset[0];
    pY -= this.p_canvasOffset[1];
    return this.p_canvasToWindowCoords( pX, pY );
    };

/**
 * pic.canvasToWindowRect converts canvas co-ordinates to window co-ordinates
 *
 * @param xMin Min X co-ord
 * @param yMin Min Y co-ord
 * @param xMax Max X co-ord
 * @param yMax Max Y co-ord
 *
 * @return 4-element array in window coords [minX, minY, maxX, maxY]
 */
DRAWLIB.m_canvasToWindowRect = function(pXMin, pYMin, pXMax, pYMax) {
    var wMin = this.p_canvasToWindowCoords( pXMin, pYMin );
    var wMax = this.p_canvasToWindowCoords( pXMax, pYMax );
    return [wMin[0], wMin[1], wMax[0], wMax[1]];
    };

/** pic.canvasToWindowOffset converts an X and Y offset from canvas into 
 * window co-ordinates.
 *
 * @param pX X co-ordinate of the offset
 * @param pY Y co-ordinate of the offset
 * @return 2-element array with X and Y co-ordinates of the offset
 */
DRAWLIB.m_canvasToWindowOffset = function(pX, pY) {
    var scale, winX, winY;
    if (this.p_rotation === 0) {
        scale = this.p_window[2] / this.p_canvasWidth;
        winX = Math.round(scale * pX) ;
        winY = Math.round(scale * pY) ;
        }
    else if(this.p_rotation === 1) {
        scale = this.p_window[3] / this.p_canvasWidth;
        winX = -Math.round(scale * pY);
        winY = Math.round(scale * pX);
        }
    else if(this.p_rotation === 2) {
        scale = this.p_window[2] / this.p_canvasWidth;
        winX = -Math.round(scale * pX);
        winY = -Math.round(scale * pY);
        }
    else if(this.p_rotation === 3) {
        scale = this.p_window[3] / this.p_canvasWidth;
        winX = Math.round(scale * pY);
        winY = -Math.round(scale * pX);
        }
    return [winX, winY];
    };

/**
 * pic.windowToCanvasScale returns a scale factor to go between window
 * co-ordinates and canvas co-ordinates.
 *
 * @return scale factor
 */
DRAWLIB.m_windowToCanvasScale = function() {
    return this.p_windowToCanvasContextScale( this.p_canvasWidth,
                                                 this.p_window);
    };

/**
 * pic.windowToCanvasCoords is given X and Y co-ordinates in 
 * window co-ordinates and returns them in canvas co-ordinates.
 *
 * @param wX X co-ordinate
 * @param wY Y co-ordinate
 * @return 2 element array, X, Y in canvas co-ords
 */
DRAWLIB.m_windowToCanvasCoords = function(wX, wY) {
    return this.p_windowToCanvasContextCoords( wX, wY, this.p_canvasWidth,
                                                  this.p_window);
    };

DRAWLIB.p_windowToPageCoords = function(wX, wY) {
    var cPoint = this.windowToCanvasCoords( wX, wY );
    return [this.p_canvasOffset[0] + cPoint[0], this.p_canvasOffset[1] + cPoint[1]];
    };

/**
 * pic.windowToCanvasRect is given min and maxc X and Y co-ordinates in 
 * window co-ordinates and returns them in canvas co-ordinates.
 *
 * @param wXMin Minimum X co-ordinate
 * @param wYMin Minimum Y co-ordinate
 * @param wXMax Maximum X co-ordinate
 * @param wYMax Maximum Y co-ordinate
 * @return 4 element array, min X, min Y, max X, max Y in canvas co-ords
 */
DRAWLIB.m_windowToCanvasRect = function(wXMin, wYMin, wXMax, wYMax) {
    return this.p_windowToCanvasContextRect( wXMin, wYMin, wXMax, wYMax,
                                                this.p_canvasWidth,
                                                this.p_window);
    };

/**
 * pic.windowToCanvasArray converts a list of co-ordinates from window to
 * canvas co-ordinates.
 *
 * @param wP list of 2-element arrays, each containing X and Y co-ordinates
 * @return list of 2-element arrays, each containing X and Y co-ordinates
 */
DRAWLIB.m_windowToCanvasArray = function( wP ) {
    return this.p_windowToCanvasContextArray( wP, this.p_canvasWidth,
                                                 this.p_window);
    };

/**
 * pic.pageToWindowDistance converts a page or canvas distance into window units
 *
 * @param canvasDistance Distance in page or canvas units
 * @return distance in window units
 */
DRAWLIB.m_pageToWindowDistance = function(canvasDistance) {
    var scale = 1 / this.windowToCanvasScale();
    return Math.round(canvasDistance * scale);
    };

DRAWLIB.p_windowToCanvasDistance = function(windowDistance) {
    return Math.round(this.windowToCanvasScale()*windowDistance);
    };

//==========
// Methods to do window to canvas conversion for arbitrary canvases
// These all use the current rotation

DRAWLIB.p_windowToCanvasContextScale = function( canvasWidth, window) {
    var scale;
    if (this.p_rotation === 0 || this.p_rotation === 2) {
        scale = canvasWidth / window[2];
        }
    else {
        scale = canvasWidth / window[3];
        }
    return scale;
    };

DRAWLIB.p_windowToCanvasContextCoords = function(wX, wY, canvasWidth, window) {
    var scale, pX, pY;
    wX -= window[0];
    wY -= window[1];
    if (this.p_rotation === 0) {
        scale = canvasWidth / window[2];
        pX = Math.round(scale * wX);
        pY = Math.round(scale * wY);
        }
    else if(this.p_rotation === 1) {
        scale = canvasWidth / window[3];
        pX = Math.round(scale * wY);
        pY = Math.round(scale * (window[2] - wX));
        }
    else if(this.p_rotation === 2) {
        scale = canvasWidth / window[2];
        pX = Math.round(scale * (window[2] - wX));
        pY = Math.round(scale * (window[3] - wY));
        }
    else if(this.p_rotation === 3) {
        scale = canvasWidth / window[3];
        pX = Math.round(scale * (window[3] - wY));
        pY = Math.round(scale * wX);
        }
    return [pX,  pY];
    };

DRAWLIB.p_windowToCanvasContextRect = function(wXMin, wYMin, wXMax, wYMax,
    canvasWidth, window) {
    var pMin = this.p_windowToCanvasContextCoords( wXMin, wYMin,
                                                   canvasWidth, window );
    var pMax = this.p_windowToCanvasContextCoords( wXMax, wYMax,
                                                   canvasWidth, window );
    return [pMin[0], pMin[1], pMax[0], pMax[1]];
    };

DRAWLIB.p_windowToCanvasContextArray = function( wP, canvasWidth, window ) {
    var i, scale, pX, pY, wX, wY, cX, cY;
    var cP = [];
    if (this.p_rotation === 0) {
        scale = canvasWidth / window[2];
        for ( i = 0 ; i < wP.length ; i++) {
            wX = wP[i][0] - window[0];
            wY = wP[i][1] - window[1];
            cX = Math.round(scale * wX);
            cY = Math.round(scale * wY);
            cP.push([cX, cY]);
            }
        }
    else if(this.p_rotation === 1) {
        scale = canvasWidth / window[3];
        for ( i = 0 ; i < wP.length ; i++) {
            wX = wP[i][0] - window[0];
            wY = wP[i][1] - window[1];
            cX = Math.round(scale * wY);
            cY = Math.round(scale * (window[2] - wX));
            cP.push([cX, cY]);
            }
        }
    else if(this.p_rotation === 2) {
        scale = canvasWidth / window[2];
        for ( i = 0 ; i < wP.length ; i++) {
            wX = wP[i][0] - window[0];
            wY = wP[i][1] - window[1];
            cX = Math.round(scale * (window[2] - wX));
            cY = Math.round(scale * (window[3] - wY));
            cP.push([cX, cY]);
            }
        }
    else if(this.p_rotation === 3) {
        scale = canvasWidth / window[3];
        for ( i = 0 ; i < wP.length ; i++) {
            wX = wP[i][0] - window[0];
            wY = wP[i][1] - window[1];
            cX = Math.round(scale * (window[3] - wY));
            cY = Math.round(scale * wX);
            cP.push([cX, cY]);
            }
        }
    return cP;
    };

/**
 * pic.pageToAnyCanvasWindowCoords takes a page point and a supplied canvas and
 * converts the location to a window co-ordinate, assuming that the whole
 * picture is drawn in the canvas.
 *
 * @param pX Page X Co-ord
 * @param pY Page Y Co-ord
 * @param canvas Supplied canvas
 *
 * @return 2-element array X and Y Window point.
 */
DRAWLIB.m_pageToAnyCanvasWindowCoords = function( pX, pY, canvas) {
    // First find the page to canvas offset
    var curleft = 0;
    var curtop = 0;
    var obj = canvas;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
            obj = obj.offsetParent;
            } while (obj);
        }
    var cX = pX - curleft;
    var cY = pY - curtop;
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var scale, winX, winY;
    if(this.p_rotation === 0) {
        scale = this.p_windowBoundary[2] / canvasWidth;
        winX = Math.round(scale * cX) ;
        winY = Math.round(scale * cY) ;
        }
    else if(this.p_rotation === 1) {
        scale = this.p_windowBoundary[3] / canvasWidth;
        winX = Math.round(scale * (canvasHeight -cY));
        winY = Math.round(scale * cX);
        }
    else if(this.p_rotation === 2) {
        scale = this.p_windowBoundary[2] / canvasWidth;
        winX = Math.round(scale * (canvasWidth - cX));
        winY = Math.round(scale * (canvasHeight- cY));
        }
    else if(this.p_rotation === 3) {
        scale = this.p_windowBoundary[3] / canvasWidth;
        winX = Math.round(scale * cY);
        winY = Math.round(scale * (canvasWidth - cX));
        }
    return [this.p_windowBoundary[0] + winX, this.p_windowBoundary[1] + winY];
    };
