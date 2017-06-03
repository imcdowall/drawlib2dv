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
 * pic.createRect creates a rectangle drawing item and adds it to the drawing
 * item list. The rectangle is created with default styles and on layer 0.
 *
 * @param id Item identifier
 * @param x X co-ordinate of the centre point
 * @param y Y co-ordinate of the centre point
 * @param p_winWidth Width of the rectangle in window units
 * @param p_winHeight Height of the rectangle in window units
 * @return the created item
 */
DRAWLIB.m_createRect = function(id, x, y, winWidth, winHeight, angle) {
    var oneRect = {'p_pic':this, 'p_id':id,
        'p_midX':Math.round(x), 'p_midY':Math.round(y), 
        'p_winWidth':winWidth, 'p_winHeight':winHeight, 'p_dbId':0,
        'p_drawable':true, 'p_pickable':true, 'p_visible':true, 'p_layer':0,
        'p_neverPickable':false, 'p_type':'R'};
    oneRect.p_strokeStyle = '#000000'; // Default black
    oneRect.p_fillStyle = ''; // Default not filled
    oneRect.p_lineWidth = 1; // Default thin
    oneRect.p_angle = angle;
    oneRect.p_radAngle = angle * Math.PI/180;
    oneRect.p_z = 0;
    oneRect.p_group = 0;
    oneRect.p_dragging = false;
    oneRect.getId = DRAWLIB.m_getId;
    oneRect.getDbId = DRAWLIB.m_getDbId;
    oneRect.setDbId = DRAWLIB.m_setDbId;
    oneRect.getDrag = DRAWLIB.m_getDrag;
    oneRect.setDrag = DRAWLIB.m_setDrag;
    oneRect.getMid = DRAWLIB.m_getMid;
    oneRect.setMid = DRAWLIB.m_setMid;
    oneRect.setBoxes = DRAWLIB.m_setBoxesRect;
    oneRect.getBorder = DRAWLIB.m_getBorder;
    oneRect.getBB = DRAWLIB.m_getBB;
    oneRect.p_draw = DRAWLIB.p_drawRect;
    oneRect.highlight = DRAWLIB.m_highlightRect;
    oneRect.drawHandles = DRAWLIB.m_drawHandlesRotation;
    oneRect.p_stretchRect = DRAWLIB.p_stretchRect;
    oneRect.drawOffset = DRAWLIB.m_drawOffsetRect;
    oneRect.drawStretch = DRAWLIB.m_drawStretchRect;
    oneRect.p_blankStretch = DRAWLIB.p_blankStretchRect;
    oneRect.stretch = DRAWLIB.m_applyStretchToRect;
    oneRect.getWidth = DRAWLIB.m_getWidth;
    oneRect.setWidth = DRAWLIB.m_setWidth;
    oneRect.getHeight = DRAWLIB.m_getHeight;
    oneRect.setHeight = DRAWLIB.m_setHeight;    
    oneRect.getRadAngle = DRAWLIB.m_getRadAngle;
    oneRect.getAngle = DRAWLIB.m_getAngle;
    oneRect.setAngle = DRAWLIB.m_setAngle;
    oneRect.getLineStyle = DRAWLIB.m_getLineStyle;
    oneRect.setLineStyle = DRAWLIB.m_setLineStyle;
    oneRect.getFillStyle = DRAWLIB.m_getFillStyle;
    oneRect.setFillStyle = DRAWLIB.m_setFillStyle;
    oneRect.getLineWidth = DRAWLIB.m_getLineWidth; 
    oneRect.setLineWidth = DRAWLIB.m_setLineWidth; 
    oneRect.getZ = DRAWLIB.m_getZ; 
    oneRect.setZ = DRAWLIB.m_setZ; 
    oneRect.getLayer = DRAWLIB.m_getLayer; 
    oneRect.setLayer = DRAWLIB.m_setLayer; 
    oneRect.offset = DRAWLIB.m_offset;
    oneRect.setNeverPickable = DRAWLIB.m_setNeverPickable;
    oneRect.blankOffset = DRAWLIB.m_blankOffset;
    oneRect.p_redrawOffset = DRAWLIB.p_redrawOffset;
    oneRect.pick = DRAWLIB.m_pickRect;
    oneRect.setPickable = DRAWLIB.m_setPickable;
    oneRect.getStr = DRAWLIB.m_getStrRect;
    oneRect.getType = DRAWLIB.m_getType;
    //oneRect.getConnectors = DRAWLIB.m_getConnectorsRect;
    //oneRect.setConnectors = DRAWLIB.m_setConnectorsRect;
    //oneRect.addConnector = DRAWLIB.m_addConnectorRect;
    //oneRect.deleteConnector = DRAWLIB.m_deleteConnectorRect;
    oneRect.getGroup = DRAWLIB.m_getGroupRect;
    oneRect.setGroup = DRAWLIB.m_setGroupRect;
    //
    this.p_setItem(oneRect);
    oneRect.setBoxes();
    return oneRect;
    };

