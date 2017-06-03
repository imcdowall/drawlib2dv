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
// For JSHint
/*jshint strict:false, nonstandard:true*/
/*global DRAWLIB:false,alert:false */
var DRAWAPP = {'nextItemId':0};

// Is a modal dialog present
DRAWAPP.modalDialog = false;
DRAWAPP.shownDiv = '';

function getIntVal( fieldId, defaultVal ) {
    var retVal = defaultVal;
    try { var valVal = parseInt(document.getElementById(fieldId).value, 10);
        if (!isNaN(valVal)) { retVal = valVal;}
        }
    catch(e) { retVal = defaultVal; } // Ignore failure
    return retVal;
    }

function onResize() {
    var canvasHeight = window.innerHeight - 60;
    var canvasWidth = window.innerWidth - 320;
    DRAWAPP.pic.resetCanvasDimensions(canvasWidth, canvasHeight);
    DRAWAPP.pic.redrawAll();
    return false;
    }
window.onresize = onResize;

function reHighlight() {
    if (DRAWAPP.selectedGroupMembers) { // highlight a group
        for (var i= 0 ;i < DRAWAPP.selectedGroupMembers.length ;i++) {
            DRAWAPP.selectedGroupMembers[i].highlight('#0000FF');
            }
        }
    if (DRAWAPP.pickedItem) {
        DRAWAPP.pickedItem.highlight('#FF0000');
        DRAWAPP.handles = DRAWAPP.pickedItem.drawHandles('#0000FF', 8);
        }
    }

// A set of functions to pan and zoom.
// Most of the work takes place in the drawing library but we may need to
// re-highlight selected items.
function appPanLeft() {
    DRAWAPP.pic.panLeft();
    reHighlight();
    }

function appPanRight() {
    DRAWAPP.pic.panRight();
    reHighlight();
    }

function appPanUp() {
    DRAWAPP.pic.panUp();
    reHighlight();
    }

function appPanDown() {
    DRAWAPP.pic.panDown();
    reHighlight();
    }

function appZoomIn() {
    DRAWAPP.pic.zoomIn();
    reHighlight();
    }

function appZoomOut() {
    DRAWAPP.pic.zoomOut();
    reHighlight();
    }

