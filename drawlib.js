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

// For JSHint - I don't want to add strict to each function but I am wary
// of file scope in case it leaks and this is a library.
// Allow nonstandard for escape / unescape
/*jshint strict:false, nonstandard:true */

// All methods should be created as members of this.
// Global object to be used as a namespace.
var DRAWLIB = {};
DRAWLIB.p_IMGINFO = {};

/**
 * Create a Picture object
 * DRAWLIB.createPicture creates a picture object associated with a canvas
 * that owns a list of drawing items and supports panning, zooming and
 * rotation.
 *
 * @param canvas The canvas object on which to draw
 * @param background Background color - string '#RRGGBB'
 * @param canvasWidth Initial width in pixels of the canvas
 * @param canvasHeight Initial height in pixels of the canvas
 * @return Picture object
 */
DRAWLIB.createPicture = function(canvas, background) {
    var onePic = {'p_canvas':canvas};
    onePic.p_ctxt = onePic.p_canvas.getContext("2d");
    onePic.p_items = {};
    onePic.p_itemsById = {}; // indexed by db id as a string
    onePic.p_background = background;
    onePic.p_canvasWidth = canvas.width;
    onePic.p_canvasHeight = canvas.height;
    onePic.p_origCanvasWidth = canvas.width; // Original value
    onePic.p_origCanvasHeight = canvas.height; // Original value
    onePic.p_window = [0, 0, canvas.width, canvas.height];
    onePic.p_windowBoundary = undefined;
    onePic.p_minZ = 0;
    onePic.p_maxZ = 0;
    onePic.p_rotation = 0; // units of 90 degrees clockwise window under page
    onePic.p_redrawFunc = undefined; // No redraw callback initially
    onePic.setRedrawFunc = DRAWLIB.m_setRedrawFunc;
    onePic.resetCanvasDimensions = DRAWLIB.m_resetCanvasDimensions;
    onePic.getMinZ = DRAWLIB.m_getMinZ;
    onePic.getMaxZ = DRAWLIB.m_getMaxZ;
    onePic.setZ = DRAWLIB.m_setZPic;
    onePic.p_drawItemsByZ = DRAWLIB.p_drawItemsByZ;
    onePic.redrawAll = DRAWLIB.m_redrawAll;
    onePic.redrawAllToCanvas = DRAWLIB.m_redrawAllToCanvas;
    onePic.redrawAllToImageWindow = DRAWLIB.m_redrawAllToImageWindow;
    onePic.redrawSectionPage = DRAWLIB.m_redrawSectionPage;
    onePic.redrawSectionWindowLayer = DRAWLIB.m_redrawSectionWindowLayer;
    onePic.p_setClip = DRAWLIB.p_setClip;
    onePic.redrawFrame = DRAWLIB.m_redrawFrame;
    onePic.blank = DRAWLIB.m_blank;
    onePic.blankCanvasRect = DRAWLIB.m_blankCanvasRect;
    onePic.p_redrawOneFrame = DRAWLIB.p_redrawOneFrame;
    onePic.redrawLayer = DRAWLIB.m_redrawLayer;
    onePic.p_redrawSectionWindow= DRAWLIB.p_redrawSectionWindow;
    onePic.p_redrawSectionCanvas = DRAWLIB.p_redrawSectionCanvas;
    onePic.drawDragRect = DRAWLIB.m_drawDragRect; 
    onePic.drawDragEllipse = DRAWLIB.m_drawDragEllipse; 
    onePic.drawPageRect = DRAWLIB.m_drawPageRect;
    onePic.drawPageLine = DRAWLIB.m_drawPageLine;
    onePic.setWindow = DRAWLIB.m_setWindow;
    onePic.setWindowWithResize = DRAWLIB.m_setWindowWithResize;
    onePic.setWindowBoundary = DRAWLIB.m_setWindowBoundary;
    onePic.getWindowBoundary = DRAWLIB.m_getWindowBoundary;
    onePic.getRotation = DRAWLIB.m_getRotation;
    onePic.setRotation = DRAWLIB.m_setRotation;
    onePic.zoomIn = DRAWLIB.m_zoomIn;
    onePic.zoomOut = DRAWLIB.m_zoomOut;
    onePic.panPic = DRAWLIB.m_panPic;
    onePic.panUp = DRAWLIB.m_panUp;
    onePic.panDown = DRAWLIB.m_panDown;
    onePic.panLeft = DRAWLIB.m_panLeft;
    onePic.panRight = DRAWLIB.m_panRight;
    onePic.panToCentre = DRAWLIB.m_panToCentre;
    onePic.pageToCanvasCoords = DRAWLIB.m_pageToCanvasCoords;
    onePic.pageToAnyCanvasWindowCoords = DRAWLIB.m_pageToAnyCanvasWindowCoords;
    onePic.pageToWindowCoords = DRAWLIB.m_pageToWindowCoords;
    onePic.windowToCanvasArray = DRAWLIB.m_windowToCanvasArray;
    onePic.pageToWindowDistance = DRAWLIB.m_pageToWindowDistance;
    onePic.canvasToWindowOffset = DRAWLIB.m_canvasToWindowOffset;
    onePic.p_canvasToWindowCoords = DRAWLIB.p_canvasToWindowCoords;
    onePic.canvasToWindowRect = DRAWLIB.m_canvasToWindowRect;
    onePic.windowToCanvasScale = DRAWLIB.m_windowToCanvasScale;
    onePic.p_windowToCanvasDistance = DRAWLIB.p_windowToCanvasDistance;
    onePic.windowToCanvasCoords = DRAWLIB.m_windowToCanvasCoords;
    onePic.windowToCanvasRect = DRAWLIB.m_windowToCanvasRect;
    onePic.p_windowToCanvasContextScale = DRAWLIB.p_windowToCanvasContextScale;
    onePic.p_windowToCanvasContextCoords = DRAWLIB.p_windowToCanvasContextCoords;
    onePic.p_windowToCanvasContextRect = DRAWLIB.p_windowToCanvasContextRect;
    onePic.p_windowToCanvasContextArray = DRAWLIB.p_windowToCanvasContextArray;
    onePic.p_setItem = DRAWLIB.p_setItemPic;
    onePic.deleteItem = DRAWLIB.m_deleteItemPic;
    onePic.pick = DRAWLIB.m_pickPic;
    onePic.boxPickMargin = DRAWLIB.m_boxPickPic;
    onePic.pickAll = DRAWLIB.m_pickAllPic;
    onePic.checkPickItem = DRAWLIB.m_checkPickItemPic;
    onePic.contained = DRAWLIB.m_containedPic;
    onePic.drawPoint = DRAWLIB.m_drawPoint;
    onePic.completeGroups = DRAWLIB.m_completeGroupsPic;
    onePic.getItemById = DRAWLIB.m_getItemById;
    onePic.getItemByDBId = DRAWLIB.m_getItemByDBId;
    onePic.setLayerVisibility = DRAWLIB.m_setLayerVisibility;
    onePic.setLayerPickable = DRAWLIB.m_setLayerPickable;
    onePic.setLayerZOffset = DRAWLIB.m_setLayerZOffset;
    onePic.getCtxt = DRAWLIB.m_getCtxt;
    onePic.getCanvasWidth = DRAWLIB.m_getCanvasWidth;
    onePic.getWindow = DRAWLIB.m_getWindow;
    //
    onePic.createItemFromJSON = DRAWLIB.m_createItemFromJSON;
    onePic.createRect = DRAWLIB.m_createRect;
    onePic.createEllipse = DRAWLIB.m_createEllipse;
    onePic.createText = DRAWLIB.m_createText;
    onePic.createImage = DRAWLIB.m_createImage;
    onePic.createPolyline = DRAWLIB.m_createPolyline;
    onePic.createFreehand = DRAWLIB.m_createFreehand;
    onePic.createPolygon = DRAWLIB.m_createPolygon;
    //
    onePic.p_createGroupBasic = DRAWLIB.p_createGroupBasic;
    onePic.createGroupFromDB = DRAWLIB.m_createGroupFromDB;
    onePic.createGroupFromPic = DRAWLIB.m_createGroupFromPic;
    //
    onePic.p_backgroundImage = undefined;
    onePic.addBackgroundImage = DRAWLIB.m_addBackground;
    onePic.p_backgroundImage4 = undefined;
    onePic.addBackgroundImage4 = DRAWLIB.m_addBackground4;
    //
    DRAWLIB.p_IMGINFO.redrawObj = onePic;
    return onePic;
    };

