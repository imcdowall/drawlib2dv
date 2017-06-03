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
 * pic.createEllipse creates an ellipse drawing item and adds it to the drawing
 * item list. The ellipse is created with default styles and on layer 0.
 * At present, the ellipse has to be a circle.
 *
 * @param id Item identifier
 * @param x X co-ordinate of the centre point
 * @param y Y co-ordinate of the centre point
 * @param winradius radius of the ellipse
 * @return the created item
 */
DRAWLIB.m_createEllipse = function(id, x, y, winRadius, angle) {
    // Derive from Rectangle
    var oneEllipse = this.createRect(id, x, y, winRadius, winRadius, angle);
    oneEllipse.p_type = 'C';
    oneEllipse.p_radius = Math.round(winRadius);
    oneEllipse.getRadius = DRAWLIB.m_getRadius;
    oneEllipse.setRadius = DRAWLIB.m_setRadius;
    oneEllipse.setBoxes = DRAWLIB.m_setBoxesEllipse;
    oneEllipse.p_draw = DRAWLIB.p_drawEllipse;
    oneEllipse.drawHandles = DRAWLIB.m_drawHandlesNoRotation;
    oneEllipse.drawOffset = DRAWLIB.m_drawOffsetEllipse;
    oneEllipse.p_blankStretch = DRAWLIB.p_blankStretchRegion;
    oneEllipse.drawStretch = DRAWLIB.m_drawStretchEllipse;
    oneEllipse.stretch = DRAWLIB.m_applyStretchToEllipse;
    oneEllipse.pick = DRAWLIB.m_pickEllipse;
    oneEllipse.getStr = DRAWLIB.m_getStrEllipse;
    //oneImg.pick = pickImg; // Add when more selective pick
    oneEllipse.setBoxes();
    return oneEllipse;
    };