DRAWLIB.m_getStrRect = function() { // Return JSON version of the object
    var itemStr = '{"t":"R","mx":'+this.p_midX+',"my":'+this.p_midY+
         ',"w":'+this.p_winWidth+',"h":'+this.p_winHeight+',"a":'+this.p_angle+
         ',"lw":'+this.p_lineWidth+',"ls":"'+this.p_strokeStyle+'"';
    if (this.p_layer !== 0) { itemStr += ',"layer":'+this.p_layer; }
    if (this.p_z !== 0) { itemStr += ',"z":'+this.p_z; }
    if (this.p_fillStyle) { itemStr += ',"fs":"'+this.p_fillStyle+'"';}
    //var connectors = this.getConnectors();
    //if (connectors) {
    //    itemStr += ',"connect":[';
    //    for (var i = 0 ; i < connectors.length ; i++ ) {
    //        itemStr += connectors[i]+',';
    //        }
    //    itemStr += ']';
    //    }
    itemStr += '}';
    return itemStr;
    };

/**
 * item.getLineStyle returns the item linestyle.
 *
 * @return line style
 */
DRAWLIB.m_getLineStyle = function() { return this.p_strokeStyle; };

/**
 * item.setLineStyle sets the line style for the item. The style should be
 * an HTML color.
 *
 * @param lineStyle The style to set.
 */
DRAWLIB.m_setLineStyle = function(lineStyle) {
    this.p_strokeStyle = lineStyle;
    };

/**
 * item.getLineStyle returns the item linestyle.
 *
 * @return line style
 */
DRAWLIB.m_getFillStyle = function() { return this.p_fillStyle; };

/**
 * item.setFillStyle sets the fill style for the item. The style should be
 * an HTML color.
 *
 * @param fillStyle The style to set.
 */
DRAWLIB.m_setFillStyle = function(fillStyle) {
    this.p_fillStyle = fillStyle; 
    };

/**
 * item.getLineStyle returns the item linestyle.
 *
 * @return line style
 */
DRAWLIB.m_getLineWidth = function() { return this.p_lineWidth; };

/**
 * item.setLineWidth sets the line width style for the item.
 *
 * @param lineWidth The line width to set
 */
DRAWLIB.m_setLineWidth = function(lineWidth) {
    this.p_lineWidth = Math.round(lineWidth);
    };

//DRAWLIB.m_getConnectorsRect = function() { return this.connect; }
//DRAWLIB.m_setConnectorsRect = function( aConnectArr ) { this.connect = aConnectArr; }
//DRAWLIB.m_addConnectorRect = function( connectId ) {
//    if (!this.connect) { this.connect = []; }
//    this.connect.push(connectId) ;
//    }

