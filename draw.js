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

// Set the clipping region based on a rectangular bounding box
// Remember to save and restore the context when using this or clipping
// regions combine.
// TODO this doesn't work with text so I really need to replace this approach
// with drawing sections by creating an in-memory canvas, setting its
// globalCompositeOperation to 'source-in' writing to that and then
// use drawImage to copy the in-memory canvas to the main canvas.
DRAWLIB.p_setClip = function(ctxt, minX, minY, maxX, maxY) {
    ctxt.beginPath();
    ctxt.moveTo(minX, minY);
    ctxt.lineTo(minX, maxY);
    ctxt.lineTo(maxX, maxY);
    ctxt.lineTo(maxX, minY);
    ctxt.lineTo(minX, minY);
    ctxt.clip();
    };

/**
 * pic.redrawAll redraws the picture in the main canvas
 */
DRAWLIB.m_redrawAll = function() {
    this.redrawAllToCanvas(this.p_canvas, this.p_window);
    };

/**
 * pic.redrawAllToCanvas redraws the picture in a supplied canvas
 */
DRAWLIB.m_redrawAllToCanvas = function(canvas, window) {
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var ctxt = canvas.getContext("2d");
    if (this.p_redrawFunc) {
        this.p_redrawFunc(this, ctxt, canvasWidth, canvasHeight, window);
        return;
        }
    ctxt.fillStyle = this.p_background;
    ctxt.fillRect(0, 0, canvasWidth, canvasHeight);
    this.p_drawItemsByZ(this.p_items, ctxt, canvasWidth, window) ;
    ctxt.strokeStyle = '#000000';
    ctxt.lineWidth = 3;
    ctxt.strokeRect(1, 1, canvasWidth-2, canvasHeight-2); 
    };

DRAWLIB.p_redrawOneFrame = function() {
    var ctxt = this.p_ctxt;
    ctxt.strokeStyle = '#000000';
    ctxt.lineWidth = 3;
    ctxt.strokeRect(1, 1, this.p_canvas.width-2, this.p_canvas.height-2); 
    };

/**
 * pic.redrawAllToImageWindow redraws the picture to a new browser window
 */
DRAWLIB.m_redrawAllToImageWindow = function() {
    var canvas = document.createElement("canvas");
    var canvasWidth = this.p_windowBoundary[2];
    var canvasHeight = this.p_windowBoundary[3];
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    var myWindow = this.p_windowBoundary;
    // Check for undefined window boundary
    if (!myWindow) { myWindow = this.p_window; }
    this.redrawAllToCanvas(canvas, myWindow);
    window.open(canvas.toDataURL("image/png"),"Image Window");
    };

/**
 * pic.blank blanks the canvas window and doesn't draw any layers.
 *
 * @param ctxt Drawing context
 * @param canvasWidth Width of canvas
 * @param canvasHeight Height of canvas
 */
DRAWLIB.m_blank = function(ctxt, canvasWidth, canvasHeight, window) {
    ctxt.fillStyle = this.p_background;
    ctxt.fillRect(0, 0, canvasWidth, canvasHeight);
    // Possible background images
    if (this.p_backgroundImage) {
        this.p_backgroundImage.draw(ctxt, canvasWidth, canvasHeight, window);
        }
    if (this.p_backgroundImage4) {
        this.p_backgroundImage4.draw(ctxt, canvasWidth, canvasHeight, window);
        }
    };

/**
 * pic.blankCanvasRect blanks a rectangle on the canvas.
 * @param xMin Minimum X co-ord
 * @param xMax Maximum X co-ord
 * @param yMin Minimum Y co-ord
 * @param yMax Maximum Y co-ord
 */
DRAWLIB.m_blankCanvasRect = function(xMin, yMin, xMax, yMax) {
    this.p_ctxt.fillStyle = this.p_background;
    this.p_ctxt.fillRect(xMin, yMin, (xMax-xMin), (yMax-yMin));
    };

/**
 * pic.redrawFrame draws a frame arpound the supplied context
 *
 * @param ctxt Drawing context
 * @param canvasWidth width of canvas
 * @param window window
 */
DRAWLIB.m_redrawFrame = function(ctxt, canvasWidth, canvasHeight) {
    ctxt.strokeStyle = '#000000';
    ctxt.lineWidth = 3;
    ctxt.strokeRect(0, 0, canvasWidth, canvasHeight); 
    };

