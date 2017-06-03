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
 * pic.creatText creates a text drawing item and adds it to the drawing
 * item list. The text is created with default styles and on layer 0.
 * If the item has a line style or fill style set then it will be drawn
 * within a box.
 * The body text can be multi-line.
 *
 * @param id Item identifier
 * @param x X co-ordinate of the centre point
 * @param y Y co-ordinate of the centre point
 * @param bodyText Text to be drawn
 * @param angle Rotation clockwise in degrees
 * @param fontSize Vertical size of the text in window co-ordinates
 * @return the created item
 */
DRAWLIB.m_createText = function(id, x, y, bodyText, angle, fontSize) {
    // Derive from Rectangle
    var oneItem = this.createRect(id, x, y, 1, 1, angle);
    oneItem.p_type = 'T';
    oneItem.p_strokeStyle = ''; // Default no text box
    oneItem.p_text = bodyText;
    oneItem.p_lineSpacing = 1.2; // 20% gap, might overwrite
    oneItem.p_breakText = DRAWLIB.p_breakText;
    oneItem.p_breakText();
    oneItem.getText = DRAWLIB.m_getText;
    oneItem.setText = DRAWLIB.m_setText;
    oneItem.p_fontFamily = 'sans';
    oneItem.p_fontStyle = ''; // normal, bold, italic
    // fill colour for font, can be different to background box
    oneItem.p_fontFillStyle = '#000000';
    oneItem.p_fontSize = Math.round(fontSize); // In window co-ords
    oneItem.p_textBaseline = 'middle';
    oneItem.p_textAlign = 'center';
    oneItem.setBoxes = DRAWLIB.m_setBoxesText;
    oneItem.p_setBoxesRect = DRAWLIB.m_setBoxesRect;
    oneItem.doDrawTextWithOffset = DRAWLIB.m_doDrawTextWithOffset;
    oneItem.p_drawOffsetRect = DRAWLIB.p_drawOffsetRect;
    oneItem.p_draw = DRAWLIB.p_drawText;
    oneItem.p_drawBox = DRAWLIB.p_drawRect; // Draw box for text in box
    oneItem.drawOffset = DRAWLIB.m_drawOffsetText;
    oneItem.p_drawOffsetBox = DRAWLIB.p_drawOffsetBox;
    oneItem.pick = DRAWLIB.m_pickText;
    oneItem.getStr =DRAWLIB.m_getStrText;
    oneItem.getFontStyle = DRAWLIB.m_getFontStyleText;
    oneItem.setFontStyle = DRAWLIB.m_setFontStyleText;
    oneItem.getFontFamily = DRAWLIB.m_getFontFamilyText;
    oneItem.setFontFamily = DRAWLIB.m_setFontFamilyText;
    oneItem.getFontSize = DRAWLIB.m_getFontSizeText;
    oneItem.setFontSize = DRAWLIB.m_setFontSizeText;
    oneItem.getFontColorStyle = DRAWLIB.m_getFontColorStyle;
    oneItem.setFontColorStyle = DRAWLIB.m_setFontColorStyle;
    oneItem.setTextBaseline = DRAWLIB.m_setTextBaseline;
    oneItem.setBoxes();
    return oneItem;
    };

DRAWLIB.m_getStrText = function() { // Return JSON version of the object
    var itemStr = '{"t":"T","mx":'+this.p_midX+',"my":'+this.p_midY+',"a":'+
        this.p_angle+',"tx":"'+DRAWLIB.escapeQuotes(this.p_text)+
        '","sz":'+this.p_fontSize+',"fc":"'+this.p_fontFillStyle+'"';
    if (this.p_textBaseline !== 'middle') {
        itemStr += ',"va":"'+this.p_textBaseline+'"';
        }
    if (this.p_fontFamily !== 'sans' ) {
        itemStr += ',"ff":"'+this.p_fontFamily+'"';
        }
    if (this.p_fontStyle ) { itemStr += ',"fst":"'+this.p_fontStyle+'"'; }
    if (this.p_lineWidth) { itemStr += ',"lw":'+this.p_lineWidth; }
    if (this.p_strokeStyle !== '') { // Has a text box
        itemStr += ',"ls":"'+this.p_strokeStyle+'","w":'+this.p_winWidth+
            ',"h":'+this.p_winHeight;
        }
    if (this.p_fillStyle) { itemStr += ',"fs":"'+this.p_fillStyle+'"'; }
    if (this.p_layer !== 0) { itemStr += ',"layer":'+this.p_layer; }
    if (this.p_z !== 0) { itemStr += ',"z":'+this.p_z; }
    itemStr += '}';
    return itemStr;
    };

// Break up body text into an array of lines
// Always call this after setting the body text.
DRAWLIB.p_breakText = function() {
    this.p_lines = this.p_text.split("\n");
    };

/**
 * item.getText returns the text of an item
 *
 * @return text as a string
 */
DRAWLIB.m_getText = function() { return this.p_text; };

