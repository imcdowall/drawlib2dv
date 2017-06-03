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
 * pic.createPolyline creates a multi line segment drawing item and adds it
 * to the drawing item list. The line is created with default styles and on
 * layer 0.
 *
 * @param id Item identifier
 * @param points Array of 2-element points
 * @return the created item
 */
DRAWLIB.m_createPolyline = function(id, points) {
    var oneItem = {'p_pic':this, 'p_id':id, 'p_points':[], 'p_dbId':0, 
        'p_drawable':true, 'p_pickable':true, 'p_visible':true, 'p_layer':0,
        'p_neverPickable':false, 'p_type':'P', 'p_subType':'PL',
        'p_arrow1':0, 'p_arrow2':0};
    // Ensure that points are integers
    for (var i = 0 ; i < points.length ; i++) {
        oneItem.p_points.push([Math.round(points[i][0]),
                               Math.round(points[i][1])]);
        }
    oneItem.p_strokeStyle = '#000000';
    oneItem.p_lineWidth = 1;
    oneItem.p_fillStyle = '';
    oneItem.p_z = 0;
    oneItem.p_group = 0;
    oneItem.p_dragging = false;
    oneItem.getId = DRAWLIB.m_getId;
    oneItem.getDbId = DRAWLIB.m_getDbId;
    oneItem.setDbId = DRAWLIB.m_setDbId;
    oneItem.getDrag = DRAWLIB.m_getDrag;
    oneItem.setDrag = DRAWLIB.m_setDrag;
    oneItem.setBoxes = DRAWLIB.m_setBoxesPoly;
    oneItem.getBB = DRAWLIB.m_getBB;
    oneItem.p_draw = DRAWLIB.p_drawPolyline;
    oneItem.highlight = DRAWLIB.m_highlightRect;
    oneItem.drawHandles = DRAWLIB.m_drawHandlesNoRotation;
    oneItem.drawOffset = DRAWLIB.m_drawOffsetPoly;
    oneItem.drawStretch = DRAWLIB.m_drawStretchPoly;
    oneItem.p_blankStretch = DRAWLIB.p_blankStretchRegion;
    oneItem.stretch = DRAWLIB.m_applyStretchToPoly;
    oneItem.getRadAngle = DRAWLIB.m_getAnglePoly;
    oneItem.getAngle = DRAWLIB.m_getAnglePoly;
    oneItem.setAngle = DRAWLIB.m_setAnglePoly;
    oneItem.getLineStyle = DRAWLIB.m_getLineStyle;
    oneItem.setLineStyle = DRAWLIB.m_setLineStyle;
    oneItem.getFillStyle = DRAWLIB.m_getFillStyle;
    oneItem.setFillStyle = DRAWLIB.m_setFillStyle;
    oneItem.getLineWidth = DRAWLIB.m_getLineWidth; 
    oneItem.setLineWidth = DRAWLIB.m_setLineWidth; 
    oneItem.getZ = DRAWLIB.m_getZ; 
    oneItem.setZ = DRAWLIB.m_setZ; 
    oneItem.getLayer = DRAWLIB.m_getLayer; 
    oneItem.setLayer = DRAWLIB.m_setLayer; 
    oneItem.offset = DRAWLIB.m_offsetPoly;
    oneItem.setNeverPickable = DRAWLIB.m_setNeverPickable;
    oneItem.setPickable = DRAWLIB.m_setPickable;
    oneItem.blankOffset = DRAWLIB.m_blankOffset;
    oneItem.p_redrawOffset = DRAWLIB.p_redrawOffset;
    oneItem.pick = DRAWLIB.m_pickPoly;
    oneItem.getStr = DRAWLIB.m_getStrPoly;
    oneItem.getType = DRAWLIB.m_getType;
    oneItem.getSubType = DRAWLIB.m_getSubType;
    //oneItem.getConnectors = getConnectorsRect;
    //oneItem.setConnectors = setConnectorsRect;
    //oneItem.addConnector = addConnectorRect;
    //oneItem.deleteConnector = deleteConnectorRect;
    oneItem.setArrows = DRAWLIB.m_setArrows;
    oneItem.getArrows = DRAWLIB.m_getArrows;
    oneItem.getGroup = DRAWLIB.m_getGroupRect;
    oneItem.setGroup = DRAWLIB.m_setGroupRect;
    this.p_setItem(oneItem);
    oneItem.setBoxes();
    return oneItem;
    };