/**
 * pic.redrawLayer redraws one layer in the supplied context.
 * Nothing is blanked first.
 *
 * @param layer The layer to redraw.
 */
DRAWLIB.m_redrawLayer = function(layer, ctxt, canvasWidth, window) {
    // Create a list of items from the aforesaid layer
    var lItems = {};
    for (var itemName in this.p_items) {
        if (this.p_items.hasOwnProperty(itemName)) {
            var item = this.p_items[itemName];
            if ( item.p_layer === layer ) { lItems[itemName] = item; }
            }
        }
    this.p_drawItemsByZ(lItems, ctxt, canvasWidth, window) ;
    };

// Redraws a section of the picture on the main canvas.
DRAWLIB.p_redrawSectionWindow = function(minX, minY, maxX, maxY) {
    var pRect = this.windowToCanvasRect( minX, minY, maxX, maxY );
    var ctxt = this.p_ctxt;
    ctxt.fillStyle = this.p_background;
    ctxt.fillRect(pRect[0], pRect[1], pRect[2]-pRect[0], pRect[3]-pRect[1]);
    // Redraw items in the area
    var sectionItems = {};
    for (var itemName in this.p_items) {
        if (this.p_items.hasOwnProperty(itemName)) {
            var item = this.p_items[itemName];
            // If we are dragging an item then it will
            // be redrawn separately
            if (item.p_drawable && item.p_visible && !item.p_dragging) {
                var BB = item.p_pickBB ;
                if (BB[0] <= maxX && BB[1] <= maxY && 
                    BB[2] >= minX && BB[3] >= minY) {
                    sectionItems[item.p_id] = item;
                    }
                }
            }
        }
    ctxt.save();
    this.p_setClip(ctxt, pRect[0], pRect[1], pRect[2], pRect[3]);
    this.p_drawItemsByZ(sectionItems, ctxt, this.p_canvasWidth, this.p_window) ;
    ctxt.restore();
    };

/**
 * pic.redrawSectionWindowLayer redraws a section of one layer in the
 * main canvas.
 * It chooses what to redraw based on a list of bounding boxes and it returns
 * the list with the bounding boxes of any items drawn.
 *
 * @param layer Number of the layer to draw
 * @param BBList Array of bounding boxes (minX, minY, maxX, MaxY)
 * @return updated array with more bounding boxes
 */
DRAWLIB.m_redrawSectionWindowLayer = function(layer, BBList) {
    var BBLen = BBList.length;
    var newBB = [];
    for (var i = 0 ; i < BBLen ; i++) { newBB.push(BBList[i]); }
    // calculate a total BB (because of clipping rectangle)
    var tBB = BBList[0];
    for (i = 1 ; i < BBLen ; i++ ) {
        var aBB = BBList[i];
        tBB[0] = Math.min( tBB[0], aBB[0] );
        tBB[1] = Math.min( tBB[1], aBB[1] );
        tBB[2] = Math.max( tBB[2], aBB[2] );
        tBB[3] = Math.max( tBB[3], aBB[3] );
        }
    // Redraw items in the area
    var count = 0;
    var sectionItems = {};
    for (var itemName in this.p_items) {
        if (this.p_items.hasOwnProperty(itemName)) {
            var item = this.p_items[itemName];
            // If we are dragging an item then it will be redrawn separately
            if (item.p_drawable && item.p_visible && !item.p_dragging &&
                item.p_layer === layer) {
                var iBB = item.p_pickBB ; // BB of candidate item
                // Compare the item with total BB
                if (iBB[0] <= tBB[2] && iBB[1] <= tBB[3] && 
                    iBB[2] >= tBB[0] && iBB[3] >= tBB[1]) {
                    count += 1;
                    sectionItems[item.p_id] = item;
                    }
                }
            }
        }
    if (count > 0) {
        var cRect = this.windowToCanvasRect(tBB[0], tBB[1], tBB[2], tBB[3]);
        var cXMin = Math.min(cRect[0], cRect[2]);
        var cXMax = Math.max(cRect[0], cRect[2]);
        var cYMin = Math.min(cRect[1], cRect[3]);
        var cYMax = Math.max(cRect[1], cRect[3]);
        this.p_ctxt.save();
        this.p_setClip(this.p_ctxt, cXMin-1, cYMin-1, cXMax+1, cYMax+1);
        this.p_drawItemsByZ(sectionItems, this.p_ctxt,
                            this.p_canvasWidth, this.p_window) ;
        this.p_ctxt.restore();
        }
    // return the list of bounding boxes with new ones added
    return newBB;
    };

