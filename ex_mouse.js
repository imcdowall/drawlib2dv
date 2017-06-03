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

// Mouse modes - constants
DRAWAPP.mouseSelect = 0;  // Select an item, don't placeone
DRAWAPP.mousePlaceRect = 1; // Place a rectangle
DRAWAPP.mousePlaceEllipse = 2; // Place an ellipse
DRAWAPP.mousePlacePoly = 3; // Place a polyline
DRAWAPP.mousePlaceLine = 4; // Place a line
DRAWAPP.mousePlaceFreehand = 5; // Place a freehand line
DRAWAPP.mousePlaceText = 6; // Place text
DRAWAPP.mouseSelectGroup = 7; // Rectangle to create group

// Collection of information for each mouse mode
// Indexed by numeric mouse mode, then:
//   id of selection button (to highlight)
DRAWAPP.mouseModeData = {
    '0': { 'bid':'select_button' },
    '1': { 'bid':'rect_button' },
    '2': { 'bid':'circ_button' },
    '3': { 'bid':'rect_button' },
    '4': { 'bid':'line_button' },
    '5': { 'bid':'freehand_button' },
    '6': { 'bid':'text_button' },
    '7': { 'bid':'group_button' }
    };

function clearHighlights() {
    if (DRAWAPP.pickedItem) {
        DRAWAPP.pickedItem = undefined;
        DRAWAPP.handles = undefined;
        DRAWAPP.selectedGroup = undefined;
        DRAWAPP.selectedGroupMembers = undefined;
        DRAWAPP.pic.redrawAll();
        }
    }

function setMouseMode(modeVal) {
    DRAWAPP.placeText = false;
    DRAWAPP.mouseMode = modeVal;
    clearHighlights();
    var modeData = DRAWAPP.mouseModeData[''+modeVal];
    setButton(modeData.bid);
    }

//====================================================================
// Mouse methods for select mode
//
// on mousedown
// if dialog shown then do nothing
// - if item already selected, compare point to handles, if handle selected
//   then record it
// - if item selected, check still picked;
//     if not then un-highlight (redarw all)
//
// on mousemove
// if dialog shown then do nothing
// - if handle selected the drag a handle
// - if no handle selected then drag the item
//
// on mouseup
// if dialog shown then do nothing
// - if dragging item then offset
// - if dragging handle then stretch
// - if not dragging and item selected and first click then highlight and
//   draw handles and unset first click
// - if not dragging and item still selected and not first click then raise
//   edit dialog

function mouseDownSelect(e) {
    if (DRAWAPP.editDialogShown) { return; }
    var i;
    DRAWAPP.handleSelected = -1;
    if (DRAWAPP.pickedItem) {
        // Check for a handle being selected
        var cP = DRAWAPP.pic.pageToCanvasCoords(e.pageX, e.pageY);
        for( i = 0 ; i < 8 ; i++) {
            if((Math.abs(cP[0]-DRAWAPP.handles[i][0]) < 4) &&
               (Math.abs(cP[1]-DRAWAPP.handles[i][1]) < 4)) {
                DRAWAPP.handleSelected = i;
                DRAWAPP.selected = true;
                DRAWAPP.pickedItem.setDrag(true);
                break;
                }
            }
        if (DRAWAPP.handleSelected >= 0) { return; }
        
        // Check if the same item has been selected, if not then
        // unset it
        if (DRAWAPP.pic.checkPickItem(e.pageX, e.pageY, DRAWAPP.pickedItem)) {
            DRAWAPP.selected = true;
            DRAWAPP.pickedItem.setDrag(true);
            }
        else {
            DRAWAPP.pickedItem = undefined;
            DRAWAPP.selectedGroupMembers = undefined;
            DRAWAPP.selectedGroup = 0;
            DRAWAPP.pic.redrawAll();
            }
        }
    // We are not picking the existing item
    // Check for a new item picked
    if (!DRAWAPP.pickedItem) {
        var pickedItem = DRAWAPP.pic.pick(e.pageX, e.pageY);
        if (pickedItem) {
            pickedItem.setDrag(true);
            DRAWAPP.selected = true;
            DRAWAPP.itemFirstClick = true;
            DRAWAPP.pickedItem = pickedItem;
            DRAWAPP.selectedGroup = pickedItem.getGroup();
            if ( DRAWAPP.selectedGroup ) {
                DRAWAPP.selectedGroupMembers =
                    DRAWAPP.selectedGroup.getMembers();
                for ( i= 0 ; i < DRAWAPP.selectedGroupMembers.length ; i++) {
                    DRAWAPP.selectedGroupMembers[i].setDrag(true);
                    }
                }
            }
        }
    }