DRAWLIB.m_getStrEllipse = function() { // Return JSON version of the object
    var itemStr = '{"t":"C","mx":'+this.p_midX+',"my":'+this.p_midY+
         ',"r":'+this.p_radius+',"a":'+this.p_angle+','+
         '"lw":'+this.p_lineWidth+',"ls":"'+this.p_strokeStyle+'"';
    if (this.p_layer !== 0) { itemStr += ',"layer":'+this.p_layer; }
    if (this.p_z !== 0) { itemStr += ',"z":'+this.p_z; }
    if (this.p_fillStyle) { itemStr += ',"fs":"'+this.p_fillStyle+'"'; }
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
 * item.getRadius returns the radius of an item
 *
 * @return radius
 */
DRAWLIB.m_getRadius = function() { return this.p_radius; };

/**
 * item.setRadius sets the radius of an item
 *
 * @param radius
 */
DRAWLIB.m_setRadius = function( radius ) { this.p_radius = Math.round(radius); };

// Draw small 'handles' on the corners and middles of sides.
// These can then be grabbed.
// For the convenience of the caller, the positions of the
// handles are returned in canvas co-ords.
// This version is for items that cannot be rotated
// Handles are placed wholly inside the bounding box for dragging reasons
DRAWLIB.m_drawHandlesNoRotation = function(style, wid) {
    var handlePos = [];
    var BB = this.p_pickBB;
    var BBMin = this.p_pic.windowToCanvasCoords(BB[0], BB[1]);
    var BBMax = this.p_pic.windowToCanvasCoords(BB[2], BB[3]);
    // Create Corner points
    handlePos[0] = [BBMin[0]+wid/2, BBMin[1]+wid/2];
    handlePos[1] = [BBMax[0]-wid/2, BBMin[1]+wid/2];
    handlePos[2] = [BBMax[0]-wid/2, BBMax[1]-wid/2];
    handlePos[3] = [BBMin[0]+wid/2, BBMax[1]-wid/2];
    // Create Mid points
    handlePos[4] = [BBMin[0]+wid/2, (BBMin[1]+BBMax[1])/2];
    handlePos[5] = [(BBMin[0]+BBMax[0])/2, BBMin[1]+wid/2];
    handlePos[6] = [BBMax[0]-wid/2, (BBMin[1]+BBMax[1])/2];
    handlePos[7] = [(BBMin[0]+BBMax[0])/2, BBMax[1]-wid/2];
    var ctxt = this.p_pic.p_ctxt;
    ctxt.fillStyle = style;
    for (var i = 0 ; i < 8 ; i++) {
	ctxt.fillRect( handlePos[i][0]-wid/2, handlePos[i][1]-wid/2, wid, wid);
	}
    return handlePos;
    };

// Set drawing boundary and picking bounding box in real world co-ords
DRAWLIB.m_setBoxesEllipse = function() {
    this.p_border = [];
    var radius = this.p_radius;
    var midX = this.p_midX;
    var midY = this.p_midY;
    this.p_border[0] = [midX - radius, midY - radius];
    this.p_border[1] = [midX + radius, midY - radius];
    this.p_border[2] = [midX + radius, midY + radius];
    this.p_border[3] = [midX - radius, midY + radius];
    this.p_border[4] = [midX - radius, midY - radius];
    this.p_pickBB = [midX-radius, midY-radius,
                     midX+radius, midY+radius];
    };

DRAWLIB.p_drawEllipse = function(ctxt, canvasWidth, window) {
    // Can be used to draw to other contexts than the default
    // if in main window, check for out of view
    if (ctxt === this.p_pic.p_ctxt &&
        !DRAWLIB.p_isInWindow(this.p_pickBB, window)) { return; }

    var scale = this.p_pic.p_windowToCanvasContextScale( canvasWidth, window);
    var midP = this.p_pic.p_windowToCanvasContextCoords(this.p_midX, this.p_midY,
                                                     canvasWidth, window);
    var radius = this.p_radius * scale;
    // If filled then fill it
    if (this.p_fillStyle && this.p_fillStyle !== 'none') {
        ctxt.fillStyle = this.p_fillStyle;
        ctxt.beginPath();
        ctxt.arc( midP[0], midP[1], radius, 0, 2*Math.PI,false);
        ctxt.fill();
        ctxt.closePath();
        }
    ctxt.strokeStyle = this.p_strokeStyle;
    ctxt.lineWidth = Math.round(scale * this.p_lineWidth);
    ctxt.beginPath();
    ctxt.arc( midP[0], midP[1], radius, 0, 2*Math.PI, false);
    ctxt.stroke();
    ctxt.closePath();
    };

// Offsets in canvas co-ords
DRAWLIB.m_drawOffsetEllipse = function(oldXOff, oldYOff, xOff, yOff, blank) {
    var midP = this.p_pic.windowToCanvasCoords( this.p_midX, this.p_midY);
    var window = this.p_pic.p_window;
    var scale = this.p_pic.windowToCanvasScale();
    var ctxt = this.p_pic.p_ctxt;
    var lw = 1; // Thicker linewidths leave trails
    if (blank) { this.p_redrawOffset(oldXOff, oldYOff); }
    var radius = this.p_radius * scale;
    // If filled then fill it
    if (this.p_fillStyle && this.p_fillStyle !== 'none') {
        ctxt.fillStyle = this.p_fillStyle;
        ctxt.beginPath();
        ctxt.arc( xOff + midP[0], yOff + midP[1], radius, 0, 2*Math.PI, false);
        ctxt.fill();
        ctxt.closePath();
        }
    // Draw a new border
    ctxt.strokeStyle = this.p_strokeStyle;
    ctxt.lineWidth = lw;
    ctxt.beginPath();
    ctxt.arc( xOff + midP[0], yOff + midP[1], radius, 0, 2*Math.PI, false);
    ctxt.stroke();
    ctxt.closePath();
    // Refresh the frame
    this.p_pic.p_redrawOneFrame();
    };

// Is the point x,y in window co-ords a hit on the image?
DRAWLIB.m_pickEllipse = function(x, y) {
    var BB = this.p_pickBB;
    var marg = 5 ; // Margin of error, would be nice to scale
    // Check against crude bounding box
    if (x < BB[0]-marg || x > BB[2]+marg) { return false; }
    if (y < BB[1]-marg || y > BB[3]+marg) { return false; }
    // Calculate the distance from the centre.
    var dist = Math.sqrt((x-this.p_midX)*(x-this.p_midX) + 
        (y-this.p_midY)*(y-this.p_midY));
    // If the ellipse is filled then we have a hit if we are within the radius
    if ((this.p_fillStyle) && (dist <= this.p_radius+marg)) { return true; }
    // If the ellipse is notfilled then we need to be 'close' to the radius.
    if ((!this.p_fillStyle) && (Math.abs(dist-this.p_radius) < marg)) {
        return true;
        }
    return false;
    };

// Draw a circle that is stretched in some way
// The handle is an identifier for the handle that is being dragged.
// 0 to 3 are corner handles, 4 to 7 are mid side handles
DRAWLIB.m_drawStretchEllipse = function( handle, oldXOff, oldYOff, xOff, yOff,
     blank) {
    if (blank) { this.p_blankStretch( handle, oldXOff, oldYOff); }
    var BB = this.p_pickBB;
    var cBB = this.p_pic.windowToCanvasRect( BB[0], BB[1],
                                               BB[2], BB[3]);
    var sPoints = DRAWLIB.p_stretchPoints(handle, xOff, yOff,           
        [[cBB[0], cBB[1]], [cBB[2], cBB[3]]],
        [cBB[0], cBB[1]], [cBB[2], cBB[3]]);
    var p_midX = Math.round((sPoints[0][0] + sPoints[1][0])/2);
    var p_midY = Math.round((sPoints[0][1] + sPoints[1][1])/2);
    var radius = Math.round( 0.5 * Math.min(
        (sPoints[1][0]-sPoints[0][0]), (sPoints[1][1]-sPoints[0][1])));
    // Draw a new circle
    var ctxt = this.p_pic.p_ctxt;
    var lw = 1; // thicker linewidths leave trails
    ctxt.strokeStyle = this.p_strokeStyle;
    ctxt.lineWidth = lw;
    ctxt.beginPath();
    ctxt.arc( p_midX, p_midY, radius, 0, 2*Math.PI, false);
    ctxt.stroke();
    ctxt.closePath();
    };

// Apply a window offset stretch to an ellipse based on
// dragging a specific handle
// The offsets ate in canvas co-ords
DRAWLIB.m_applyStretchToEllipse = function( handle, xOff, yOff) {
    // Set up diagonal corners and stretch them.
    var BB = this.p_pickBB;
    var diag = DRAWLIB.p_stretchPoints(handle, xOff, yOff,
        [[BB[0], BB[1]], [BB[2], BB[3]]],
         [BB[0], BB[1]], [BB[2], BB[3]]);
    // Now derive the middl and radius from the diagonals
    this.p_midX = Math.round((diag[0][0]+diag[1][0])/2);
    this.p_midY = Math.round((diag[0][1]+diag[1][1])/2);
    this.p_radius = Math.round( 0.5 * Math.min(
        diag[1][0]-diag[0][0], diag[1][1]-diag[0][1]));
    this.setBoxes();
    };