// Redraws a section of the picture on the main canvas.
DRAWLIB.p_redrawSectionCanvas = function(x1, y1, x2, y2) { // Canvas limits
    var canMinX = Math.min(x1, x2);
    var canMinY = Math.min(y1, y2);
    var canMaxX = Math.max(x1, x2);
    var canMaxY = Math.max(y1, y2);
    var canWid = Math.abs(x2-x1);
    var canHgt = Math.abs(y2-y1);
    // Blank the rectangle
    var ctxt = this.p_ctxt;
    ctxt.save();
    ctxt.fillStyle = this.p_background;
    this.p_setClip(ctxt, canMinX, canMinY, (canMinX+canWid), (canMinY+canHgt));
    ctxt.fillRect(canMinX, canMinY, canWid, canHgt);
    // Work out dimensions in window co-ords
    var wRect = this.canvasToWindowRect( canMinX, canMinY, canMaxX, canMaxY);
    // Redraw items in the area
    var sectionItems = {};
    for (var itemName in this.p_items) {
        if (this.p_items.hasOwnProperty(itemName)) {
            var item = this.p_items[itemName];
            if (item.p_drawable && item.p_visible) {
                var pickBB = item.p_pickBB ;
                if (pickBB[0] <= wRect[2] && pickBB[1] <= wRect[3] && 
                    pickBB[2] >= wRect[0] && pickBB[3] >= wRect[1]) {
                    sectionItems[item.p_id] = item;
                    }
                }
            }
        }
    this.p_drawItemsByZ(sectionItems, ctxt, this.p_canvasWidth, this.p_window) ;
    ctxt.restore();
    };

/**
 * pic.redrawSectionPage redraws a section of the picture in the main canvas
 *
 * @param minX Minimum X of section in page co-ordinates
 * @param minY Minimum Y of section in page co-ordinates
 * @param maxX Maximum X of section in page co-ordinates
 * @param maxY Maximum Y of section in page co-ordinates
 */
DRAWLIB.m_redrawSectionPage = function(x1, y1, x2, y2) {
    var minX = Math.min(x1, x2) -1 - this.p_canvasOffset[0];
    var maxX = Math.max(x1, x2) +1 - this.p_canvasOffset[0];
    var minY = Math.min(y1, y2) -1 - this.p_canvasOffset[1];
    var maxY = Math.max(y1, y2) +1 - this.p_canvasOffset[1];
    this.p_redrawSectionCanvas(minX, minY, maxX, maxY);
    };

/**
 * item.blankOffset blanks an area based on an offset of the item's
 * bounding box. It returns the area blanked in window co-ords.
 *
 * @param xOff - X offset in canvas co-ords
 * @param yOff - Y offset in canvas co-ords
 *
 * @return 4 element array, [minX, minY, maxX, maxY]
 */
DRAWLIB.m_blankOffset = function(xOff, yOff) {
    var ctxt = this.p_pic.p_ctxt;
    var lw = this.p_lineWidth;
    var BB = this.p_pickBB;
    // get the bounding box in canvas coords
    var cBB = this.p_pic.windowToCanvasRect(
        BB[0]-lw, BB[1]-lw, BB[2]+lw, BB[3]+lw);
    // Offset the box in canvas co-ords
    // And allow an extra pixel for rounding errors
    cBB[0] += xOff-1;
    cBB[1] += yOff-1;
    cBB[2] += xOff+1;
    cBB[3] += yOff+1;
    // Blank the rectangle
    ctxt.fillStyle = this.p_pic.p_background;
    ctxt.fillRect( cBB[0], cBB[1], cBB[2]-cBB[0], cBB[3]-cBB[1]);
    if (this.p_pic.p_backgroundImage) {
        this.p_pic.p_backgroundImage.drawBackgroundCanvasSect(cBB);
        }
    var wOff = this.p_pic.canvasToWindowOffset(xOff, yOff);
    return [BB[0]+wOff[0]-lw, BB[1]+wOff[1]-lw,
            BB[2]+wOff[0]+lw, BB[3]+wOff[1]+lw];
    } ;