//DRAWLIB.m_deleteConnectorRect = function( connectId ) {
//    for (var index = 0 ; index < this.connect.length ; index++) {
//        if (this.connect[index] === connectId) { break; }
//        }
//    if (index < this.connect.length && this.connect[index] === connectId) {
//       this.connect.splice(index, 1);
//       }
//    if (this.connect.length === 0) { this.connect = undefined; }
//    }
/**
 * item.getGroup returns the group, if any for an item.
 * An item can belong to no more than one group at a time.
 *
 * @return The group that an item is in, or undef.
 */
DRAWLIB.m_getGroupRect = function() { return this.p_group; };

/**
 * item.setGroup sets the group for an item.
 *
 * @param group The group to set.
 */
DRAWLIB.m_setGroupRect = function( group ) { this.p_group = group; };

/**
 * item.setBoxes recalculates the bounding boxes for an item.
 * These are used when picking or redrawing items.
 */
DRAWLIB.m_setBoxesRect = function() {
    var radAngle = this.p_radAngle;
    var wCos = Math.cos(radAngle) * this.p_winWidth / 2;
    var wSin = Math.sin(radAngle) * this.p_winWidth / 2;
    var hCos = Math.cos(radAngle) * this.p_winHeight / 2;
    var hSin = Math.sin(radAngle) * this.p_winHeight / 2;
    this.p_border = [];
    this.p_border[0] = [this.p_midX - wCos + hSin, this.p_midY - wSin - hCos];
    this.p_border[1] = [this.p_midX + wCos + hSin, this.p_midY + wSin - hCos];
    this.p_border[2] = [this.p_midX + wCos - hSin, this.p_midY + wSin + hCos];
    this.p_border[3] = [this.p_midX - wCos - hSin, this.p_midY - wSin + hCos];
    this.p_border[4] = [this.p_border[0][0], this.p_border[0][1]];
    this.p_pickBB = [this.p_midX-Math.abs(wCos)-Math.abs(hSin),
        this.p_midY-Math.abs(wSin)-Math.abs(hCos),
        this.p_midX+Math.abs(wCos)+Math.abs(hSin),
        this.p_midY+Math.abs(wSin)+Math.abs(hCos)];
    };

/**
 * item.getBB returns a bounding box
 *
 * @return 4-element array - minX, minY, maxX, maxY
 */
DRAWLIB.m_getBB = function() {
    return this.p_pickBB;
    };

/**
 * item.getBorder returns an array of border points
 *
 * @return 5-element of 2-element arrays in window co-ords.
 */
DRAWLIB.m_getBorder = function() { return this.p_border; };

/**
 * item.getWidth returns the width in window units
 *
 * @return width
 */
DRAWLIB.m_getWidth = function() { return this.p_winWidth; };

/**
 * item.setWidth sets the width in window units
 *
 * @param width
 */
DRAWLIB.m_setWidth = function(width) { this.p_winWidth = Math.round(width); };

/**
 * item.getHeight returns the height in window units
 *
 * @return height
 */
DRAWLIB.m_getHeight = function() { return this.p_winHeight; };

/**
 * item.setHeight sets the height in window units
 *
 * @param height
 */
DRAWLIB.m_setHeight = function(height) { this.p_winHeight = Math.round(height); };

/**
 * item.getRadAngle returns the angle of rotation in Radians
 *
 * @return angle
 */
DRAWLIB.m_getRadAngle = function() { return this.p_radAngle; };

/**
 * item.getAngle returns the angle of rotation in degrees
 *
 * @return angle
 */
DRAWLIB.m_getAngle = function() { return this.p_angle; };

/**
 * item.setAngle sets the angle of rotation for an item in degrees clockwise.
 * The bounding boxes are recalculated.
 *
 * @param angle The angle to set in degrees.
 */
DRAWLIB.m_setAngle = function(angle) {
    this.p_angle = Math.round(angle);
    this.p_radAngle = this.p_angle * Math.PI/180;
    this.setBoxes();
    };

/**
 * item.offset moves the item by an X and Y amount.
 * The bounding boxes are recalculated.
 *
 * @param xOffset The X offset to apply
 * @param yOffset The Y offset to apply
 */