/**
 * pic.getCtxt returns the canvas drawing context
 *
 * @return drawing context
 */
DRAWLIB.m_getCtxt = function() { return this.p_ctxt; };

/**
 * pic.getCanvasWidth returns the width of the main canvas for drawing
 *
 * @return drawing canvas width
 */
DRAWLIB.m_getCanvasWidth = function() { return this.p_canvasWidth; };

/**
 * pic.getWindow returns the current window
 *
 * @return drawing window
 */
DRAWLIB.m_getWindow = function() { return this.p_window; };

/**
 * pic.setRedrawFunc sets a function callback to be used in place of
 * redrawall. It is optional.
 *
 * @param func A function that can be called with parameters pic, ctxt, canvas, window
 */
DRAWLIB.m_setRedrawFunc = function(func) { this.p_redrawFunc = func; };

DRAWLIB.p_setItemPic = function(item) {
    this.p_items[item.p_id] = item;
    };

/**
 * pic.deleteItem deletes an item from the drawing list.
 *
 * @param id id of the item to be deleted.
 */
DRAWLIB.m_deleteItemPic = function(id) {
    var dbId = this.p_items[id];
    delete this.p_items[id];
    if (dbId) { delete this.p_itemsById[id]; }
    };

/**
 * pic.getItemById returns an item based on the local id
 *
 * @param id Local id of the item
 * @return the item, or undef
 */