/* Blank and redraw the area under an offset item */
DRAWLIB.p_redrawOffset = function(xOff, yOff) {
    var wOff = this.p_pic.canvasToWindowOffset(xOff, yOff);
    var ctxt = this.p_pic.p_ctxt;
    var lw = this.p_lineWidth;
    var BB = this.p_pickBB;
    this.p_pic.p_redrawSectionWindow(BB[0]-lw-1+wOff[0], BB[1]-lw-1+wOff[1],
                                     BB[2]+lw+1+wOff[0], BB[3]+lw+1+wOff[1]);
    } ;

/**
 * pic.drawDragRect draws a rectangle being dragged.
 * It is called repeatedly and blanks the previous rectangle.
 *
 * @param x1 X co-ordinate of one rectangle corner
 * @param y1 Y co-ordinate of one rectangle corner
 * @param oldX2 X co-ordinate of previous other rectangle corner
 * @param oldY2 Y co-ordinate of previous other rectangle corner
 * @param newX2 X co-ordinate of new other rectangle corner
 * @param newY2 Y co-ordinate of new other rectangle corner
 */
DRAWLIB.m_drawDragRect = function(x1, y1, oldX2, oldY2, newX2, newY2, lineStyle) {
    this.redrawSectionPage(x1, y1, oldX2, oldY2);
    var ctxt = this.p_ctxt;
    ctxt.strokeStyle = lineStyle;
    ctxt.lineWidth = 1;
    ctxt.beginPath();
    ctxt.moveTo(x1-this.p_canvasOffset[0], y1-this.p_canvasOffset[1]);
    ctxt.lineTo(x1-this.p_canvasOffset[0], newY2-this.p_canvasOffset[1]);
    ctxt.lineTo(newX2-this.p_canvasOffset[0], newY2-this.p_canvasOffset[1]);
    ctxt.lineTo(newX2-this.p_canvasOffset[0], y1-this.p_canvasOffset[1]);
    ctxt.lineTo(x1-this.p_canvasOffset[0], y1-this.p_canvasOffset[1]);
    ctxt.stroke();
    ctxt.closePath();
    };

/**
 * pic.drawPageRect draws a rectangle in page co-ordinates
 *
 * @param x1 X co-ordinate of one rectangle corner
 * @param y1 Y co-ordinate of one rectangle corner
 * @param x2 X co-ordinate of other rectangle corner
 * @param y2 Y co-ordinate of other rectangle corner
 */
DRAWLIB.m_drawPageRect = function(x1, y1, x2, y2, lineStyle) {
    var ctxt = this.p_ctxt;
    ctxt.strokeStyle = lineStyle;
    ctxt.lineWidth = 1;
    ctxt.beginPath();
    ctxt.moveTo(x1-this.p_canvasOffset[0], y1-this.p_canvasOffset[1]);
    ctxt.lineTo(x1-this.p_canvasOffset[0], y2-this.p_canvasOffset[1]);
    ctxt.lineTo(x2-this.p_canvasOffset[0], y2-this.p_canvasOffset[1]);
    ctxt.lineTo(x2-this.p_canvasOffset[0], y1-this.p_canvasOffset[1]);
    ctxt.lineTo(x1-this.p_canvasOffset[0], y1-this.p_canvasOffset[1]);
    ctxt.stroke();
    ctxt.closePath();
    };

/**
 * pic.drawDragEllipse draws an ellipse being dragged.
 * It is called repeatedly and blanks the previous rectangle.
 *
 * @param x1 X co-ordinate of one rectangle corner
 * @param y1 Y co-ordinate of one rectangle corner
 * @param oldX2 X co-ordinate of previous other rectangle corner
 * @param oldY2 Y co-ordinate of previous other rectangle corner
 * @param newX2 X co-ordinate of new other rectangle corner
 * @param newY2 Y co-ordinate of new other rectangle corner
 */