DRAWLIB.m_offset = function(xOffset, yOffset) {
    // Check for illegal values
    if (isNaN(xOffset) || isNaN(yOffset)) {
        alert("Atempt to set illegal offset "+xOffset+","+yOffset);
        return;
        }
    this.p_midX = Math.round(this.p_midX+xOffset);
    this.p_midY = Math.round(this.p_midY+yOffset);
    this.setBoxes();
    };

// Can be used to draw to other contexts than the default
// But we retain the underlying rotation. This might be unexpected
DRAWLIB.p_drawRect = function(ctxt, canvasWidth, window) {
    // Check for out of view in main canvas
    if (ctxt === this.p_pic.p_ctxt && 
        !DRAWLIB.p_isInWindow(this.p_pickBB, window)) { return; }
    var scale = this.p_pic.p_windowToCanvasContextScale(canvasWidth, window);
    var cMid = this.p_pic.p_windowToCanvasContextCoords(this.p_midX, this.p_midY,
                                                     canvasWidth, window);
    var winRot = this.p_pic.p_rotation;
    var canBorder = this.p_pic.p_windowToCanvasContextArray(this.p_border,
                                                         canvasWidth, window);
    var canWidth = this.p_winWidth * scale;
    var canHeight = this.p_winHeight * scale;
    // If we are filled then we need to manage rotations in order to fill
    if (this.p_fillStyle && this.p_fillStyle !== 'none') {
        ctxt.save();
        ctxt.translate(cMid[0], cMid[1]);
        ctxt.rotate(this.p_radAngle-Math.PI*winRot*0.5);
        ctxt.translate(-cMid[0], -cMid[1]);
        ctxt.fillStyle = this.p_fillStyle; 
        ctxt.fillRect( cMid[0]-canWidth/2, cMid[1]-canHeight/2,
                       canWidth, canHeight) ;
        ctxt.restore();
        }
    // We do the actual line drawing directly rather than relying on 
    // explicit rotations
    ctxt.strokeStyle = this.p_strokeStyle;
    ctxt.lineWidth = Math.round(scale * this.p_lineWidth);
    ctxt.lineCap = "round";
    ctxt.lineJoin = "round";
    ctxt.beginPath();
    ctxt.moveTo(canBorder[0][0], canBorder[0][1]);
    for (var i = 1 ; i <= 4 ; i++) {
        ctxt.lineTo(canBorder[i][0], canBorder[i][1]);
        }
    ctxt.stroke();
    ctxt.closePath();
    };

/**
 * item.highlight draws the item with a highlight for emphasis.
 * The highlight is not retained when the picture is redrawn.
 * The style should be an HTML color.
 *
 * @param style The linestyle with which to draw the highlight.
 */
DRAWLIB.m_highlightRect = function(style) {
    var canBorder = this.p_pic.windowToCanvasArray(this.p_border);
    var ctxt = this.p_pic.p_ctxt;
    ctxt.strokeStyle = style;
    ctxt.lineWidth = 1; // Thicker leaves trails
    ctxt.beginPath();
    ctxt.moveTo(canBorder[0][0], canBorder[0][1]);
    for (var i = 1 ; i <= 4 ; i++) {
        ctxt.lineTo(canBorder[i][0], canBorder[i][1]);
        }
    ctxt.stroke();
    ctxt.closePath();
    };

/**
 * item.drawHandles draws small 'handles' on the corners and middles of sides.
 * These can then be grabbed and dragged to re-size the item.
 * For the convenience of the caller, the positions of the handles are
 * returned in canvas co-ords.
 *
 * @param style The linestyle to use to draw the handles.
 * @param hWid The width of the handles to draw, in canvas co-ordinates
 * @return an array of 2-element array points - in order:
 * top Left corner
 * top right corner
 * bottom right corner
 * bottom left corner
 * left middle side
 * top middle side
 * right middle corner
 * bottom middle corner
 * For items that cannot be skewed only the first four points are returned.
 */