DRAWLIB.m_getItemById = function(id) { return this.p_items[id]; };

/**
 * pic.Pick finds an item, if any at a page point
 *
 * @param pX X co-ordinate of the pick point
 * @param pY Y co-ordinate of the pick point
 * @return the picked item, or undef if none found.
 */ 
DRAWLIB.m_pickPic = function(pX, pY) {
    var winPos = this.pageToWindowCoords( pX, pY);
    var pickedItem; // = undefined
    var pickedZ;
    for (var itemName in this.p_items) {
        if (this.p_items.hasOwnProperty(itemName)) {
            var item = this.p_items[itemName];
            if (item.p_drawable && item.p_visible && item.p_pickable &&
                item.pick(winPos[0], winPos[1])) {
                if (pickedItem) {
                    if (item.p_z > pickedZ) {
                        pickedItem = item;
                        pickedZ = item.p_z;
                        }
                    }
                else {
                    pickedItem = item;
                    pickedZ = item.p_z;
                    }
                }
            }
        }
    return pickedItem;
    };

/**
 * pic.PickMargin finds an item, if any at a page point with a given margin
 *
 * @param pX X co-ordinate of the pick point
 * @param pY Y co-ordinate of the pick point
 * @param margin margin in window co-ordinates of the bounding box
 * @return the picked item, or undef if none found.
 */ 
DRAWLIB.m_boxPickPic = function(pX, pY, margin) {
    var winPos = this.pageToWindowCoords( pX, pY);
    var pickedItem; // = undefined
    var pickedZ;
    for (var itemName in this.p_items) {
        if (this.p_items.hasOwnProperty(itemName)) {
            var item = this.p_items[itemName];
            if (item.p_drawable && item.p_visible && item.p_pickable &&
                item.boxPick(winPos[0], winPos[1], margin)) {
                if (pickedItem) {
                    if (item.p_z > pickedZ) {
                        pickedItem = item;
                        pickedZ = item.p_z;
                        }
                    }
                else {
                    pickedItem = item;
                    pickedZ = item.p_z;
                    }
                }
            }
        }
    return pickedItem;
    };

/**
 * pic.PickAll finds all items, if any at a page point
 *
 * @param pX X co-ordinate of the pick point
 * @param pY Y co-ordinate of the pick point
 * @return array of picked items, may be empty. No guarantees of order in the array
 */ 
DRAWLIB.m_pickAllPic = function(pX, pY) {
    var winPos = this.pageToWindowCoords( pX, pY);
    var pickedItems=[];
    for (var itemName in this.p_items) {
        if (this.p_items.hasOwnProperty(itemName)) {
            var item = this.p_items[itemName];
            if (item.p_drawable && item.p_visible && item.p_pickable &&
                item.pick(winPos[0], winPos[1])) {
              pickedItems.push(item);
                }
            }
        }
    return pickedItems;
    };

/**
 * pic.checkPickItem take a page point and an item and checks if it would be
 * picked.
 *
 * @param pX X co-ordinate of the pick point
 * @param pY Y co-ordinate of the pick point
 * @param item The item being checked
 * @return true if the point matches the item.
 */
DRAWLIB.m_checkPickItemPic = function(pX, pY, item) {
    var winPos = this.pageToWindowCoords( pX, pY);
    if (item.p_drawable && item.p_visible && item.p_pickable &&
        item.pick(winPos[0], winPos[1])) { return true; }
    return false;
    };