DRAWLIB.m_drawDragEllipse = function(x1, y1, oldX2, oldY2, newX2, newY2,
    lineStyle) {
    this.redrawSectionPage(x1, y1, oldX2, oldY2);
    var ctxt = this.p_ctxt;
    ctxt.strokeStyle = lineStyle;
    ctxt.lineWidth = 1;
    ctxt.beginPath();
    var midX = (x1+newX2)/2 - this.p_canvasOffset[0] ;
    var midY = (y1+newY2)/2 - this.p_canvasOffset[1] ;
    var radius = (Math.min(Math.abs(newX2-x1), Math.abs(newY2-y1)))/2;
    ctxt.arc( midX, midY, radius, 0, 2*Math.PI, false) ;
    ctxt.stroke();
    ctxt.closePath();
    };

/**
 * pic.drawPageLine draws a line between points in page co-ordinates.
 *
 * @param x1 X co-ordinate of the first point
 * @param y1 Y co-ordinate of the first point
 * @param x2 X co-ordinate of the second point
 * @param y2 Y co-ordinate of the second point
 */
DRAWLIB.m_drawPageLine = function( x1, y1, x2, y2, lineStyle, lineWidth) {
    var ctxt = this.p_ctxt;
    ctxt.strokeStyle = lineStyle;
    ctxt.lineWidth = lineWidth;
    ctxt.beginPath();
    ctxt.moveTo(x1-this.p_canvasOffset[0], y1-this.p_canvasOffset[1]);
    ctxt.lineTo(x2-this.p_canvasOffset[0], y2-this.p_canvasOffset[1]);
    ctxt.stroke();
    ctxt.closePath();
    };

/**
 * pic.drawPoint draws a small mark at a point in window co-ordinates.
 *
 * @param winX Point X co-ordinate
 * @param winY Point Y co-ordinate
 */
DRAWLIB.m_drawPoint = function(winX, winY) { //For debugging purposes
    var canP = this.windowToCanvasCoords( winX, winY );
    var ctxt = this.p_ctxt;
    ctxt.strokeStyle = '#000000';
    ctxt.lineWidth = 3;
    ctxt.beginPath();
    ctxt.moveTo(canP[0]-4, canP[1]-4);
    ctxt.lineTo(canP[0]+4, canP[1]+4);
    ctxt.moveTo(canP[0]-4, canP[1]+4);
    ctxt.lineTo(canP[0]+4, canP[1]-4);
    ctxt.stroke();
    ctxt.closePath();
    };

// Allows an array of numbers to be sorted
DRAWLIB.p_numericItemSort = function(a, b){ return (a - b); };

// Given a list of drawing iems to draw, draw them in ascending Z order.
// Z values are assumed to be positive or negative integers with higher Z value
// items drawn on top of lower Z value items.
// We don't know which Z values have been used and each Z value may have
// multiple items.
DRAWLIB.p_drawItemsByZ = function(drawList, ctxt, canvasWidth, window) {
    var zValuesList = []; // List of actual Z values encountered
    // Each property will be an array of item references at the same Z value
    var itemsByZ = {};
    for (var id in drawList) {
        if (drawList.hasOwnProperty(id)) {
            var oneItem = drawList[id];
            if (oneItem.p_drawable && oneItem.p_visible) {
                var zKey = ''+oneItem.getZ();
                if (!itemsByZ[zKey]) {
                    // First time we have encountered this Z value
                    itemsByZ[zKey] = {};
                    // Numeric value, not string-ified, for sorting
                    zValuesList.push(oneItem.getZ()) ;
                    }
                itemsByZ[zKey][id] = oneItem;
                }
            }
        }
    // Get the list of Z values in order and then draw from lists in that order
    zValuesList.sort(DRAWLIB.p_numericItemSort);
    var zLen = zValuesList.length;
    for (var i = 0 ; i < zLen ; i++) {
        var oneList = itemsByZ[''+zValuesList[i]];
        for (id in oneList) {
            if (oneList.hasOwnProperty(id)) {
                oneList[id].p_draw(ctxt, canvasWidth, window);
                }
            }
        }
    };

// Compare an item bounding box with the current window.
// if it is outside then return false so no further attempt is made
// to draw the item
DRAWLIB.p_isInWindow= function( itemBB, window) {
    if (itemBB[0] > window[0]+window[2]) { return false; }
    if (itemBB[2] < window[0]) { return false; }
    if (itemBB[1] > window[1]+window[3]) { return false; }
    if (itemBB[3] < window[1]) { return false; }
    return true;
    };