DRAWLIB.m_getStrPoly = function() { // Return JSON version of the object
    var points = this.p_points;
    var strArr = [];
    strArr.push('{"t":"'+this.p_subType+'","p":["'+points[0][0]+'_'+points[0][1]+'"');
    for (var i = 1 ; i < points.length ; i++) {
        strArr.push(',"'+points[i][0]+'_'+points[i][1]+'"');
        }
    strArr.push('],"lw":'+this.p_lineWidth+',"ls":"'+this.p_strokeStyle+'"');
    if (this.p_layer !== 0) { strArr.push(',"layer":'+this.p_layer); }
    if (this.p_z !== 0) { strArr.push(',"z":'+this.p_z) ; }
    if (this.p_fillStyle) { strArr.push(',"fs":"'+this.p_fillStyle+'"'); }
    if (this.p_arrow1) { strArr.push(',"arrow1":'+this.p_arrow1) ; }
    if (this.p_arrow2) { strArr.push(',"arrow2":'+this.p_arrow2) ; }
    //var connectors = this.getConnectors();
    //if (connectors) {
    //    var itemStr = ',"connect":[';
    //    for (var i = 0 ; i < connectors.length ; i++ ) {
    //        itemStr += connectors[i]+',';
    //        }
    //    itemStr += ']';
    //    strArr.push(itemStr);
    //    }
    strArr.push('}');
    return strArr.join('');
    };

/**
 * item.getSubType returns the sub-type. This is only defined for items
 * derived from polylines. The current values are 'PL' for polyline,
 * 'F' for freehand and 'PG' for polygon.
 *
 * @return item sub type
 */
DRAWLIB.m_getSubType = function() { return this.p_subType; };

// Set drawing boundary and picking bounding box in real world co-ords
DRAWLIB.m_setBoxesPoly = function() {
    var points = this.p_points;
    var minX = points[0][0];
    var minY = points[0][1];
    var maxX = points[0][0];
    var maxY = points[0][1];
    for (var i = 1 ; i < points.length ; i++ ) {
        if (points[i][0] < minX) { minX = points[i][0]; }
        if (points[i][1] < minY) { minY = points[i][1]; }
        if (points[i][0] > maxX) { maxX = points[i][0]; }
        if (points[i][1] > maxY) { maxY = points[i][1]; }
      }
    this.p_pickBB = [minX, minY, maxX, maxY] ;
    this.p_border = [];
    this.p_border[0] = [minX, minY];
    this.p_border[1] = [maxX, minY];
    this.p_border[2] = [maxX, maxY];
    this.p_border[3] = [minX, maxY];
    this.p_border[4] = [minX, minY];
    };

// Don't allow rotation of polylines
DRAWLIB.m_getAnglePoly = function() { return 0; };
DRAWLIB.m_setAnglePoly = function(angle) { };

// Can be used to draw to other contexts than the default
DRAWLIB.p_drawPolyline = function(ctxt, canvasWidth, window) {
    // if main window then check for outside
    if (ctxt === this.p_pic.p_ctxt &&
        !DRAWLIB.p_isInWindow(this.p_pickBB, window)) { return; }
    var cP = this.p_pic.p_windowToCanvasContextArray(this.p_points,
                                                  canvasWidth, window);
    var len = this.p_points.length;
    var scale = this.p_pic.p_windowToCanvasContextScale(canvasWidth, window);
    ctxt.strokeStyle = this.p_strokeStyle;
    ctxt.lineWidth = Math.round(scale * this.p_lineWidth);
    ctxt.beginPath();
    ctxt.moveTo(cP[0][0], cP[0][1]);
    for (var i = 1 ; i < len ; i++ ) {
        ctxt.lineTo(cP[i][0], cP[i][1]);
       }
    // If the line has arrows then draw those.
    // arrow1 is at the start and arrow2 is at the end.
    if (this.p_arrow1) {
        var ad1 = this.p_arrow1;
        // Calculate a point back along the line
        var ang1 = Math.atan2( cP[1][1]-cP[0][1], cP[1][0]-cP[0][0] );
        var aP1 = [cP[0][0]+ad1*Math.cos(ang1), cP[0][1]+ad1*Math.sin(ang1)];
        ctxt.moveTo(cP[0][0], cP[0][1]);
        ctxt.lineTo(aP1[0] - 0.5*ad1*Math.sin(ang1),
                    aP1[1] + 0.5*ad1*Math.cos(ang1));
        ctxt.lineTo(aP1[0] + 0.5*ad1*Math.sin(ang1),
                    aP1[1] - 0.5*ad1*Math.cos(ang1));
        ctxt.lineTo(cP[0][0], cP[0][1]);
    }
    if (this.p_arrow2) {
        var ad2 = this.p_arrow2;
        // Calculate a point back along the line
        var pL = cP.length - 1;
        var ang2 = Math.atan2( cP[pL-1][1]-cP[pL][1], cP[pL-1][0]-cP[pL][0] );
        var aP2 = [cP[pL][0]+ad2*Math.cos(ang2), cP[pL][1]+ad2*Math.sin(ang2)];
        ctxt.moveTo(cP[pL][0], cP[pL][1]);
        ctxt.lineTo(aP2[0] - 0.5*ad2*Math.sin(ang2),
                    aP2[1] + 0.5*ad2*Math.cos(ang2));
        ctxt.lineTo(aP2[0] + 0.5*ad2*Math.sin(ang2),
                    aP2[1] - 0.5*ad2*Math.cos(ang2));
        ctxt.lineTo(cP[pL][0], cP[pL][1]);
    }
    ctxt.stroke();
    ctxt.closePath();
    };