DRAWLIB.m_drawHandlesRotation = function(style, hWid) {
    var wid = this.p_pic.p_windowToCanvasDistance(this.p_winWidth);
    var hgt = this.p_pic.p_windowToCanvasDistance(this.p_winHeight);
    var cMid = this.p_pic.windowToCanvasCoords(this.p_midX, this.p_midY);
    var wCos = Math.cos(this.p_radAngle) * wid / 2;
    var wSin = Math.sin(this.p_radAngle) * wid / 2;
    var hCos = Math.cos(this.p_radAngle) * hgt / 2;
    var hSin = Math.sin(this.p_radAngle) * hgt / 2;
    var hP = [];
    // Create Corner points
    hP[0] = [cMid[0] - wCos + hSin + hWid/2, cMid[1] - wSin - hCos + hWid/2];
    hP[1] = [cMid[0] + wCos + hSin - hWid/2, cMid[1] + wSin - hCos + hWid/2];
    hP[2] = [cMid[0] + wCos - hSin - hWid/2, cMid[1] + wSin + hCos - hWid/2];
    hP[3] = [cMid[0] - wCos - hSin + hWid/2, cMid[1] - wSin + hCos - hWid/2];
    // Create Mid points
    hP[4] = [(hP[3][0]+hP[0][0])/2, (hP[3][1]+hP[0][1])/2];
    hP[5] = [(hP[0][0]+hP[1][0])/2, (hP[0][1]+hP[1][1])/2];
    hP[6] = [(hP[1][0]+hP[2][0])/2, (hP[1][1]+hP[2][1])/2];
    hP[7] = [(hP[2][0]+hP[3][0])/2, (hP[2][1]+hP[3][1])/2];
    var ctxt = this.p_pic.p_ctxt;
    ctxt.fillStyle = style;
    for (var i = 0 ; i < 8 ; i++) {
	ctxt.fillRect( hP[i][0]-hWid/2, hP[i][1]-hWid/2,
            hWid, hWid);
	}
    return hP;
    };

/**
 * item.drawOffset draws an item with an offset in canvas co-ordinates.
 * This can be used when dragging an item.
 * The item is not permanently affected.
 * The method is designed to be called repeatedly as an item is dragged.
 * The offset distances are in canvas co-ordinates
 * 
 * @param oldXOff The previous X offset
 * @param oldYOff The previous Y offset
 * @param xOff X offset
 * @param yOff Y offset
 * @param blank true if the previous position should be cleared
 */
DRAWLIB.m_drawOffsetRect = function(oldXOff, oldYOff, xOff, yOff, blank) { 
    var canBorder = this.p_pic.windowToCanvasArray(this.p_border);
    var ctxt = this.p_pic.p_ctxt;
    var lw = 1; // thicker linewidths leave trails
    if (blank) { this.p_redrawOffset(oldXOff, oldYOff); } 
    // Fill if necessary
    if (this.p_fillStyle && this.p_fillStyle !== 'none') {
        var scale = this.p_pic.windowToCanvasScale();
        var cMid = this.p_pic.windowToCanvasCoords(this.p_midX, this.p_midY);
        var canWidth = this.p_winWidth * scale;
        var canHeight = this.p_winHeight * scale;
        var mid = [cMid[0]+xOff, cMid[1]+yOff];
        ctxt.save();
        ctxt.translate(mid[0], mid[1]);
        ctxt.rotate(this.p_radAngle-Math.PI*this.p_pic.p_rotation*0.5);
        ctxt.translate(-mid[0], -mid[1]);
        ctxt.fillStyle = this.p_fillStyle; 
        ctxt.fillRect( mid[0]-canWidth/2, mid[1]-canHeight/2,
            canWidth, canHeight) ;
        ctxt.restore();
        }
    // Draw a new border
    ctxt.strokeStyle = this.p_strokeStyle;
    ctxt.lineWidth = lw;
    ctxt.beginPath();
    ctxt.moveTo(canBorder[0][0]+xOff, canBorder[0][1]+yOff);
    for (var i = 1 ; i < 5 ; i++) {
        ctxt.lineTo(canBorder[i][0]+xOff, canBorder[i][1]+yOff);
        }
    ctxt.stroke();
    ctxt.closePath();
    // Refresh the frame
    this.p_pic.p_redrawOneFrame();
    };

