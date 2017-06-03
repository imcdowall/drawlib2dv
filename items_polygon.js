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
 * pic.createPolygon creates a polygon drawing item and adds it
 * to the drawing item list. The polygon is created with default styles and on
 * layer 0.
 *
 * @param id Item identifier
 * @param points Array of 2-element points
 * @param fillStyle The style to fill the polygon - should be an HTML color
 * @return the created item
 */
DRAWLIB.m_createPolygon = function(id, points, fillStyle) {
    // Derive from Polyline
    var oneItem = this.createPolyline(id, points);
    oneItem.p_subType = 'PG';
    oneItem.p_fillStyle = fillStyle;
    oneItem.p_draw =DRAWLIB.p_drawPolygon;
    oneItem.pick = DRAWLIB.m_pickPolygon;
    oneItem.setBoxes();
    return oneItem;
    };

// Is the point x,y in real world co-ords a hit on the image?
DRAWLIB.m_pickPolygon = function(x, y) {
    if (this.p_neverPickable) { return false; }
    var BB = this.p_pickBB;
    var pp = this.p_points;
    var len = pp.length;
    var marg = 5 ; // Margin of error, would be nice to scale
    // Check against crude bounding box
    if (x < BB[0]-marg || x > BB[2]+marg) { return false; }
    if (y < BB[1]-marg || y > BB[3]+marg) { return false; }
    var bord = this.p_border;
    var side1 = DRAWLIB.p_pointSideOfLine(pp[0][0], pp[0][1],
                                          pp[1][0], pp[1][1], x, y);
    for (var i = 1 ; i < len-1 ; i++){
        var side2 = DRAWLIB.p_pointSideOfLine(pp[i][0], pp[i][1],
                                              pp[i+1][0], pp[i+1][1], x, y);
        if (((side1 < 0) && (side2 > 0)) || ((side1 > 0) && (side2 < 0))) {
            return false;
            }
        if (side1 === 0) { side1 = side2; }
       }
    return true;
    };

// Can be used to draw to other contexts than the default
DRAWLIB.p_drawPolygon = function(ctxt, canvasWidth, window) {
    // If in main window, check for outside
    if (ctxt === this.p_pic.p_ctxt &&
        !DRAWLIB.p_isInWindow(this.p_pickBB, window)) { return; }
    var cP = this.p_pic.p_windowToCanvasContextArray(this.p_points,
                                                  canvasWidth, window);
    var len = this.p_points.length;
    ctxt.fillStyle = this.p_fillStyle;
    ctxt.beginPath();
    ctxt.moveTo(cP[0][0], cP[0][1]);
    for (var i = 1 ; i < len ; i++ ) {
        ctxt.lineTo(cP[i][0], cP[i][1]);
       }
    ctxt.closePath();
    ctxt.fill();
    };

