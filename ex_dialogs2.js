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

function setSizeDialog() { // Show a dialog with the picture size
    document.getElementById("drwg_width").value = DRAWAPP.width;
    document.getElementById("drwg_height").value = DRAWAPP.height;
    showDiv('drawing_admin_div');
    }

function setSize() { // Save new size
    var newWidth = parseInt(document.getElementById("drwg_width").value, 10);
    var newHeight = parseInt(document.getElementById("drwg_height").value, 10);
    DRAWAPP.width = newWidth;
    DRAWAPP.height = newHeight;
    DRAWAPP.pic.setWindowBoundary(0, 0, newWidth, newHeight);
    DRAWAPP.pic.redrawAll();
    hideDiv('drawing_admin_div');
    }

// Not currently used, always white, could be re-added
function setBackground(background) {
    DRAWAPP.background = background;
    DRAWAPP.pic.redrawAll();
    }

// Show a dialog about an item based on type
function setItemDialog(oneItem) {
    var itemType = oneItem.getType();
    DRAWAPP.shownItem = oneItem;
    if (itemType === 'R') { // Rectangle
        document.getElementById("rect_width").value = oneItem.getWidth();
        document.getElementById("rect_height").value = oneItem.getHeight();
        document.getElementById("rect_rotation").value = oneItem.getAngle();
        if (oneItem.getGroup()) {
            document.getElementById("rect_group_p").
                setAttribute("class", "shown");
            }
        else {
            document.getElementById("rect_group_p").
                setAttribute("class", "hidden");
            }
        setButton('rlc'+oneItem.getLineStyle().replace('#',''));
        setButton('rfc'+oneItem.getFillStyle().replace('#',''));
        setButton('rlw'+oneItem.getLineWidth());
        showDiv('rect_div');
        }
    if (itemType === 'C' ) { // Circle
        document.getElementById("circ_radius").value = oneItem.getRadius();
        if (oneItem.getGroup()) {
            document.getElementById("circ_group_p").
                setAttribute("class", "shown");
            }
        else {
            document.getElementById("circ_group_p").
                setAttribute("class", "hidden");
            }
        setButton('clc'+oneItem.getLineStyle().replace('#',''));
        setButton('cfc'+oneItem.getFillStyle().replace('#',''));
        setButton('clw'+oneItem.getLineWidth());
        showDiv('circ_div');
        }
    if ((itemType === 'P') || (itemType === 'F')) { // Line or freehand
        if (oneItem.getGroup()) {
            document.getElementById("poly_group_p").
                setAttribute("class", "shown");
            }
        else {
            document.getElementById("poly_group_p").
                setAttribute("class", "hidden");
            }
        setButton('llc'+oneItem.getLineStyle().replace('#',''));
        setButton('llw'+oneItem.getLineWidth());
        showDiv('poly_div');
        }
    if (itemType === 'T' ) { // Text to edit
        document.getElementById("id_body_text").value = oneItem.getText();
        document.getElementById("text_rotation").value = oneItem.getAngle();
        document.getElementById("text_size").value = oneItem.getFontSize();
        // The text may have an enclosing box or not
        if (oneItem.getFillStyle() || oneItem.getLineStyle()) {
            DRAWAPP.hideTextBox = false;
            document.getElementById("text_box_div").
                setAttribute("class", "shown");
            document.getElementById("text_box_check").checked = true;
            document.getElementById("text_box_width").value = oneItem.getWidth();
            document.getElementById("text_box_height").value =oneItem.getHeight();
            }
        else {
            DRAWAPP.hideTextBox = true;
            document.getElementById("text_box_div").
                setAttribute("class", "hidden");
            document.getElementById("text_box_check").checked = false;
            }
        if (oneItem.getGroup()) {
            document.getElementById("text_group_p").
                setAttribute("class", "shown");
            }
        else {
            document.getElementById("text_group_p").
                setAttribute("class", "hidden");
            }
        setButton('ttc'+oneItem.getFontColorStyle().replace('#',''));
        setButton('tlc'+oneItem.getLineStyle().replace('#',''));
        setButton('tfc'+oneItem.getFillStyle().replace('#',''));
        setButton('tlw'+oneItem.getLineWidth());
        showDiv('text_div');
        document.getElementById('text_z_butt').setAttribute("class", "shown");
        document.getElementById("id_body_text").focus();
        }
    // Unset values ready for buttons to be pressed
    DRAWAPP.itemLineStyle = undefined;
    DRAWAPP.itemFillStyle = undefined;
    DRAWAPP.itemLineWidth = undefined;
    DRAWAPP.itemFontColor = undefined;
    DRAWAPP.itemRemoveFromGroup = false;
    DRAWAPP.itemDissolveGroup = false;
    }

// Function to show or hide the text box fields
function showTextBox(show) {
    if (show) {
        var oneItem = DRAWAPP.shownItem;
        DRAWAPP.hideTextBox = false;
        document.getElementById("text_box_div").setAttribute("class", "shown");
        document.getElementById("text_box_width").value = oneItem.getWidth();
        document.getElementById("text_box_height").value = oneItem.getHeight();
        }
    else {
        DRAWAPP.hideTextBox = true;
        document.getElementById("text_box_div").setAttribute("class", "hidden");
        }
    }

