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
// Factory function to create an item from saved JSON

/**
 * pic.createItemFromJSON is given a parsed JSON version of an item and
 * recreates it.
 *
 * @param data The parsed JSON for the item.
 * @param id The item id
 */
DRAWLIB.m_createItemFromJSON = function(data, id) {
    var newItem ;
    var points = [];
    var i, ps;
    if (data.t ==='R') {
        newItem = this.createRect(id, data.mx, data.my, data.w, data.h, data.a);
        }
    if (data.t ==='C') {
        newItem = this.createEllipse(id, data.mx, data.my, data.r, data.a);
        }
    if (data.t ==='PL' || data.t === 'P') {
        for ( i = 0 ; i < data.p.length ; i++ ) {
            ps = data.p[i].split('_');
            points.push([parseInt(ps[0],10), parseInt(ps[1],10)]);
            }
        newItem = this.createPolyline(id, points);
        var arrow1 = 0;
        var arrow2 = 0;
        if (data.arrow1) { arrow1 = data.arrow1; }
        if (data.arrow2) { arrow2 = data.arrow2; }
        if (data.arrow1 || data.arrow2) { newItem.setArrows( arrow1, arrow2 ); }
        }
    if (data.t ==='F') {
        for ( i = 0 ; i < data.p.length ; i++ ) {
            ps = data.p[i].split('_');
            points.push([parseInt(ps[0],10), parseInt(ps[1],10)]);
            }
        newItem = this.createFreehand(id, points);
        }
    if (data.t ==='PG') {
        for ( i = 0 ; i < data.p.length ; i++ ) {
            ps = data.p[i].split('_');
            points.push([parseInt(ps[0],10), parseInt(ps[1],10)]);
            }
        newItem = this.createPolygon(id, points, data.fs);
        }
    if (data.t ==='T') {
        var rawText =  DRAWLIB.unescapeQuotes(data.tx);
        newItem = this.createText(id, data.mx, data.my, rawText, data.a,
            data.sz);
        if (data.va) { newItem.setTextBaseline(data.va); }
        if (data.fc) { newItem.setFontColorStyle(data.fc); }
        if (data.fst) { newItem.setFontStyle(data.fst); }
        if (data.ff) { newItem.setFontFamily(data.ff); }
        }
    if (data.t ==='I') {
        newItem = this.createImage(id, data.img, data.mx, data.my, data.w,
            data.h, data.a);
        newItem.setBoxes();
        }
    if (data.t ==='G') {
        newItem = this.createGroupFromDB(id, data.m);
        }

    // Common factors, not all in all cases but fairly common
    if (newItem) {
        if (data.layer) { newItem.setLayer(data.layer); }
        if (data.z) { newItem.setZ(data.z); }
        if (data.lw) { newItem.setLineWidth(data.lw); }
        if (data.ls) { newItem.setLineStyle(data.ls); }
        if (data.fs) { newItem.setFillStyle(data.fs); }
        }
    if ( data.t === 'T' ) {
        // Set size after font size, line & fill style are set
        // The initial setBoxes() will override the size
        if (data.w) { newItem.setWidth(data.w); }
        if (data.h) { newItem.setHeight(data.h); }
        newItem.setBoxes();
        }
    return newItem;
    };

/**
 * item.getType returns a string that denotes the type of graphic item.
 *
 * @return string with the type of item, such as 'R', 'G or 'F'
 */
DRAWLIB.m_getType = function() { return this.p_type; };

/**
 * item.getId returns the local id for an item.
 *
 * @return local id
 */
DRAWLIB.m_getId = function() { return this.p_id; };

/**
 * item.getDbId returns the database id for an item. DRAWLIB does nothing with
 * this but it can be used for external storage purposes.
 *
 * @return dbId Database (or other) id
 */
DRAWLIB.m_getDbId = function() { return this.p_dbId; };

