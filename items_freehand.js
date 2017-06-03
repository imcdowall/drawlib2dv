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
 * pic.createFreehand creates a multi line segment drawing item based on a
 * freehand line with short line segments and adds it
 * to the drawing item list. The line is created with default styles and on
 * layer 0.
 *
 * @param id Item identifier
 * @param points Array of 2-element points
 * @return the created item
 */
DRAWLIB.m_createFreehand = function(id, points) {
    // Derive from Polyline
    DRAWLIB.p_optimiseFreehand(points);
    var oneItem = this.createPolyline(id, points);
    oneItem.p_subType = 'F'; // Differentiate between Polyline & freehand
    oneItem.pick = DRAWLIB.m_pickFreehand;
    oneItem.setBoxes();
    return oneItem;
    };

// Is the point x,y in real world co-ords a hit on the image?
DRAWLIB.m_pickFreehand = function(x, y) {
    var BB = this.p_pickBB;
    var marg = 5 ; // Margin of error, would be nice to scale
    // Check against crude bounding box
    if (x < BB[0]-marg || x > BB[2]+marg) { return false; }
    if (y < BB[1]-marg || y > BB[3]+marg) { return false; }
    // Check against vertices - assume short lines
    var points = this.p_points;
    for (var i = 1 ; i < points.length ; i++){
        if ((Math.abs(x-points[i][0]) < marg) &&
            (Math.abs(y-points[i][1]) < marg)) {
            return true;
            }
        }
    return false;
    };

DRAWLIB.p_optimiseFreehand = function(aPoints) {
    // Function to remove redundant points from a polyline.
    // Remove points that are the same.
    // Because we do not want to alter the array while we are working on it,
    // we simply mark points for deletion in the first pass and then delete them
    var len = aPoints.length;
    var deletePoints = []; // Array of indices of points to be deleted
    var i ;
    // First pass - find unnecessary points based on adjacency
    for ( i = 1 ; i < len ; i++ ) {
        var ap1 = aPoints[i-1];
        var ap2 = aPoints[i];
        if ((Math.abs(ap1[0]-ap2[0]) < 1) && (Math.abs(ap1[1]-ap2[1]) < 1)) {
            deletePoints.push(i);
            }
        }   
    // Second pass - delete unnecessary points
    // Do this from the end towards the beginning or the indices become wrong
    var onePoint = deletePoints.pop();
    while (onePoint) {
        aPoints.splice(onePoint, 1);
        onePoint = deletePoints.pop();
        }

    // Find points that are at the same angle between surrounding points and
    // so can be removed without affecting the appearance of a line.
    // Note - cannot remove end points.
    // Because we do not want to alter the array while we are working on it,
    // we simply mark points for deletion in the first pass and then delete them
    // in a second pass.
    // To avoid overly severe effects, we will not remove two adjacent points
    // for now.
    len = aPoints.length;
    deletePoints = []; // Array of indices of points to be deleted
    i = 1 ; // Don't use for loop as we can skip points
    var margin = Math.PI / 36 ; // Approx 5 degrees margin for similar lines
    // First pass - find unnecessary points based on angle
    while (i < len-1) {
        var p1 = aPoints[i-1];
        var p2 = aPoints[i];
        var p3 = aPoints[i+1];
        var ang12 = Math.atan2(p2[1]-p1[1], p2[0]-p1[0]);
        var ang23 = Math.atan2(p3[1]-p2[1], p3[0]-p2[0]);
        // We may miss some with angles being around +/- Pi but don't care
        if (Math.abs(ang23-ang12) < margin) {
            deletePoints.push(i);
            i += 2 ; // Don't try to delete two points in a  row
            }
        else { i += 1; }
        }
    // Second pass - delete unnecessary points
    // Do this from the end towards the beginning or the indices become wrong
    onePoint = deletePoints.pop();
    while (onePoint) {
        aPoints.splice(onePoint, 1);
        onePoint = deletePoints.pop();
        }
    };

