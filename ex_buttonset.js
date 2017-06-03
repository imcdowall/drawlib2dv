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

// Methods to manage sets of buttons that need to show one highlighted
// at a time. These are akin to radio buttons but more flexible.

var BUTTAPP = {'sets':{}, 'butts':{}};

function createButtonSet( setName, defClass, setClass, idSet ) {
    // record the set overall and for each button id
    BUTTAPP.sets.setName = {'ids':idSet, 'set':undefined,
                         'defClass':defClass, 'setClass':setClass};
    for (var i = 0 ; i < idSet.length ; i++ ) {
        BUTTAPP.butts[idSet[i]] = setName;
        }
    }

function setButton( idVal ) {
    var setName = BUTTAPP.butts[idVal];
    if (!setName) { return; }
    var set = BUTTAPP.sets[setName];
    if (!set) { return; }
    // Clear the previously set button, if any
    if (set.set) {
        document.getElementById(set.set).
            setAttribute('class', set.defClass);
        }   
    // Mark the set button
    set.set = idVal;
    document.getElementById(idVal).setAttribute('class', set.setClass);
    }

function getButton( setName ) {
    var butt ;
    var set = BUTTAPP[setName];
    if (set.set) { butt = set.set; }
    return butt;
    }

