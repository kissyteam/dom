/**
 * test cases for offset sub module of dom module
 * @author yiminghe@gmail.com
 * need to be completed
 */

var $ = window.jQuery;
var Dom = require('dom');
/*jshint quotmark:false*/
describe("offset", function () {
    var iframeTpl = '<iframe src="./specs/offset-iframe.html" ' +
            'id="test-iframe"  ' +
            'style="border:1px solid black; "' +
            ' width="200" height="200"  ' +
            'frameborder="0" scrolling="no"  ></iframe>',

        tpl = '<div id="test-offset" style="width:100px;height:100px;border: 1px solid red;">' +
            'offset</div>';

    beforeEach(function () {
        $('body').append(tpl);
    });

    afterEach(function () {
        $('#test-offset').remove();
    });

    it("should works", function () {
        var testOffset = Dom.get("#test-offset");
        var o = Dom.offset(testOffset);
        Dom.offset(testOffset, o);
        var o2 = Dom.offset(testOffset);
        expect(o2.top).to.be(o.top);
        expect(o2.left).to.be(o.left);
        expect(testOffset.style.position).to.be('relative');
    });

    it("should consider html border", function () {
        // ie 下应该减去窗口的边框吧，毕竟默认 absolute 都是相对窗口定位的
        // 窗口边框标准是设 documentElement ,quirks 时设置 body
        // 最好禁止在 body 和 html 上边框 ，但 ie < 9 html 默认有 2px ，减去
        // 但是非 ie 不可能设置窗口边框，body html 也不是窗口 ,ie 可以通过 html,body 设置
        // 标准 ie 下 docElem.clientTop 就是 border-top
        // ie7 html 即窗口边框改变不了。永远为 2

        //只考虑 ie 标准模式了,ie<9 下设置边框，否则默认 2px
        document.documentElement.style.borderTop = "3px";

        var a;

        Dom.prepend(a = Dom.create("<div style='position: absolute;top:0;'/>"), document.body);

        // ie < 9 相对于 document.documentElement 即窗口
        expect(Dom.offset(a).top).to.be(0);

        Dom.offset(a, {
            top: 0
        });

        expect(parseInt(Dom.css(a, "top"), 10)).to.be(0);

        document.documentElement.style.borderTop = "";

        Dom.remove(a);
    });

    it("should works for framed element", function (done) {
        var div = $('<div>').appendTo(document.body);
        div[0].innerHTML = iframeTpl;

        var iframe = Dom.get("#test-iframe");

        var ok = 0;

        $(iframe).on('load', function () {
            var win = iframe.contentWindow;
            var inner = Dom.get("#test-inner", win.document);
            var innerOffsetTop = Dom.offset(inner).top - Dom.scrollTop(win);
            var iframeTop = Dom.offset(iframe).top;
            var totalTop = Dom.offset(inner, undefined, window).top;
            expect(innerOffsetTop + iframeTop).to.be(totalTop);

            setTimeout(function () {
                div.remove();
                ok = 1;
                done();
            }, 100);
        });
    });

    it("should not change after get and set", function () {
        var scrollTop = Dom.scrollTop();
        window.scrollTo(0, 100);
        var div = Dom.create("<div style='position: absolute;top:200px;background-color: red;width:100px;height: 100px;z-index: 10999990;'></div>");
        Dom.prepend(div, document.body);
        var originalOffset = Dom.offset(div);
        expect(originalOffset.top - 200).to.be.within(-4,4);
        window.scrollTo(0, scrollTop);
        Dom.remove(div);
    });
});