/**
 * item.setDbId sets the database id for an item. DRAWLIB does nothing with
 * this but it can be used for external storage purposes.
 *
 * @param dbId Database (or other) id
 */
DRAWLIB.m_setDbId = function(dbId) {
    this.p_dbId = dbId;
    this.p_pic.p_itemsById[''+dbId] = this;
    };


// Blank a rectangle based on a stretched bounding box
DRAWLIB.p_blankStretchRegion = function( handle, xOff, yOff) {
    var BB = this.p_pickBB;
    var diag = DRAWLIB.p_stretchPoints(handle, xOff, yOff,
        [[BB[0], BB[1]], [BB[2], BB[3]]],
         [BB[0], BB[1]], [BB[2], BB[3]]);
    // Blank the relevant rectangle.
    var lw = this.p_lineWidth;
    this.p_pic.p_redrawSectionWindow(diag[0][0]-lw-1, diag[0][1]-lw-1,
                                     diag[1][0]+lw+1, diag[1][1]+lw+1);
    };


// Transform an array of points for stretching.
// This can be used with window or canvas points as the boundaries are supplied
// by the caller
DRAWLIB.p_stretchPoints = function(handle, xOff, yOff, points, tl, br) {
    var len = points.length;
    var anchor;
    var xScale = 1;
    var yScale = 1;
    var pOut = [];
    var wid = br[0] - tl[0];
    var hgt = br[1] - tl[1];
    if (handle === 0) { // Min X Min Y
        anchor = [br[0], br[1]];
        xScale = (wid-xOff) / wid;
        yScale = (hgt-yOff) / hgt;
        }
    if (handle === 1) { // Max X Min Y
        anchor = [tl[0], br[1]];
        xScale = (wid+xOff) / wid;
        yScale = (hgt-yOff) / hgt;
        }
    if (handle === 2) { // Max X Max Y
        anchor = [tl[0], tl[1]];
        xScale = (wid+xOff) / wid;
        yScale = (hgt+yOff) / hgt;
        }
    if (handle === 3) { // Min X Max Y
        anchor = [br[0], tl[1]];
        xScale = (wid-xOff) / wid;
        yScale = (hgt+yOff) / hgt;
        }
    if (handle === 4) { // Min X Mid edge
        anchor = [br[0], br[1]]; // y part irrelevant with scale 1
        xScale = (wid-xOff) / wid;
        }
    if (handle === 5) { // Min Y Mid edge
        anchor = [br[0], br[1]]; // x part irrelevant with scale 1
        yScale = (hgt-yOff) / hgt;
        }
    if (handle === 6) { // Max X Mid edge
        anchor = [tl[0], tl[1]]; // y part irrelevant with scale 1
        xScale = (wid+xOff) / wid;
        }
    if (handle === 7) { // Max Y Mid edge
        anchor = [tl[0], tl[1]]; // x part irrelevant with scale 1
        yScale = (hgt+yOff) / hgt;
        }

    // Now transform all points accordingly
    for (var i = 0 ; i < len ; i++) {
        var x = Math.round(anchor[0] + ((points[i][0]-anchor[0])*xScale));
        var y = Math.round(anchor[1] + ((points[i][1]-anchor[1])*yScale));
        pOut[i] = [x, y];
        }
    return pOut;
    };