DRAWLIB.p_drawOffsetBox = function(ctxt, canvasWidth, window, xOff, yOff) { 
    var scale, cMid, canBorder;
    var winRot = this.p_pic.p_rotation;
    scale = this.p_pic.p_windowToCanvasContextScale(canvasWidth, window);
    cMid = this.p_pic.p_windowToCanvasContextCoords(this.p_midX,this.p_midY,
        canvasWidth, window);
    canBorder = this.p_pic.p_windowToCanvasContextArray(this.p_border,
        canvasWidth, window);
    if (this.p_fillStyle && this.p_fillStyle !== 'none') {
        var canWidth = this.p_winWidth * scale;
        var canHeight = this.p_winHeight * scale;
        var mid = [cMid[0]+xOff, cMid[1]+yOff];
        ctxt.save();
        ctxt.translate(mid[0], mid[1]);
        ctxt.rotate(this.p_radAngle-Math.PI*winRot*0.5);
        ctxt.translate(-mid[0], -mid[1]);
        ctxt.fillStyle = this.p_fillStyle; 
        ctxt.fillRect( mid[0]-canWidth/2, mid[1]-canHeight/2,
            canWidth, canHeight) ;
        ctxt.restore();
        }
    // Draw a new border
    ctxt.strokeStyle = this.p_strokeStyle;
    ctxt.lineWidth = Math.round(scale * this.p_lineWidth);
    ctxt.beginPath();
    ctxt.moveTo(canBorder[0][0]+xOff, canBorder[0][1]+yOff);
    for (var i = 1 ; i < 5 ; i++) {
        ctxt.lineTo(canBorder[i][0]+xOff, canBorder[i][1]+yOff);
        }
    ctxt.stroke();
    ctxt.closePath();
    };

// The handle is an identifier for the handle that is being dragged.
// 0 to 3 are corner handles, 4 to 7 are mid side handles
// The offset distances are in window co-ordinates
// The fun ction returns with an array containing 4 values (in window co-ords)
//   mid point X and Y
//   width and height
// The rectangle rotation will be unchanged.
DRAWLIB.p_stretchRect = function( handle, xOff, yOff) {
    // To handle rotation of the rectangle, we rotate the offset to be
    // in the rectangle's co-ordinate system. We will then adjust back
    // When we drag the centre.

    var offDist = Math.sqrt(xOff*xOff + yOff*yOff);
    // Calculate offset angle in rectangle co-ords.
    var offAng1 = Math.atan2(yOff, xOff); // Offset original angle
    var offAng2 = offAng1 - this.p_radAngle;
    if (offAng2 > Math.PI) { offAng2 -= 2*Math.PI; }
    if (offAng2 < -Math.PI) { offAng2 += 2*Math.PI; }
    // Calculate xOff and yOff in rectangle co-ordinates
    var xOff2 = offDist * Math.cos(offAng2);
    var yOff2 = offDist * Math.sin(offAng2);

    // Given the handle work out scales
    var yDrag = 1;
    var widOff = this.p_winWidth;
    var hgtOff = this.p_winHeight;
    if (handle === 0) { // Min X Min Y
        widOff -= xOff2;
        hgtOff -= yOff2;
        }
    if (handle === 1) { // Max X Min Y
        widOff += xOff2;
        hgtOff -= yOff2;
        }
    if (handle === 2) { // Max X Max Y
        widOff += xOff2;
        hgtOff += yOff2;
        }
    if (handle === 3) { // Min X Max Y
        widOff -= xOff2;
        hgtOff += yOff2;
        }
    if (handle === 4) { // Min X Mid edge
        yDrag = 0;
        widOff -= xOff2;
        }
    if (handle === 5) { // Min Y Mid edge
        xOff2 = 0;
        hgtOff -= yOff2;
        }
    if (handle === 6) { // Max X Mid edge
        yDrag = 0;
        widOff += xOff2;
        }
    if (handle === 7) { // Max Y Mid edge
        xOff2 = 0;
        hgtOff += yOff2;
        }

    // Drag the mid point
    var ca = Math.cos(this.p_radAngle);
    var sa = Math.sin(this.p_radAngle);
    var xMidOff = this.p_midX + (ca*xOff2/2) - (yDrag*sa*yOff2/2);
    var yMidOff = this.p_midY + (sa*xOff2/2) + (yDrag*ca*yOff2/2);

    return [xMidOff, yMidOff, widOff, hgtOff];
    };