/**
 * pic.contained is given a rectangle on the page and returns a list of
 * items contained within the rectangle, if any.
 *
 * @param layer The layer on which to find items
 * @param x1 One X limit of the rectangle 
 * @param y1 One Y limit of the rectangle 
 * @param x2 One X limit of the rectangle 
 * @param y2 One Y limit of the rectangle 
 * @return list of contained items (empty if none)
 */
DRAWLIB.m_containedPic = function(layer, x1, y1, x2, y2) {
    // Convert to window co-ords
    var wP1 = this.pageToWindowCoords( x1, y1 );
    var wP2 = this.pageToWindowCoords( x2, y2 );
    var xMin = Math.min(wP1[0], wP2[0]);
    var xMax = Math.max(wP1[0], wP2[0]);
    var yMin = Math.min(wP1[1], wP2[1]);
    var yMax = Math.max(wP1[1], wP2[1]);
    var containedItems = [];
    for (var itemName in this.p_items) {
        if (this.p_items.hasOwnProperty(itemName)) {
            var oneItem = this.p_items[itemName];
            if (oneItem.p_layer === layer && oneItem.p_drawable &&
                oneItem.p_visible && oneItem.p_pickable) {
                var BB = oneItem.p_pickBB;
                if ((xMin<=BB[0]) && (xMax>=BB[2]) &&
                    (yMin<=BB[1]) && (yMax>= BB[3])) {
                    containedItems.push(oneItem);
                    }
                }
            }
        }
    return containedItems;
    };

/**
 * pic.getMinZ returns the minimum Z value for any item.
 *
 * @return Z
 */
DRAWLIB.m_getMinZ = function() { return this.p_minZ; };

/**
 * pic.getMaxZ returns the maximum Z value for any item.
 *
 * @return Z
 */
DRAWLIB.m_getMaxZ = function() { return this.p_maxZ; };

/**
 * pic.setZ informs the pic that a Z value has been used and allows it to
 * update its minimum and maximum Z values.
 *
 * @param zVal Z value that has been applied.
 */
DRAWLIB.m_setZPic = function(zVal) {
    if (zVal < this.p_minZ) { this.p_minZ = zVal; }
    if (zVal > this.p_maxZ) { this.p_maxZ = zVal; }
    };

/**
 * pic.getItemByDBId returns the item with the given store id.
 *
 * @param dbId Store id of the desired item
 * @return relevant item (or undef if none)
 */
DRAWLIB.m_getItemByDBId = function( dbId ) { return this.p_itemsById[''+dbId]; };

/**
 * pic.completeGroups is called when creating a picture from stored information.
 * It causes all groups containing items from store to be completed.
 */
DRAWLIB.m_completeGroupsPic = function() {
    for (var itemName in this.p_items) {
        if (this.p_items.hasOwnProperty(itemName)) {
            var item = this.p_items[itemName];
            if (item.getType() === 'G') { item.setGroupMembersFromDBId() ;}
            }
        }
    };

/**
 * pic.setLayerVisibility sets the visibility for all items on a layer.
 * By default all items are visible.
 *
 * @param layer The layer number affected
 * @param visible The visibility value
 */
DRAWLIB.m_setLayerVisibility = function( layer, visible ) {
    for (var itemName in this.p_items) {
        if (this.p_items.hasOwnProperty(itemName)) {
            var oneItem = this.p_items[itemName];
            if (oneItem.p_layer === layer) { oneItem.p_visible = visible; }
            }
        }
    };

/**
 * pic.setLayerPickable sets the pickability for all items on a layer.
 * By default, all items are pickable.
 *
 * @param layer The layer number affected
 * @param visible The pickability value
 */
DRAWLIB.m_setLayerPickable = function( layer, pickable ) {
    for (var itemName in this.p_items) {
        if (this.p_items.hasOwnProperty(itemName)) {
	    var oneItem = this.p_items[itemName];
	    if (oneItem.p_layer === layer) { oneItem.p_pickable = pickable; }
	    }
        }
    };

/**
 * pic.setLayerZOffset applies a Z offset to all items in a layer.
 * Unfortunately, this might repeat through storage so use with care.
 *
 * @param layer The layer number affected
 * @param zOffset The Z offset to apply
 */
DRAWLIB.m_setLayerZOffset = function( layer, zOffset ) {
    for (var itemName in this.p_items) {
        if (this.p_items.hasOwnProperty(itemName)) {
	    var oneItem = this.p_items[itemName];
	    if (oneItem.p_layer === layer) {oneItem.setZ(oneItem.p_z+zOffset); }
	    }
        }
    };