function clickTextBox() {
    showTextBox(document.getElementById('text_box_check').checked);
    }

// Action from the 'Delete' button on an item dialog
// A confirmation might be nice?
function deleteItemFromPage() {
    var oneItem = DRAWAPP.shownItem;
    // Remove from the picture and redraw the item
    DRAWAPP.pic.deleteItem(oneItem.getId());
    DRAWAPP.shownItem = undefined;
    hideDiv();
    DRAWAPP.pic.redrawAll();
    }

// 'Save' from an item dialog
// This comes from an edit dialog, with the possible exception of text where
// we also come via this method to place new text
function saveItemSettings() {
  if (DRAWAPP.placeText) { return addText(); } // Text is placed from the dialog
    var oneItem = DRAWAPP.shownItem;
    var itemType = oneItem.getType();
    // Do common styles
    if (DRAWAPP.itemLineStyle) { oneItem.setLineStyle(DRAWAPP.itemLineStyle); }
    if (DRAWAPP.itemFillStyle) { oneItem.setFillStyle(DRAWAPP.itemFillStyle); }
    if (DRAWAPP.itemLineWidth) { oneItem.setLineWidth(DRAWAPP.itemLineWidth); }
    if (DRAWAPP.itemFontColor) {
        oneItem.setFontColorStyle(DRAWAPP.itemFontColor);
        }
    // Apply item type specific values
    try {
        if (itemType === 'R') { // rectangle
            oneItem.setWidth(
                parseInt(document.getElementById("rect_width").value, 10));
            oneItem.setHeight(
                parseInt(document.getElementById("rect_height").value, 10));
            oneItem.setAngle(
                parseInt(document.getElementById("rect_rotation").value, 10));
            }
        if (itemType === 'C') { // circle
            oneItem.setRadius(
                parseInt(document.getElementById("circ_radius").value, 10));
            }
        if (itemType === 'T') { // text
            oneItem.setText(document.getElementById("id_body_text").value);
            oneItem.setAngle(
                parseInt(document.getElementById("text_rotation").value, 10));
            oneItem.setFontSize(
                parseInt(document.getElementById("text_size").value, 10));
            if ( DRAWAPP.hideTextBox ) { // Override values
                oneItem.setLineStyle('');
                oneItem.setFillStyle('');
                }
            else { // Set from either recent ones or defaults
                // May already be set but may need to default
                if (DRAWAPP.itemLineStyle) {
                    oneItem.setLineStyle(DRAWAPP.itemLineStyle);
                    }
                else { if (!oneItem.getLineStyle()) {
                    oneItem.setLineStyle(DRAWAPP.lineStyle);
                    } }
                if (DRAWAPP.itemFillStyle) {
                    oneItem.setFillStyle(DRAWAPP.itemFillStyle);
                    }
                else { if (!oneItem.getFillStyle()) {
                    oneItem.setFillStyle(DRAWAPP.fillStyle);
                    } }
                var winWidth =
                    parseInt(document.getElementById("text_box_width").value,10);
                if (winWidth) { oneItem.setWidth(winWidth); }
                var winHeight =
                    parseInt(document.getElementById("text_box_height").value,10);
                if (winHeight) { oneItem.setHeight(winHeight); }
                }
            }
        // Polyline and freehand don't have specific attributes
        }
    catch(err) { // Don't think this can happen any more
        alert('Invalid value(s)');
        return;
        }
    // Do common group handling
    var oneGroup;
    if (DRAWAPP.itemDissolveGroup) {
        oneGroup = oneItem.getGroup();
        if (oneGroup) {
            oneGroup.clear(); // Inform all group members
            DRAWAPP.selectedGroup = undefined; // Group no longer selected
            DRAWAPP.selectedGroupMembers = undefined;
            }
        }
    else {
        if (DRAWAPP.itemRemoveFromGroup) { 
            oneGroup = oneItem.getGroup();
            if (oneGroup) {
                oneGroup.removeMember( oneItem );
                DRAWAPP.selectedGroup = undefined; // Group no longer selected
                DRAWAPP.selectedGroupMembers = undefined;
                }
            }
        }
    // Extend re-draw area if necessary
    oneItem.setBoxes();
    DRAWAPP.shownItem = undefined;
    hideDiv();
    DRAWAPP.pic.redrawAll();
    reHighlight();
    }

// Move Z position relative to current value
function setZRel(direction) {
    var oneItem = DRAWAPP.shownItem;
    oneItem.setZ(oneItem.getZ() + direction);
    DRAWAPP.pic.redrawAll();
    reHighlight();
    }

// Move Z position in absolute terms
function setZAbs(direction) {
    if (direction < 0) { DRAWAPP.shownItem.setZ(DRAWAPP.pic.getMinZ()-1); }
    if (direction > 0) { DRAWAPP.shownItem.setZ(DRAWAPP.pic.getMaxZ()+1); }
    DRAWAPP.pic.redrawAll();
    reHighlight();
    }