function mouseMoveSelect(e) {
    if (DRAWAPP.editDialogShown) { return; }
    if (!DRAWAPP.pickedItem) { return; }
    if (DRAWAPP.handleSelected >= 0) { // Drag a handle
        DRAWAPP.pickedItem.drawStretch( DRAWAPP.handleSelected,
            DRAWAPP.lastPoint[0]-DRAWAPP.startX,
            DRAWAPP.lastPoint[1]-DRAWAPP.startY,
            e.pageX-DRAWAPP.startX, e.pageY-DRAWAPP.startY, true);
        }
    else {
        if (DRAWAPP.selectedGroupMembers) { // Drag a group
            DRAWAPP.selectedGroup.drawOffset(
                DRAWAPP.lastPoint[0]-DRAWAPP.startX,
                DRAWAPP.lastPoint[1]-DRAWAPP.startY,
                e.pageX-DRAWAPP.startX, e.pageY-DRAWAPP.startY, true);
            }
        else { // Drag a single element
            DRAWAPP.pickedItem.drawOffset(
                DRAWAPP.lastPoint[0]-DRAWAPP.startX,
                DRAWAPP.lastPoint[1]-DRAWAPP.startY,
                e.pageX-DRAWAPP.startX, e.pageY-DRAWAPP.startY, true);
            }
        }
    }

function mouseUpSelect(e) {
    if (DRAWAPP.editDialogShown) { return; }
    if (!DRAWAPP.pickedItem) { return; }
    var item = DRAWAPP.pickedItem;
    item.setDrag(false);
    if (DRAWAPP.hasDragged) { // Drag the selected item(s)
        var movedX = e.pageX - DRAWAPP.startX;
        var movedY = e.pageY - DRAWAPP.startY;
        var xOffset = DRAWAPP.pic.pageToWindowDistance(movedX);
        var yOffset = DRAWAPP.pic.pageToWindowDistance(movedY);

        if (DRAWAPP.handleSelected >= 0) { // Drag a handle
            item.stretch(DRAWAPP.handleSelected, xOffset, yOffset);
            }
        else {
            if (DRAWAPP.selectedGroupMembers) { // Drag a group
                for (var i= 0 ;i < DRAWAPP.selectedGroupMembers.length ;i++) {
                    var oneItem = DRAWAPP.selectedGroupMembers[i];
                    oneItem.offset(xOffset, yOffset);
                    oneItem.setDrag(false);
                    }
                }
            else { // Drag a single item
                item.offset(xOffset, yOffset);
                }
            }

        DRAWAPP.pic.redrawAll();
        reHighlight();
        }
    // if not dragging and not first click then put up an edit dialog
    if ((!DRAWAPP.hasDragged) && (!DRAWAPP.itemFirstClick)) {
        DRAWAPP.selected = false;
        setItemDialog(item);
        }
    // If not dragging and first click then highlight the picked item
    if (!DRAWAPP.hasDragged && DRAWAPP.itemFirstClick) {
        reHighlight();
        DRAWAPP.itemFirstClick = false;
        }
    DRAWAPP.selected = false;
    }

//====================================================================
function mouseDown(e) {
    if (DRAWAPP.modalDialog) { return; }
    DRAWAPP.mouseIsDown = true;
    DRAWAPP.hasDragged = false;
    DRAWAPP.startX = e.pageX;
    DRAWAPP.startY = e.pageY;
    DRAWAPP.lastPoint = [e.pageX, e.pageY];
    if (DRAWAPP.mouseMode === DRAWAPP.mouseSelect) {
        mouseDownSelect(e);
        }
    if ((DRAWAPP.mouseMode === DRAWAPP.mousePlaceRect) ||
        (DRAWAPP.mouseMode === DRAWAPP.mousePlaceEllipse) ||
        (DRAWAPP.mouseMode === DRAWAPP.mousePlacePoly) ||
        (DRAWAPP.mouseMode === DRAWAPP.mousePlaceLine) ||
        (DRAWAPP.mouseMode === DRAWAPP.mousePlaceFreehand) ||
        (DRAWAPP.mouseMode === DRAWAPP.mousePlaceText) ||
        (DRAWAPP.mouseMode === DRAWAPP.mouseSelectGroup)) {
        DRAWAPP.lineSet = [];
        // Don't do anything yet, will start drawing a box under mouseMove
        }
    }

