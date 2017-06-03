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

DRAWLIB.p_createGroupBasic = function(id) {
    var oneItem = {'p_pic':this, 'p_id':id, 'p_dbId':0, 'p_drawable':false,
         'p_visible':false, 'p_pickable':false, 'p_type':'G'};
    // When created live within a picture, we will have item references but the
    // items may not have database\ids yet (until they are saved). These can
    // only be filled during a save action.
    // When created from the database, we will havethe database ids but the
    // items may not have been created in the picture yet (we don't want to
    // assume creation order) so we save the database\ids and fill in the
    // references when we can.
    oneItem.p_members = []; // Array of references to items in the group
    oneItem.p_memberDbIds = []; // Array of database ids
    oneItem.p_dragging = false;
    oneItem.getId = DRAWLIB.m_getId;
    oneItem.getDbId = DRAWLIB.m_getDbId;
    oneItem.setDbId = DRAWLIB.m_setDbId;
    oneItem.getStr = DRAWLIB.m_getStrGroup;
    oneItem.getType = DRAWLIB.m_getType;
    oneItem.pick = DRAWLIB.m_pickNull;
    oneItem.setGroupMembersFromDBId = DRAWLIB.m_setGroupMembersFromDBId;
    oneItem.p_checkMembersDBIds = DRAWLIB.p_checkMembersDBIds;
    oneItem.addMember = DRAWLIB.m_addMemberGroup;
    oneItem.removeMember = DRAWLIB.m_removeMemberGroup;
    oneItem.getMembers = DRAWLIB.m_getMembersGroup;
    oneItem.clear = DRAWLIB.m_clearGroup;
    oneItem.blankOffset = DRAWLIB.m_blankOffsetGroup;
    oneItem.drawOffset = DRAWLIB.m_drawOffsetGroup;
    this.p_setItem(oneItem);
    return oneItem;
    };

/**
 * pic.createGroupFromDB creates a group from a set of storage ids.
 *
 * @param id Local identifier
 * @param memberIds Array of member identifiers
 * @return Newly created group
 */
DRAWLIB.m_createGroupFromDB = function(id, memberIds) {
    var oneItem = this.p_createGroupBasic(id);
    oneItem.p_memberDbIds = memberIds;
    return oneItem;
    };

/**
 * pic.createGroupFromPic creates a group from a set of local ids.
 *
 * @param id Local identifier
 * @param members Array of member items
 * @return Newly created group
 */
DRAWLIB.m_createGroupFromPic = function(id, members) {
    var oneGroup = this.p_createGroupBasic(id);
    //Check for trying to include items that are already in another group
    // And notify other items of the group
    var badMembers = [];
    for (var i=0 ; i < members.length ; i++) {
        var oneItem = members[i];
        if (oneItem.getGroup() ) { badMembers.push(i); }
        else { oneItem.setGroup(oneGroup); }
        }
    var oneBad = badMembers.pop();
    while (oneBad) {
        members.splice(oneBad, 1);
        oneBad = badMembers.pop();
        }
    oneGroup.p_members = members;
    return oneGroup;
    };

DRAWLIB.m_getStrGroup = function() { // Return JSON version of the object
    var members = this.p_members;
    var memArr = [];
    memArr.push('{"t":"G","m":[');
    for (var i = 0 ; i < members.length ; i++) {
        memArr.push(members[i].p_dbId+',');
        }
    memArr.push(']}');
    return memArr.join('');
    };

DRAWLIB.m_pickNull = function( x, y) { return false; };
DRAWLIB.m_offsetNull = function(xOffset, yOffset) { return; };
DRAWLIB.m_drawNull = function(ctxt, canvasWidth, window) { return; };
DRAWLIB.m_nullFunction = function() { return; };

/**
 * group.setGroupMembersFromDBId is called for a group created with a set of
 * storage ids. Once all the members have been created, it sets the members
 * list from the storage ids.
 */
DRAWLIB.m_setGroupMembersFromDBId = function() {
    // Call this when all items have been created in the picture
    var memberIds = this.p_memberDbIds;
    var members = this.p_members;
    if (members.length) { return; } // already set
    var pic = this.p_pic;
    for (var i = 0 ; i < memberIds.length ; i++) { 
        var oneItem = pic.getItemByDBId(memberIds[i]);
        if (oneItem && !oneItem.getGroup()) {
            members.push(oneItem);
            oneItem.setGroup(this);
            }
        }
    };

//Return true if all members have database ids
DRAWLIB.p_checkMembersDBIds = function() {
    var allOk = true;
    var members = this.p_members;
    for (var i = 1 ; i < members.length ; i++) { 
         if (!members[i].dbId) {
             allOk = false; // At least one does not have an id
             break;
             }
         }
    return allOk;
    };

DRAWLIB.m_addMemberGroup = function( oneMember) {
    var members = this.p_members;
    var found = false;
    for ( var i = 0 ; i < members.length ; i++) {
        if (members[i] === oneMember) { found = true; break; }
        }
    if (!found) {
        members.push(oneMember) ;
        if (oneMember) { oneMember.setGroup(this); }
        }
    };

DRAWLIB.m_removeMemberGroup = function( oneMember ){
    var members = this.p_members;
    var found = false;
    for ( var i = 0 ; i < members.length ; i++) {
        if (members[i] === oneMember) { found = true; break; }
        }
    if (found) {
        oneMember.setGroup(0);
        members.splice(i, 1) ;
        }
    };

DRAWLIB.m_getMembersGroup = function() { return this.p_members; };

DRAWLIB.m_clearGroup = function() {
    var members = this.p_members;
    for (var i = 0 ; i < members.length ; i++) { members[i].setGroup(0); }
    };

// Offsets in canvas co-ords
DRAWLIB.m_drawOffsetGroup = function(oldXOff, oldYOff, xOff, yOff, blank) {
    // This could be optimised.
    // Currently, each item's rectangle is redrawn separately.
    // This can lead to some other items being redrawn up to once per group
    // member.
    // An alternative would be to blank all the rectangles and then feed all
    // the items to be redrawn into one list, ignoring duplicates.
    var i = 0;
    var members = this.p_members;
    var memberCount = members.length;
    // Redraw each bounding box
    if (blank) {
        for (i = 0 ; i < memberCount ; i++ ) {
            members[i].p_redrawOffset( oldXOff, oldYOff);
            }
        }
    // Redraw each item in the group
    for (i = 0 ; i < memberCount ; i++ ) {
        members[i].drawOffset( oldXOff, oldYOff, xOff, yOff, false) ;
        }
    };

DRAWLIB.m_blankOffsetGroup = function(xOff, yOff) {
    var i = 0;
    var members = this.p_members;
    var memberCount = members.length;
    // Blank under each bounding box
    for (i = 0 ; i < memberCount ; i++ ) {
        members[i].p_redrawOffset( xOff, yOff);
        }
    };