// Blank a region based on a stretched rectangle
DRAWLIB.p_blankStretchRect = function(handle, xOff, yOff) {
    // Convert the offset to window co-ords
    var xOffWin = this.p_pic.pageToWindowDistance(xOff);
    var yOffWin = this.p_pic.pageToWindowDistance(yOff);
    var offPtr = this.p_stretchRect(handle, xOffWin, yOffWin);

    // Recalculate the rectangle bounding box
    var ca = Math.cos(this.p_radAngle);
    var sa = Math.sin(this.p_radAngle);
    var wCos = ca * offPtr[2] /2;
    var wSin = sa * offPtr[2] /2;
    var hCos = ca * offPtr[3] /2;
    var hSin = sa * offPtr[3] /2;

    var minX = offPtr[0] - Math.abs(wCos) - Math.abs(hSin); 
    var maxX = offPtr[0] + Math.abs(wCos) + Math.abs(hSin); 
    var minY = offPtr[1] - Math.abs(hCos) - Math.abs(wSin); 
    var maxY = offPtr[1] + Math.abs(hCos) + Math.abs(wSin); 

    // Blank the relevant rectangle.
    var lw = this.p_lineWidth;
    this.p_pic.p_redrawSectionWindow(minX-lw-1, minY-lw-1,
                                     maxX+lw+1, maxY+lw+1);
    };

// For text to be stored and returned, we want to escape quotation marks
// so as to avoid injection attacks.
// We cannot use the Javascript escape function as that format gets
// re-interpreted by the http server.
// We cannot use the HTML &#xx; format as the & messes up the http server.
// So we just convert the quotes to a backslash escape form.
DRAWLIB.escapeQuotes = function(rawText) {
    var outStr = rawText.replace(/'/g, '\\\\x27');
    outStr = outStr.replace(/"/g, '\\\\x22');
    outStr = outStr.replace(/\n/g, '\\\\x0D');
    return outStr;
    };

DRAWLIB.unescapeQuotes = function(rawText) {
    var outStr = rawText.replace(/\\x27/g, "'");
    outStr = outStr.replace(/\\x22/g, '"');
    outStr = outStr.replace(/\\x0D/g, '\n');
    return outStr;
    };

/**
 * item.getZ returns the Z value for an item.
 *
 * @return the Z value
 */
DRAWLIB.m_getZ = function() { return this.p_z; };

/**
 * item.setZ sets the Z value for an item.
 * Items with a higher Z value are drawn in front of items with lower Z value.
 *
 * @param z The Z value to set
 */
DRAWLIB.m_setZ = function(z) { 
    this.p_z = Math.round(z);
    this.p_pic.setZ(z);
    };

/**
 * item.getLayer returns the drawing layer for an item.
 * Layers can be used to set whether items are visible or pickable.
 *
 * @return the layer number
 */
DRAWLIB.m_getLayer = function() { return this.p_layer; };

/**
 * item.setLayer sets the layer number for an item.
 * Items are created on layer 0 by default.
 *
 * @param layer The layer number
 */
DRAWLIB.m_setLayer = function(layer) { this.p_layer = layer; };

/*
 * item.getDrag returns the dragging flag.
 *
 * @return true or false
 */
DRAWLIB.m_getDrag = function() { return this.p_dragging; };

/**
 * item.setDrag sets a dragging flag on an item. An item with this
 * flag set will not be drawn.
 *
 * @param drag true or false
 */
DRAWLIB.m_setDrag = function(drag) { this.p_dragging = drag; };

/**
 * item.getMid returns the window position of the centre of an item.
 *
 * @return 2-element array with X and Y values
 */
DRAWLIB.m_getMid = function() { return [this.p_midX, this.p_midY]; };

/**
 * item.setMid sets the window position of the centre of an item.
 *
 * @param x X position of the centre
 * @param y Y position of the centre
 */
DRAWLIB.m_setMid = function(x, y) {
    // Check for illegal values
    if (isNaN(x) || isNaN(y)) {
        alert("Attempt to set illegal mid-point "+x+","+y);
        return;
        }
    this.p_midX = Math.round(x);
    this.p_midY = Math.round(y);
    };

/**
 * item.setNeverPickable sets an item as never pickable.
 */
DRAWLIB.m_setNeverPickable = function() { this.p_neverPickable = true; };

/**
 * item.setPickable sets an item as pickable or not.
 *
 * @param pickable Should the item be pickable
 */
DRAWLIB.m_setPickable = function(pickable) { this.p_pickable = pickable; };