function mouseMove(e) {
    if (DRAWAPP.modalDialog) { return; }
    DRAWAPP.hasDragged = true;
    // Dragging one or more items
    if ((DRAWAPP.mouseMode === DRAWAPP.mouseSelect) && DRAWAPP.selected) {
        mouseMoveSelect(e);
        }
    // Draw rectangle before selecting group
    if (DRAWAPP.mouseMode === DRAWAPP.mouseSelectGroup) {
        if(DRAWAPP.mouseIsDown) {
            DRAWAPP.pic.drawDragRect(DRAWAPP.startX, DRAWAPP.startY,
                DRAWAPP.lastPoint[0], DRAWAPP.lastPoint[1], e.pageX, e.pageY,
                '#A0A0A0');
            }
        }
    // Dynamically draw rectangle
    if (DRAWAPP.mouseMode === DRAWAPP.mousePlaceRect) {
        if(DRAWAPP.mouseIsDown) {
            DRAWAPP.pic.drawDragRect(DRAWAPP.startX, DRAWAPP.startY,
                DRAWAPP.lastPoint[0], DRAWAPP.lastPoint[1], e.pageX, e.pageY,
                DRAWAPP.lineStyle);
            }
        }
    // Dynamically draw ellipse
    if (DRAWAPP.mouseMode === DRAWAPP.mousePlaceEllipse) {
        if(DRAWAPP.mouseIsDown) {
            DRAWAPP.pic.drawDragEllipse(DRAWAPP.startX, DRAWAPP.startY,
                DRAWAPP.lastPoint[0], DRAWAPP.lastPoint[1], e.pageX, e.pageY,
                DRAWAPP.lineStyle);
            }
        }
    // Dynamically draw line
    if (DRAWAPP.mouseMode === DRAWAPP.mousePlaceLine) {
        if(DRAWAPP.mouseIsDown) {
            DRAWAPP.pic.redrawSectionPage(DRAWAPP.startX, DRAWAPP.startY,
                DRAWAPP.lastPoint[0], DRAWAPP.lastPoint[1]);
            DRAWAPP.pic.drawPageLine(DRAWAPP.startX, DRAWAPP.startY,
                e.pageX, e.pageY, DRAWAPP.lineStyle, DRAWAPP.lineWidth);
            }
        }
    // Dynamically draw freehand
    if (DRAWAPP.mouseMode === DRAWAPP.mousePlaceFreehand) {
        if(DRAWAPP.mouseIsDown) {
            DRAWAPP.lineSet.push([e.pageX, e.pageY]);
            DRAWAPP.pic.drawPageLine(
                DRAWAPP.lastPoint[0], DRAWAPP.lastPoint[1],
                e.pageX, e.pageY, DRAWAPP.lineStyle, DRAWAPP.lineWidth);
            }
        }
    // Dynamically draw text
    //if (DRAWAPP.mouseMode === DRAWAPP.mousePlaceText) {
    //    if(DRAWAPP.mouseIsDown) { // nothing, just use final point
    //        }
    //    }
    DRAWAPP.lastPoint = [e.pageX, e.pageY];
    }

function mouseUp(e) {
    if (DRAWAPP.modalDialog) { return; }
    // Drag or edit an item
    if ((DRAWAPP.mouseMode === DRAWAPP.mouseSelect) && DRAWAPP.selected) {
        mouseUpSelect(e);
        }
    // Place an item
    if ((DRAWAPP.mouseMode === DRAWAPP.mousePlaceRect) ||
        (DRAWAPP.mouseMode === DRAWAPP.mousePlaceEllipse) ||
        (DRAWAPP.mouseMode === DRAWAPP.mousePlacePoly) ||
        (DRAWAPP.mouseMode === DRAWAPP.mousePlaceLine) ||
        (DRAWAPP.mouseMode === DRAWAPP.mousePlaceFreehand) ||
        (DRAWAPP.mouseMode === DRAWAPP.mousePlaceText) ||
        (DRAWAPP.mouseMode === DRAWAPP.mouseSelectGroup)) {
        DRAWAPP.mouseIsDown = false;
        placeItemClick(e);
        }
    DRAWAPP.mouseIsDown = false;
    }