// Offsets in canvas co-ords
DRAWLIB.m_drawOffsetPoly = function(oldXOff, oldYOff, xOff, yOff, blank) {
    var cP = this.p_pic.windowToCanvasArray(this.p_points);
    var ctxt = this.p_pic.p_ctxt;
    var scale = this.p_pic.windowToCanvasScale();
    var lw = Math.round(scale * this.p_lineWidth);
    if (blank) { this.p_redrawOffset(oldXOff, oldYOff); }
    // Draw a new line
    ctxt.strokeStyle = this.p_strokeStyle;
    ctxt.lineWidth = lw;
    ctxt.beginPath();
    ctxt.moveTo(xOff+cP[0][0], yOff+cP[0][1]);
    for (var i = 1 ; i < cP.length ; i++ ) {
        ctxt.lineTo(xOff+cP[i][0], yOff+cP[i][1]);
       }
    ctxt.stroke();
    ctxt.closePath();
    // Refresh the frame
    this.p_pic.p_redrawOneFrame();
    };

DRAWLIB.m_offsetPoly = function(xOffset, yOffset) {
    var points = this.p_points;
    // Ensure integral co-ords
    xOffset = Math.round(xOffset);
    yOffset = Math.round(yOffset);
    for (var i = 0 ; i < points.length ; i++ ) {
        points[i][0] += xOffset;
        points[i][1] += yOffset;
        }
    this.setBoxes();
    };

// Is the point x,y in real world co-ords a hit on the line?
DRAWLIB.m_pickPoly = function(x, y) { 
    if (this.p_neverPickable) { return false; }
    var BB = this.p_pickBB;
    var marg = 5 ; // Margin of error, would be nice to scale
    // Check against crude bounding box
    if (x < BB[0]-marg || x > BB[2]+marg) { return false; }
    if (y < BB[1]-marg || y > BB[3]+marg) { return false; }
    var points = this.p_points;
    for (var i = 1 ; i < points.length ; i++){
        if (DRAWLIB.p_isPointNearLine(points[i-1][0], points[i-1][1],
                                      points[i][0], points[i][1],
                                      x, y)) { return true; }
        }
    return false;
    };

// Draw a polyline that is stretched in some way
// The handle is an identifier for the handle that is being dragged.
// 0 to 3 are corner handles, 4 to 7 are mid side handles
DRAWLIB.m_drawStretchPoly = function( handle, oldXOff, oldYOff,
                                      xOff, yOff, blank) {
    if (blank) { this.p_blankStretch( handle, oldXOff, oldYOff); }
    var canLine = this.p_pic.windowToCanvasArray(this.p_points);
    var BB = this.p_pickBB;
    var cBB = this.p_pic.windowToCanvasRect( BB[0], BB[1],
                                               BB[2], BB[3]);
    var sPoints = DRAWLIB.p_stretchPoints(handle, xOff, yOff, canLine,
        [cBB[0], cBB[1]], [cBB[2], cBB[3]]);
    // Draw a new line
    var ctxt = this.p_pic.p_ctxt;
    var lw = 1; // thicker linewidths leave trails
    ctxt.strokeStyle = this.p_strokeStyle;
    ctxt.lineWidth = lw;
    ctxt.beginPath();
    ctxt.moveTo(sPoints[0][0], sPoints[0][1]);
    for (var i = 1 ; i < sPoints.length ; i++) {
        ctxt.lineTo(sPoints[i][0], sPoints[i][1]);
        }
    ctxt.stroke();
    ctxt.closePath();
    };

// Apply a window offset stretch to a polyline based on
// dragging a specific handle
// The offsets ate in canvas co-ords
DRAWLIB.m_applyStretchToPoly = function(handle, xOff, yOff) {
    // Set up diagonal corners and stretch them.
    var BB = this.p_pickBB;
    var sPoints = DRAWLIB.p_stretchPoints(handle, xOff, yOff, this.p_points,
        [BB[0], BB[1]], [BB[2], BB[3]]);
    this.p_points = sPoints;
    this.setBoxes();
    };

/**
 * item.setArrows sets the length of arrow heads for a line.
 *
 * @param arrow1 - length of arrow head at start of line
 * @param arrow2 - length of arrow head at end of line
 */
DRAWLIB.m_setArrows = function( arrow1, arrow2 ) {
    this.p_arrow1 = arrow1;
    this.p_arrow2 = arrow2;
    };

/**
 * item.getArrows returns a 2-element array with the sizes of arrow heads
 */
DRAWLIB.m_getArrows = function() { return [this.p_arrow1, this.p_arrow2]; };