/**
 * item.drawStretch draws an item that is stretched in some way.
 * The handle is an identifier for the handle that is being dragged.
 * 0 to 3 are corner handles, 4 to 7 are mid side handles
 * The offset distances are in canvas co-ordinates
 * This can be used when dragging an item. 
 * The item is not permanently affected
 * The method is designed to be called repeatedly as an item is stretched.
 * 
 * @see item.drawHandles
 * @param handle the handle that has been dragged
 * @param oldXOff The previous X offset
 * @param oldYOff The previous Y offset
 * @param xOff X offset
 * @param yOff Y offset
 * @param blank true if the previous position should be cleared
 */
DRAWLIB.m_drawStretchRect = function( handle, oldXOff, oldYOff, 
                                      xOff, yOff, blank) {
    if (blank) { this.p_blankStretch( handle, oldXOff, oldYOff); } 
    // Convert the offset to window co-ords
    var xOffWin = this.p_pic.pageToWindowDistance(xOff);
    var yOffWin = this.p_pic.pageToWindowDistance(yOff);
    var offPtr = this.p_stretchRect(handle, xOffWin, yOffWin);
    // Recalculate the rectangle border
    var midP = this.p_pic.windowToCanvasCoords( offPtr[0], offPtr[1]);
    var widP = this.p_pic.p_windowToCanvasDistance(offPtr[2]);
    var hgtP = this.p_pic.p_windowToCanvasDistance(offPtr[3]);
    var ca = Math.cos(this.p_radAngle);
    var sa = Math.sin(this.p_radAngle);
    var wCos = ca * widP /2;
    var wSin = sa * widP /2;
    var hCos = ca * hgtP /2;
    var hSin = sa * hgtP /2;
    // Draw a new border
    var pt = [];
    pt[0] = [midP[0] - wCos + hSin, midP[1] - wSin - hCos];
    pt[1] = [midP[0] + wCos + hSin, midP[1] + wSin - hCos];
    pt[2] = [midP[0] + wCos - hSin, midP[1] + wSin + hCos];
    pt[3] = [midP[0] - wCos - hSin, midP[1] - wSin + hCos];
    pt[4] = [pt[0][0], pt[0][1]];
    var ctxt = this.p_pic.p_ctxt;
    var lw = 1; // thicker linewidths leave trails
    ctxt.strokeStyle = this.p_strokeStyle;
    ctxt.lineWidth = lw;
    ctxt.beginPath();
    ctxt.moveTo(pt[0][0], pt[0][1]);
    for (var i = 1 ; i < 5 ; i++) {
        ctxt.lineTo(pt[i][0], pt[i][1]);
        }
    ctxt.stroke();
    ctxt.closePath();
    };

/**
 * item.stretch changes the dimensions of an item when a 'handle' has been
 * dragged.
 * The offsets are in canvas co-ords
 *
 * @see item.drawHandles
 * @param handle the handle that has been dragged
 * @param xOff X offset
 * @param yOff Y offset
 */
