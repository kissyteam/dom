/**
 * test cases for style sub module of dom module
 * @author yiminghe@gmail.com
 */

/*jshint quotmark:false*/
/*global $*/
var Dom = require('dom');
var util = require('util');
var UA = require('ua');

describe('style', function () {
    it("css works", function () {
        var elem = Dom.create('<div id="test-div" ' +
            'style="padding-left: 2px; ' +
            'background: transparent; ' +
            '' +
            'float: left; ' +
            'border: 5px solid rgb(0,0,0);">x</div>');

        document.body.appendChild(elem);

        // getter
        expect(Dom.css(elem, 'float')).to.be('left');

        expect(Dom.css(elem, 'position')).to.be('static');

        if (UA.webkit) {
            expect(Dom.css(elem, 'backgroundColor')).to.be('rgba(0, 0, 0, 0)');
        } else {
            expect(Dom.css(elem, 'backgroundColor')).to.be('transparent');
        }

        expect(util.indexOf(Dom.css(elem, "backgroundPosition"), ['left 0% top 0%', '0% 0%']))
            .not.to.be(-1);

        expect(Dom.css(elem, 'fontSize')).to.be('16px');

        expect(Dom.css(elem, 'border-right-width')).to.be('5px');

        expect(Dom.css(elem, 'paddingLeft')).to.be('2px');

        expect(Dom.css(elem, 'padding-left')).to.be('2px');

        expect(Dom.css(elem, 'padding-right')).to.be('0px');

        expect(Dom.css(elem, 'opacity')).to.be('1');

        // 不加入 dom 节点，ie9,firefox 返回 auto by computedStyle
        // ie7,8 返回负数，offsetHeight 返回0
        //alert(elem.currentStyle.height);== auto
        expect(parseInt(Dom.css(elem, 'height'), 10) - 19).to.be.within(-2, 2);

        Dom.css(elem, 'float', 'right');

        expect(Dom.css(elem, 'float')).to.be('right');

        Dom.css(elem, 'font-size', '100%');

        expect(Dom.css(elem, 'font-size')).to.be('16px');

        Dom.css(elem, 'opacity', '0.2');

        expect(parseFloat(Dom.css(elem, 'opacity'), 10) - 0.2).to.be.within(-0.01, 0.01);

        Dom.css(elem, 'border', '2px dashed red');

        expect(Dom.css(elem, 'borderTopWidth')).to.be('2px');

        Dom.css(elem, {
            marginLeft: '20px',
            opacity: '0.8',
            border: '2px solid #ccc'
        });
        expect(parseFloat(Dom.css(elem, 'opacity'))-0.8).to.be.within(-0.01, 0.01);

        Dom.addStyleSheet(".shadow {" +
            "background-color: #fff;" +
            "-moz-box-shadow: rgba(0, 0, 0, 0.2) 2px 3px 3px;" +
            "-webkit-box-shadow: rgba(0, 0, 0, 0.2) 2px 3px 3px;" +
            "filter: progid:DXImageTransform.Microsoft.Shadow(direction = 155, Color = #dadada, Strength = 3)," +
            " progid:DXImageTransform.Microsoft.DropShadow(Color = #22aaaaaa, OffX = -2, OffY = -2);" +
            "}");

        var testFilter = Dom.create(' <div ' +
            'id="test-filter"' +
            ' class="shadow" ' +
            'style="height: 80px; ' +
            'width: 120px; ' +
            'border:1px solid #ccc;"></div>');
        document.body.appendChild(testFilter);
        // test filter  #issue5

        Dom.css(testFilter, 'opacity', 0.5);
        if (UA.ieMode < 9) {
            // 不加入 dom 节点取不到 class 定义的样式
            expect(testFilter.currentStyle.filter).to.be("progid:DXImageTransform.Microsoft.Shadow(direction = 155," +
                " Color = #dadada, Strength = 3), progid:DXImageTransform.Microsoft.DropShadow(Color = #22aaaaaa," +
                " OffX = -2, OffY = -2), alpha(opacity=50)");
        }

        Dom.remove([elem, testFilter]);
    });

    it("width/height works", function () {
        var elem = Dom.create('<div id="test-div" ' +
            'style="padding-left: 2pt; ' +
            'background: transparent; ' +
            '' +
            'float: left; ' +
            'border: 5px solid rgb(0,0,0);">x</div>');

        document.body.appendChild(elem);

        expect(Math.round(Dom.width(elem))-7).to.be.within(-2, 2);
        expect(Math.round(Dom.height(elem))-19).to.be.within(-2, 2);

        Dom.remove(elem);
    });

    it("show/hide works", function () {
        var elem = Dom.create('<div id="test-div" ' +
            'style="padding-left: 2pt; ' +
            'background: transparent; ' +
            '' +
            'float: left; ' +
            'border: 5px solid rgb(0,0,0);">x</div>');

        document.body.appendChild(elem);

        Dom.css(elem, 'display', 'none');

        Dom.show(elem);
        expect(Dom.css(elem, 'display')).to.be('block');

        Dom.removeAttr(elem, 'style');

        Dom.hide(elem);

        expect(Dom.css(elem, 'display')).to.be('none');

        Dom.removeAttr(elem, 'style');

        Dom.remove(elem);
    });

    it('show hide can precede css', function () {
        var id = util.guid('test-css');
        Dom.addStyleSheet('#' + id + ' {display:none}', 'xx-style' + id);
        var elem = Dom.create('<div></div>');
        elem.id = id;
        Dom.append(elem, document.body);
        Dom.show(elem);
        expect(Dom.css(elem, 'display')).to.be('block');
        Dom.remove(elem);
        Dom.remove('#' + 'xx-style' + id);
    });

    it('toggle works', function () {
        var elem = Dom.create('<div id="test-div" ' +
            'style="padding-left: 2pt; ' +
            'background: transparent; ' +
            '' +
            'float: left; ' +
            'border: 5px solid rgb(0,0,0);">x</div>');
        document.body.appendChild(elem);
        Dom.toggle(elem);
        expect(Dom.css(elem, 'display')).to.be('none');

        Dom.toggle(elem);

        expect(Dom.css(elem, 'display')).not.to.be('none');

        Dom.removeAttr(elem, 'style');

        Dom.remove(elem);
    });

    it('addStyleSheet works', function () {
        var elem = Dom.create("<div class='addStyleSheet'>12</div>");
        document.body.appendChild(elem);
        Dom.addStyleSheet(".addStyleSheet {width:100px}");
        expect(Dom.css(elem, 'width')).to.be("100px");
        Dom.remove(elem);
    });

    it("float works inline or from stylehsheet", function () {
        var tag = util.guid("float");
        Dom.addStyleSheet("." + tag + " {float:left}", tag + 'style');
        var d = Dom.create("<div class='" + tag + "' style='float:right'><" + "/div>");
        Dom.append(d, document.body);
        expect(Dom.css(d, "float")).to.be('right');
        expect(Dom.style(d, "float")).to.be('right');
        Dom.css(d, "float", "");

        expect(Dom.css(d, "float")).to.be('left');
        expect(Dom.style(d, "float")).to.be("");

        Dom.remove(d);
        Dom.remove('#' + tag + 'style');
    });

    // also test prop api
    it("float works inline or from stylehsheet", function () {
        var tag = util.guid("float");
        Dom.addStyleSheet("." + tag + " {float:left}", tag + 'style');

        var d = Dom.create("<div class='" + tag + "' style='float:right'><" + "/div>");
        Dom.append(d, document.body);
        expect(Dom.css(d, "float")).to.be('right');
        expect(Dom.style(d, "float")).to.be('right');
        // test style array
        Dom.style([d], "float", "");

        expect(Dom.css(d, "float")).to.be('left');
        expect(Dom.style(d, "float")).to.be("");


        // test style obj
        Dom.style([d], {"float": 'right'});

        expect(Dom.css(d, "float")).to.be('right');
        expect(Dom.style(d, "float")).to.be('right');

        Dom.remove(d);
        Dom.remove('#' + tag + 'style');
    });

    it("opacity works inline or from stylesheet", function () {
        var tag = util.guid("opacity");
        Dom.addStyleSheet("." + tag + " {opacity:0.55;filter:alpha(opacity=55); }", tag + 'style');

        var d = Dom.create("<div class='" + tag + "' style='" +
            "opacity:0.66;filter:Alpha(opacity=66); '>" +
            "<" + "/div>");
        Dom.append(d, document.body);
        expect(parseFloat(Dom.css(d, "opacity"))-0.66).to.be.within(-0.01, 0.01);
        expect(parseFloat(Dom.css(d, "opacity"))-0.66).to.be.within(-0.01, 0.01);

        Dom.css(d, "opacity", "");

        // https://github.com/kissyteam/kissy/issues/231
        expect(parseFloat(Dom.css(d, "opacity"))-0.55).to.be.within(-0.01,0.01)

        expect(Dom.style(d, "opacity")).to.be("");

        Dom.css(d, "opacity", 0.66);

        expect(parseFloat(Dom.css(d, "opacity"))-0.66).to.be.within(-0.01,0.01);
        expect(parseFloat(Dom.style(d, "opacity"))-0.66).to.be.within(-0.01,0.01);
        Dom.remove(d);
        Dom.remove('#' + tag + 'style');
    });

    it('does not leave empty style', function () {
        var d = Dom.create('<div><div></div></div>');
        Dom.append(d, 'body');
        Dom.css(d.firstChild, 'height', '');
        expect(d.innerHTML.toLowerCase()).to.be('<div></div>');
    });

    it("left works for auto", function () {
        var el = $("<div style='position: relative;padding: 20px;'>" +
            "<div style='position: absolute'></div><span></span>" +
            "<s style='position: fixed'></s></div>").appendTo('body')[0];
        expect(Dom.css(el, 'left')).to.be('0px');
        expect(Math.round(parseFloat(Dom.css(Dom.get('div', el), "top")))).to.be(20);
        expect(Dom.css(Dom.get('span', el), "top")).to.be('auto');
        expect(parseInt(Dom.css(Dom.get('s', el), "top"), 10) || 1)
            .to.be(parseInt(Dom.get('s', el).getBoundingClientRect().top, 10) || 0);
    });

    it("solve #80", function () {
        var div = Dom.create("<div></div>");
        Dom.append(div, document.body);
        Dom.css(div, "font-family", "宋体");
        Dom.css(div, "font-family", "");
        expect(div.style.cssText).to.be("");
        div.removeAttribute('style');
        Dom.remove(div);
    });

    describe('outerWidth/height', function () {
        // #119 : https://github.com/kissyteam/kissy/issues/119
        it("outerWidth should works for display:none", function () {
            var div = Dom.create("<div style='width:100px;display:none;'>" +
                "</div>");
            Dom.append(div, document.body);
            expect(Dom.innerWidth(div)).to.be(100);
            expect(Dom.outerWidth(div)).to.be(100);
            expect(Dom.width(div)).to.be(100);
            Dom.width(div, 100);
            expect(Dom.width(div)).to.be(100);
            Dom.remove(div);
        });

        it("outerWidth should works for display:none !important", function () {
            var id = util.guid('test-id');
            var div = Dom.create("<div style='width:100px;" +
                "margin:20px;" +
                "padding:10px;" +
                "border:5px solid black;' id='" +
                id + "' style='display:none;'>" +
                "</div>");
            Dom.addStyleSheet('#' + id + '{display:none !important;}',
                    id + 'style');
            Dom.append(div, document.body);
            expect(Dom.innerWidth(div)).to.be(120);
            expect(Dom.outerWidth(div)).to.be(130);
            expect(Dom.outerWidth(div, true)).to.be(170);
            expect(Dom.width(div)).to.be(100);
            Dom.remove(div);
            Dom.remove('#' + id + 'style');
        });

        it("inner/outer width/height works", function () {
            var elem = Dom.create('<div ' +
                'style="' +
                'position:absolute;' +
                'margin:9px; ' +
                'background: transparent; ' +
                'padding:3px;' +
                'border: 5px solid rgb(0,0,0);"><div ' +
                'style="padding: 0;margin: 0;' +
                'width:44px;height:44px;font-size:0;line-height:0;"></div>' +
                '</div>');

            document.body.appendChild(elem);

            expect(Math.round(Dom.width(elem))).to.be(44);
            Dom.height(elem, 44);
            expect(Math.round(Dom.height(elem))).to.be(44);

            expect(Math.round(Dom.innerWidth(elem))).to.be(44 + 3 * 2);
            expect(Math.round(Dom.innerHeight(elem))).to.be(44 + 3 * 2);

            expect(Math.round(Dom.outerWidth(elem))).to.be(44 + 3 * 2 + 5 * 2);
            expect(Math.round(Dom.outerWidth(elem))).to.be(44 + 3 * 2 + 5 * 2);


            expect(Math.round(Dom.outerWidth(elem, true))).to.be(44 + 3 * 2 + 5 * 2 + 9 * 2);
            expect(Math.round(Dom.outerHeight(elem, true))).to.be(44 + 3 * 2 + 5 * 2 + 9 * 2);

            Dom.remove(elem);
        });
    });

    it("css works for element not added to document yet for ie<9", function () {
        var ret = 0;
        try {
            Dom.css(document.createElement("span"), "display");
            ret = 1;
        } catch (e) {
        }
        expect(ret).to.be(1);
    });

    it('css works for margin-right for safari 5.1', function () {
        var div = Dom.create('<div style="width:100px;">' +
            '<div style="margin-left:10%"></div></div>');

        Dom.append(div, document.body);

//            var t=div.firstChild;
//            t.style.left='10%';
//            alert(t.style.pixelLeft);
        // ie6 not pass! see above
        if (UA.ie !== 6) {
            expect(Dom.css(div.firstChild, 'margin-left')).to.be('10px');
        }
        Dom.remove(div);
    });

    it('support box-sizing border-box', function () {
        var div = Dom.create('<div style="' +
            'width:100px;height:101px;' +
            'margin: 10px 11px;padding: 7px 8px;' +
            'border: 3px solid #000000;' +
            'border-left-width:4px;"></div>');
        Dom.css(div, 'box-sizing', 'border-box');
        Dom.append(div, document.body);
        if (div.offsetWidth !== 100) {
            return;
        }

        var $div = $(div);

        expect(Dom.css(div, 'width')).to.be($div.css('width'));
        expect(Dom.css(div, 'height')).to.be($div.css('height'));
        expect(Dom.width(div)).to.be($div.width());
        expect(Dom.height(div)).to.be($div.height());
        expect(Dom.innerWidth(div)).to.be($div.innerWidth());
        expect(Dom.innerHeight(div)).to.be($div.innerHeight());
        expect(Dom.outerWidth(div)).to.be($div.outerWidth());
        expect(Dom.outerHeight(div)).to.be($div.outerHeight());
        expect(Dom.outerWidth(div, true)).to.be($div.outerWidth(true));
        expect(Dom.outerHeight(div, true)).to.be($div.outerHeight(true));

        Dom.width(div, 100);
        Dom.height(div, 104);

        expect(Dom.css(div, 'width')).to.be($div.css('width'));
        expect(Dom.css(div, 'height')).to.be($div.css('height'));
        expect(Dom.width(div)).to.be($div.width());
        expect(Dom.height(div)).to.be($div.height());
        expect(Dom.innerWidth(div)).to.be($div.innerWidth());
        expect(Dom.innerHeight(div)).to.be($div.innerHeight());
        expect(Dom.outerWidth(div)).to.be($div.outerWidth());
        expect(Dom.outerHeight(div)).to.be($div.outerHeight());
        expect(Dom.outerWidth(div, true)).to.be($div.outerWidth(true));
        expect(Dom.outerHeight(div, true)).to.be($div.outerHeight(true));

        Dom.remove(div);
    });
});