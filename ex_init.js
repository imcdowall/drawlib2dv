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

function CreateAllButtonSets() {
    // Mouse mode buttons
    createButtonSet( 'mm', 'btn', 'setbtn',
        ['rect_button', 'circ_button', 'line_button', 'freehand_button', 
         'text_button', 'select_button', 'group_button']);

    // Rectangle Item Dialog
    // rectangle dialog line colours
    createButtonSet( 'rlc', 'btn', 'setbtn',
        ['rlc000000', 'rlcFF0000', 'rlc00FF00', 'rlc0000FF', 'rlc00FFFF',
         'rlcFF00FF', 'rlcFFFF00', 'rlcFFFFFF']);
    // rectangle dialog line widths
    createButtonSet( 'rlw', 'btn', 'setbtn',
        ['rlw1', 'rlw2', 'rlw3', 'rlw5']);
    // rectangle dialog fill colours
    createButtonSet( 'rfc', 'btn', 'setbtn',
        ['rfc000000', 'rfcFF0000', 'rfc00FF00', 'rfc0000FF', 'rfc00FFFF',
         'rfcFF00FF', 'rfcFFFF00', 'rfcFFFFFF','rfc']);

    // Circle Item Dialog
    // circle dialog line colours
    createButtonSet( 'clc', 'btn', 'setbtn',
        ['clc000000', 'clcFF0000', 'clc00FF00', 'clc0000FF', 'clc00FFFF',
         'clcFF00FF', 'clcFFFF00', 'clcFFFFFF']);
    // circle dialog line widths
    createButtonSet( 'clw', 'btn', 'setbtn',
        ['clw1', 'clw2', 'clw3', 'clw5']);
    // circle dialog fill colours
    createButtonSet( 'cfc', 'btn', 'setbtn',
        ['cfc000000', 'cfcFF0000', 'cfc00FF00', 'cfc0000FF', 'cfc00FFFF',
         'cfcFF00FF', 'cfcFFFF00', 'cfcFFFFFF','cfc']);

    // Line Item Dialog
    // line dialog line colours
    createButtonSet( 'llc', 'btn', 'setbtn',
        ['llc000000', 'llcFF0000', 'llc00FF00', 'llc0000FF', 'llc00FFFF',
         'llcFF00FF', 'llcFFFF00', 'llcFFFFFF']);
    // line dialog line widths
    createButtonSet( 'llw', 'btn', 'setbtn',
        ['llw1', 'llw2', 'llw3', 'llw5']);

    // Text Item Dialog
    // text dialog text colours
    createButtonSet( 'ttc', 'btn', 'setbtn',
        ['ttc000000', 'ttcFF0000', 'ttc00FF00', 'ttc0000FF', 'ttc00FFFF',
         'ttcFF00FF', 'ttcFFFF00', 'ttcFFFFFF']);
    // text dialog line colours
    createButtonSet( 'tlc', 'btn', 'setbtn',
        ['tlc000000', 'tlcFF0000', 'tlc00FF00', 'tlc0000FF', 'tlc00FFFF',
         'tlcFF00FF', 'tlcFFFF00', 'tlcFFFFFF']);
    // text dialog line widths
    createButtonSet( 'tlw', 'btn', 'setbtn',
        ['tlw1', 'tlw2', 'tlw3', 'tlw5']);
    // text dialog fill colours
    createButtonSet( 'tfc', 'btn', 'setbtn',
        ['tfc000000', 'tfcFF0000', 'tfc00FF00', 'tfc0000FF', 'tfc00FFFF',
         'tfcFF00FF', 'tfcFFFF00', 'tfcFFFFFF','tfc']);

    // New Items Dialog
    // new item line colours
    createButtonSet( 'nlc', 'btn', 'setbtn',
        ['nlc000000', 'nlcFF0000', 'nlc00FF00', 'nlc0000FF', 'nlc00FFFF',
         'nlcFF00FF', 'nlcFFFF00', 'nlcFFFFFF']);
    // new item line widths
    createButtonSet( 'nlw', 'btn', 'setbtn',
        ['nlw1', 'nlw2', 'nlw3', 'nlw5']);
    // new item fill colours
    createButtonSet( 'nfc', 'btn', 'setbtn',
        ['nfc000000', 'nfcFF0000', 'nfc00FF00', 'nfc0000FF', 'nfc00FFFF',
         'nfcFF00FF', 'nfcFFFF00', 'nfcFFFFFF','nfc']);
    // new item text colours
    createButtonSet( 'ntc', 'btn', 'setbtn',
        ['ntc000000', 'ntcFF0000', 'ntc00FF00', 'ntc0000FF', 'ntc00FFFF',
         'ntcFF00FF', 'ntcFFFF00', 'ntcFFFFFF']);
    }

function setDrawing( width, height, background) {
    DRAWAPP.width = width;
    DRAWAPP.height = height;
    DRAWAPP.background = background;
    DRAWAPP.canvas = document.getElementById("drawing_canvas");
    DRAWAPP.pic = DRAWLIB.createPicture(DRAWAPP.canvas, background);
    DRAWAPP.canvas.onmousedown = mouseDown;
    DRAWAPP.canvas.onmousemove = mouseMove;
    DRAWAPP.canvas.onmouseup = mouseUp;
    DRAWAPP.mouseIsDown = false;
    DRAWAPP.editDialogShown = false;
    DRAWAPP.itemFirstClick = false;
    DRAWAPP.selected = false;
    DRAWAPP.pickedItem = undefined;
    DRAWAPP.handleSelected = -1;
    CreateAllButtonSets();
    setMouseMode(0);
    onResize();
    DRAWAPP.pic.setWindow(0, 0, width, height);
    DRAWAPP.pic.setWindowBoundary(0, 0, width, height);
    DRAWAPP.pic.redrawAll();
    }

function initDrawing() {
    DRAWAPP.lineWidth = 1;
    DRAWAPP.lineStyle = '#000000';
    DRAWAPP.fontColor = '#000000';
    DRAWAPP.fillStyle = '';
    DRAWAPP.newTextSize = '10';
    document.getElementById('new_text_size').value = DRAWAPP.newTextSize;
    DRAWAPP.canvasSize = 1000;
    setDrawing( 1000, 1000, "#FFFFFF");
    onResize();
    }