DRAWLIB.m_applyStretchToRect = function(handle, xOff, yOff) {
    // Convert the offset to window co-ords
    var xOffWin = this.p_pic.pageToWindowDistance(xOff);
    var yOffWin = this.p_pic.pageToWindowDistance(yOff);
    var offPtr = this.p_stretchRect(handle, xOffWin, yOffWin);
    // Amend the centre and dimensions
    this.p_midX = Math.round(offPtr[0]);
    this.p_midY = Math.round(offPtr[1]);
    this.p_winWidth = Math.round(offPtr[2]);
    this.p_winHeight = Math.round(offPtr[3]);
    this.setBoxes();
    };

// Is a point close to a line segment
DRAWLIB.p_isPointNearLine = function(x1, y1, x2, y2, xP, yP) {
    var marg = 5; // Margin of error, would be nice to scale
    // Check for the point outside the line's bounding box
    if ((xP < x1-marg) && (xP < x2-marg)) { return false; }
    if ((xP > x1+marg) && (xP > x2+marg)) { return false; }
    if ((yP < y1-marg) && (yP < y2-marg)) { return false; }
    if ((yP > y1+marg) && (yP > y2+marg)) { return false; }
    // The calculations below assume x1 != x2 so check before dividing by zero
    // If the line is almost horizontal or vertical then the BB checks are
    // adequate
    if (Math.abs(y2-y1) < marg || Math.abs(x2-x1) < marg) { return true; }
    // Calculate the perpendicular distance between the point and the line
    var m = (y2-y1)/(x2-x1); // gradient
    var b = y1 - x1*m ; // Intercept of X axis
    var dist = Math.abs(yP - m*xP - b) / Math.sqrt(1 + m*m) ;
    if (dist <= marg) { return true; }
    return false;
    };

// Return -ve, 0 or +ve for which side of the line the point is
DRAWLIB.p_pointSideOfLine = function(x1, y1, x2, y2, xP, yP) {
    var lineAngle = Math.atan2(y2-y1, x2-x1);
    var pointAngle = Math.atan2(yP-y1, xP-x1);
    var offsetAngle = pointAngle - lineAngle;
    while (offsetAngle < -Math.PI) { offsetAngle += 2*Math.PI; }
    while (offsetAngle > Math.PI) { offsetAngle -= 2*Math.PI; }
    return offsetAngle;
    };

/**
 * item.pick checks if a given point in window co-ordinates lies
 * on the item.
 *
 * @param x X co-ord
 * @param y Y co-ord
 *
 * @return true for a hit, otherrwise false
 */
DRAWLIB.m_pickRect = function(x, y) {
    if (this.p_neverPickable) { return false; }
    var BB = this.p_pickBB;
    var marg = 5 ; // Margin of error, would be nice to scale
    // Check against crude bounding box
    if (x < BB[0]-marg || x > BB[2]+marg) { return false; }
    if (y < BB[1]-marg || y > BB[3]+marg) { return false; }
    // If the rectangle is filled and not angled then the BB check
    // is good enough
    if ((this.p_fillStyle) && (this.p_angle === 0)) { return true; }
    // If the rectangle is filled then we check for inside the angled box
    var bord, i;
    if (this.p_fillStyle) {
        bord = this.p_border;
        var side1 = DRAWLIB.p_pointSideOfLine(bord[0][0], bord[0][1],
                                              bord[1][0], bord[1][1], x, y);
        for ( i = 1 ; i < 4 ; i++){
            var side2 = DRAWLIB.p_pointSideOfLine(bord[i][0], bord[i][1],
                                        bord[i+1][0], bord[i+1][1], x, y);
            if (((side1 < 0) && (side2 > 0)) || ((side1 > 0) && (side2 < 0))) {
                return false;
                }
            if (side1 === 0) { side1 = side2; }
           }
        return true;
        }
    // If the rectangle is not filled then we need to check against each line
    if (!this.p_fillStyle) {
        bord = this.p_border;
        for ( i = 0 ; i < 4 ; i++){
            if (DRAWLIB.p_isPointNearLine(bord[i][0], bord[i][1],
                                bord[i+1][0], bord[i+1][1],
                x, y)) { return true; }
            }
        }
    return false;
    };

