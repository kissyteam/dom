/**
 * tc about script exec when clone and insert
 * @author yiminghe@gmail.com
 */

var Dom = require('dom');
var UA = require('ua');
/*jshint quotmark:false*/
var div = document.body.appendChild(Dom.create('<div style="display:none"></div>'));

describe("script", function () {
    var o1, o2, scriptTestHolder2, o22;

    div.innerHTML = '<div id="scriptTestHolder">' +
        '<script>' +
        'if (!window.scriptTest1) {' +
        'window.scriptTest1 = 1;' +
        '} else {' +
        'window.scriptTest1++;' +
        '}' +
        '</script>' +
        '<script src="../others/scripts-exec/clone-ie-tc.js"></script>' +
        '</div>';

    o1 = window.scriptTest1 = 1;
    o2 = window.scriptTest2 = 1;

    var scriptTestHolder = Dom.get("#scriptTestHolder");

    it("behave right", function () {
        expect(o1).to.be(1);
        expect(o2).to.be(1);
        scriptTestHolder2 = Dom.clone(scriptTestHolder, true);
        // inline should not run when clone
        o1 = window.scriptTest1;
        expect(o1).to.be(1);

        // external should not run when clone
        o22 = o2 = window.scriptTest2;
        // ie9 bug
        if (UA.ieMode !== 9) {
            expect(o2).to.be(1);
        }
        // div.prepend(scriptTestHolder2);
        Dom.prepend(scriptTestHolder2, div);
        // "inline should not run when insert"
        o1 = window.scriptTest1;
        expect(o1).to.be(1);

        // external should not run when insert
        o2 = window.scriptTest2;
        expect(o2).to.be(o22);

        Dom.remove(div);
    });
});