/** item.setText sets the text of an item
 *
 * @param text as a string
 */
DRAWLIB.m_setText = function( text ) {
    this.p_text = text;
    this.p_breakText();
    };

// Set drawing boundary and picking bounding box in window co-ords
DRAWLIB.m_setBoxesText = function() {
    // If we have text in a box then just use the box part
    if (this.p_strokeStyle || this.p_fillStyle) {
        this.p_setBoxesRect();
        return; 
        }
    // With no box, we need the text dimensions for each line
    // This code assumes aligned center middle
    var len = this.p_text.length;
    // Font size is in window co-ords, not canvas
    var fontSize = Math.round(this.p_fontSize);
    var ctxt = this.p_pic.p_ctxt;
    ctxt.font = this.p_fontStyle+' '+fontSize+'px '+this.p_fontFamily;
    this.p_winWidth = 0;
    for (var l = 0 ; l < this.p_lines.length ; l++) {
        var metrics = ctxt.measureText(this.p_lines[l]);
        this.p_winWidth = Math.max( this.p_winWidth, metrics.width );
        }
    this.p_winHeight = this.p_fontSize * this.p_lineSpacing *
                       this.p_lines.length;
    // Precalculate numbers used more than once
    var wCos = Math.cos(this.p_radAngle) * this.p_winWidth / 2;
    var wSin = Math.sin(this.p_radAngle) * this.p_winWidth / 2;
    var hCos = Math.cos(this.p_radAngle) * this.p_winHeight / 2;
    var hSin = Math.sin(this.p_radAngle) * this.p_winHeight / 2;
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

// Draw some text with an optional offset in canvas co-ords
DRAWLIB.m_doDrawTextWithOffset = function(ctxt, canvasWidth, window, 
                                          xOff, yOff) {
    // If in main window, check for outside 
    if (ctxt === this.p_pic.p_ctxt &&
        !DRAWLIB.p_isInWindow(this.p_pickBB, window)) { return; }
    var scale = this.p_pic.p_windowToCanvasContextScale(canvasWidth, window);
    var lineOff = Math.round(this.p_fontSize*this.p_lineSpacing * scale);
    var yHalf = Math.round(lineOff * (this.p_lines.length-1) * 0.5);
    var cMid = this.p_pic.p_windowToCanvasContextCoords(this.p_midX,
                                                        this.p_midY,
                                                        canvasWidth, window);
    if (this.p_strokeStyle || this.p_fillStyle) { 
        this.p_drawOffsetBox(ctxt, canvasWidth, window, xOff, yOff);
        }
    var canWidth = this.p_winWidth * scale;
    var canHeight = this.p_winHeight * scale;
    var fontSize = Math.round(this.p_fontSize * scale);
    // cMid is the midpoint of the text. If the vertical alignment
    // is 'top' or 'bottom' then it is adjusted for the bounding box.
    // Note that if the bounding box is set based on the text itself then
    // these all vertical alignments look alike.
    // Of course, if the text or the picture are rotated then top and bottom
    // are relative to a rotated line.
    var winRot = this.p_pic.p_rotation;
    var tang = this.p_radAngle - Math.PI*winRot*0.5;
    if ((this.p_textBaseline === 'top' ) || (this.p_textBaseline === 'bottom')){
        var thalf = (canHeight*0.5) + yHalf;
        var tcos = Math.cos(tang) * thalf;
        var tsin = Math.sin(tang) * thalf;
        if (this.p_textBaseline === 'top' ) {
            cMid[0] += tsin;
            cMid[1] -= tcos;
            }
        if (this.p_textBaseline === 'bottom' ) {
            cMid[0] -= tsin;
            cMid[1] += tcos;
            }
        }
    // Now offset the position for a drag
    cMid[0] += xOff;
    cMid[1] += yOff;
    // Now do the actual drawing, rotated appropriately
    ctxt.save();
    ctxt.translate(cMid[0], cMid[1]);
    ctxt.rotate(tang);
    ctxt.translate(-cMid[0], -cMid[1]);
    // Font string is style, family and size (in pixels here)
    ctxt.font = this.p_fontStyle+' '+fontSize+'px '+this.p_fontFamily;
    ctxt.fillStyle = this.p_fontFillStyle;
    ctxt.textAlign = this.p_textAlign;
    ctxt.textBaseline = this.p_textBaseline;
    for (var l = 0 ; l < this.p_lines.length ; l++ ) {
        var y = cMid[1] - yHalf + (lineOff*l);
        ctxt.fillText(this.p_lines[l], cMid[0], y);
        }
    ctxt.restore(); 
    };

DRAWLIB.p_drawText = function(ctxt, canvasWidth, window) {
    // Can be used to draw to other contexts than the default
    if (this.p_strokeStyle || this.p_fillStyle) {
         this.p_drawBox( ctxt, canvasWidth, window);
        }
    this.doDrawTextWithOffset(ctxt, canvasWidth, window, 0, 0);
    };

// Offsets in canvas co-ords
DRAWLIB.m_drawOffsetText = function(oldXOff, oldYOff, xOff, yOff, blank) {
    var pic = this.p_pic;
    if (blank) { this.p_redrawOffset(oldXOff, oldYOff); }
    if (this.p_strokeStyle || this.p_fillStyle) { 
        this.p_drawOffsetBox(pic.p_ctxt, pic.p_canvasWidth, pic.p_window,
                             xOff, yOff);
        }
    this.doDrawTextWithOffset(pic.p_ctxt, pic.p_canvasWidth, pic.p_window,
        xOff, yOff);
    // Refresh the frame
    this.p_pic.p_redrawOneFrame();
    };

// Is the point x,y in real world co-ords a hit on the text?
DRAWLIB.m_pickText = function(x, y) {
    var BB = this.p_pickBB;
    var marg = 5 ; // Margin of error, would be nice to scale
    // Check against crude bounding box
    if (x < BB[0]-marg || x > BB[2]+marg) { return false; }
    if (y < BB[1]-marg || y > BB[3]+marg) { return false; }
    // If the text not angled then the BB check is good enough
    if ((this.p_fillStyle !== 'none') && (this.p_angle === 0)) { return true; }
    // If we have a text box then check for within the box
    var bord, side1, side2, i;
    if (this.p_fillStyle) {
        bord = this.p_border;
        side1 = DRAWLIB.p_pointSideOfLine(bord[0][0], bord[0][1],
            bord[1][0], bord[1][1], x, y);
        for ( i = 1 ; i < 4 ; i++){
            side2 = DRAWLIB.p_pointSideOfLine(bord[i][0], bord[i][1],
                bord[i+1][0], bord[i+1][1], x, y);
            if (((side1 < 0) && (side2 > 0)) || ((side1 > 0) && (side2 < 0))) {
                return false;
                }
            if (side1 === 0) { side1 = side2; }
           }
        return true;
        }
    // At this point we have angled text with no box
    // If the text is angled then we check for inside the angled box
    bord = this.p_border;
    side1 = DRAWLIB.p_pointSideOfLine(bord[0][0], bord[0][1],
        bord[1][0], bord[1][1], x, y);
    for ( i = 1 ; i < 4 ; i++){
        side2 = DRAWLIB.p_pointSideOfLine(bord[i][0], bord[i][1],
            bord[i+1][0], bord[i+1][1], x, y);
        if (((side1 < 0) && (side2 > 0)) || ((side1 > 0) && (side2 < 0))) {
            return false;
            }
        if (side1 === 0) { side1 = side2; }
       }
    return true;
    };

/**
 * item.getFontStyle returns the current font style
 *
 * @return font style
 */
DRAWLIB.m_getFontStyleText = function() { return this.p_fontStyle; };

/**
 * item.setFontStyle sets the style to be used for text for text based items.
 * The fontStyle should be an HTML color.
 *
 * @param fontStyle The style for the text
 */
DRAWLIB.m_setFontStyleText = function(fontStyle) {
    this.p_fontStyle = fontStyle;
    };

/**
 * item.getFontFamily returns the font family.
 *
 * @return Font family
 */
DRAWLIB.m_getFontFamilyText = function() { return this.p_fontFamily; };

/**
 * item.setFontFamily sets the font family for text based items.
 *
 * @param fontFamily The font family for the text.
 */
DRAWLIB.m_setFontFamilyText = function(fontFamily) {
    this.p_fontFamily = fontFamily;
    };

/**
 * item.getFontSize returns the text size
 *
 * @return Text size in window units
 */
DRAWLIB.m_getFontSizeText = function() { return this.p_fontSize; };

/**
 * item.setFontSize sets the vertical text size for text based items.
 *
 * @param fontSize Text size in window units.
 */
DRAWLIB.m_setFontSizeText = function(fontSize) {
    this.p_fontSize = Math.round(fontSize);
    this.setBoxes();
    };

/**
 * item.getFontColorStyle returns the text color.
 *
 * @return color style for the text
 */
DRAWLIB.m_getFontColorStyle = function() { return this.p_fontFillStyle; };

/**
 * item.setFontColorStyle sets the color style to be used for text for text
 * based items.
 * The fontStyle should be an HTML color.
 *
 * @param fontColorStyle The style for the text
 */
DRAWLIB.m_setFontColorStyle = function(fontColorStyle) {
    this.p_fontFillStyle = fontColorStyle;
    };
// This shouldn't be used yet as the bounding boxes assume middle center
DRAWLIB.m_setTextAlign = function(textAlign) { this.p_textAlign = textAlign; };
/**
 * item.setTextBaseline sets the text vertical alignment.
 * This library only supports 'top', middle' or 'bottom'
 */
DRAWLIB.m_setTextBaseline = function(textBaseline) {
    this.p_textBaseline = textBaseline;
    };

