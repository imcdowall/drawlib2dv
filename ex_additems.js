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

function addRect(midX, midY, winWidth, winHeight, angle){
    var newItemId = DRAWAPP.nextItemId;
    DRAWAPP.nextItemId += 1;
    var newItem = 
        DRAWAPP.pic.createRect( newItemId, midX, midY, winWidth, winHeight,
        angle);
    if(DRAWAPP.fillStyle !== 'none') {
        newItem.setFillStyle(DRAWAPP.fillStyle);
        }
    return newItem;
    }
       
function addCirc(midX, midY, radius, angle){
    var newItemId = DRAWAPP.nextItemId;
    DRAWAPP.nextItemId += 1;
    var newItem=DRAWAPP.pic.createEllipse(newItemId, midX, midY, radius, angle);
    if(DRAWAPP.fillStyle !== 'none') {
        newItem.setFillStyle(DRAWAPP.fillStyle);
        }
    return newItem;
    }

function addFreehand(points){
    var newItemId = DRAWAPP.nextItemId;
    DRAWAPP.nextItemId += 1;
    var newItem = DRAWAPP.pic.createFreehand(newItemId, points);
    return newItem;
    }

function addPolyline(points){
    var newItemId = DRAWAPP.nextItemId;
    DRAWAPP.nextItemId += 1;
    var newItem = DRAWAPP.pic.createPolyline(newItemId, points);
    return newItem;
    }

// This function is called from the 'Save'button on a text dialog
function addText() {
    var newItemId = DRAWAPP.nextItemId;
    DRAWAPP.nextItemId += 1;
    var textVal = document.getElementById("id_body_text").value;
    var angle = parseInt(document.getElementById("text_rotation").value,10);
    var fontSize = parseInt(document.getElementById("text_size").value,10);
    var newItem = DRAWAPP.pic.createText(newItemId,
        DRAWAPP.textXY[0], DRAWAPP.textXY[1],
        textVal, angle, fontSize);
    if (DRAWAPP.itemFontColor) {
        newItem.setFontColorStyle(DRAWAPP.itemFontColor);
        }
    else { newItem.setFontColorStyle(DRAWAPP.fontColor) ; }
    if ( !DRAWAPP.hideTextBox ) {
        newItem.setLineStyle(DRAWAPP.itemLineStyle);
        newItem.setFillStyle(DRAWAPP.itemFillStyle);
        var winWidth =
            parseInt(document.getElementById("text_box_width").value, 10);
        if (winWidth) { newItem.setWidth(winWidth); }
        var winHeight =
            parseInt(document.getElementById("text_box_height").value, 10);
        if (winHeight) { newItem.setHeight(winHeight); }
        }
    newItem.setBoxes();
    hideDiv();
    DRAWAPP.pic.redrawAll();
    }

function addGroup( contained ) {
    var newItemId = DRAWAPP.nextItemId;
    DRAWAPP.nextItemId += 1;
    var newItem = DRAWAPP.pic.createGroupFromPic(newItemId, contained);
    }

// Place a new item on a mouse-up event
function placeItemClick(e) {
    var pic = DRAWAPP.pic;
    var startXY = pic.pageToWindowCoords(DRAWAPP.startX, DRAWAPP.startY);
    var endXY = pic.pageToWindowCoords(e.pageX, e.pageY);
    var midX = Math.floor(0.5+(startXY[0]+endXY[0])/2);
    var midY = Math.floor(0.5+(startXY[1]+endXY[1])/2);
    var winWidth = Math.abs(Math.floor(endXY[0]-startXY[0]+0.5));
    var winHeight = Math.abs(Math.floor(endXY[1]-startXY[1]+0.5));
    var newItem;
    var points = [];
    // Add the specific type of item
    if (DRAWAPP.mouseMode === DRAWAPP.mousePlaceRect) {
        newItem = addRect( midX, midY, winWidth, winHeight, 0);
        }
    if (DRAWAPP.mouseMode === DRAWAPP.mousePlaceEllipse) {
        var radius = Math.floor(0.5+Math.min(winWidth, winHeight)/2);
        newItem = addCirc( midX, midY, radius, 0);
        }
    if (DRAWAPP.mouseMode === DRAWAPP.mousePlaceLine) {
        points = [startXY, endXY];
        newItem = addPolyline(points);
        }
    if (DRAWAPP.mouseMode === DRAWAPP.mousePlaceFreehand) {
        DRAWAPP.lineSet.push([e.pageX, e.pageY]);
        var len = DRAWAPP.lineSet.length;
        for (var i = 0 ; i < len ; i++ ) {
            var onePoint = 
                pic.pageToWindowCoords(DRAWAPP.lineSet[i][0],
                                       DRAWAPP.lineSet[i][1]);
            points.push(onePoint);
            }
        newItem = addFreehand(points);
        }
    if (DRAWAPP.mouseMode === DRAWAPP.mouseSelectGroup) {
        // Find selected items, if any
        var groupedItems = DRAWAPP.pic.contained(0,
            DRAWAPP.startX, DRAWAPP.startY, e.pageX, e.pageY);
        if (groupedItems.length) {
            addGroup( groupedItems ) ;
            }
        }
    // Don't have the text yet so store the location and bring up a dialog
    if (DRAWAPP.mouseMode === DRAWAPP.mousePlaceText) {
        DRAWAPP.textXY = pic.pageToWindowCoords(e.pageX, e.pageY);
        DRAWAPP.placeText = true;
        // Prime the Text dialog
        document.getElementById("id_body_text").value = '';
        document.getElementById("text_rotation").value = '0';
        document.getElementById("text_size").value = DRAWAPP.newTextSize;
        setItemLineStyle(''); // Unset
        setItemFillStyle(''); // Unset
        document.getElementById("text_box_div").setAttribute("class", "hidden");
        document.getElementById("text_box_check").checked = false;
        showDiv('text_div');
        document.getElementById('text_z_butt').setAttribute("class", "hidden");
        document.getElementById("id_body_text").focus();
        }
    // Standard actions for (almost) all.
    // Text is one exception because we need to put up a dialog to capture the
    // actual text.
    // Group is the other because it doesn't have line width & colour and is
    // logged separately.
    if ((DRAWAPP.mouseMode !== DRAWAPP.mousePlaceText) &&
        (DRAWAPP.mouseMode !== DRAWAPP.mouseSelectGroup)) {
        newItem.setLineWidth(DRAWAPP.lineWidth);
        newItem.setLineStyle(DRAWAPP.lineStyle);
        DRAWAPP.pic.redrawAll();
        }
    if (DRAWAPP.mouseMode === DRAWAPP.mouseSelectGroup) {
        DRAWAPP.pic.redrawAll();
        }
    }
