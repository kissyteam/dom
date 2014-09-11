/**
 * test cases for scroll sub module of dom module
 * @author yiminghe@gmail.com
 */

var Dom = require('dom');
var UA = require('ua');
/*jshint quotmark:false*/
var $ = window.jQuery;
var tpl = '<div id="test-scroll" style="position:absolute;top:0;' +
        'left:0;width:300px;' +
        'background-color:white;">' +
        '<p>x</p>' +
        new Array(5).join('<p>x</p>') +
        '<div style="width:200px;' +
        'height:200px;overflow:auto;' +
        'position:relative;' +
        'border: 5px solid #ccc;"' +
        ' id="scroll-container">' +
        new Array(20).join('<p style="width:1000px;">x</p>') +
        '<div id="scroll-el" style="border:3px solid #9f9;' +
        'position:absolute;left:100px;">' +
        'test' +
        '</div>' +
        new Array(20).join('<p>x</p>') +
        '</div>' +
        new Array(4).join('<p>x</p>') +
        '<div id="scroll-iframe-holder"></div>' +
        new Array(20).join('<p>x</p>') +
        '</div>',
    iframeTpl = '<iframe src="./specs/offset-iframe.html" id="test-iframe" style="border:1px solid black; " ' +
        'width="200" height="200" frameborder="0" scrolling="no" ></iframe>';

describe('scroll', function () {
    var container ,
        node , containerBorderWidth,
        containerClientHeight,
        nodeHeight;

    beforeEach(function () {
        $('body').append(tpl);
        container = Dom.get('#scroll-container');
        node = Dom.get('#scroll-el');
        containerBorderWidth = parseInt(Dom.css(container, "border-top-width"), 10);
        containerClientHeight = container.clientHeight;
        nodeHeight = node.offsetHeight;
        Dom.scrollTop(0);
        Dom.scrollTop(container, 0);
    });

    afterEach(function () {
        $('#test-scroll').remove();
    });

    describe('non-auto works', function () {
        it("scroll node to container at axis xy manually works", function () {
            var nodeOffset = Dom.offset(node),
                containerOffset = Dom.offset(container);

            var scrollTop = nodeOffset.top - containerOffset.top - containerBorderWidth;
            var scrollLeft = nodeOffset.left - containerOffset.left - containerBorderWidth;

            Dom.scrollIntoView(node, container);

            nodeOffset = Dom.offset(node);
            containerOffset = Dom.offset(container);

            expect(Dom.scrollTop()).to.be.within(0, 5);

            expect(Dom.scrollTop(container) - scrollTop).to.be.within(-5, 5);
            expect(Dom.scrollLeft(container) - scrollLeft).to.be.within(-5, 5);

            expect(nodeOffset.top - containerOffset.top - containerBorderWidth).to.be.within(-5, 5);

            expect(Dom.scrollLeft()).to.be.within(-5, 5);
            expect(nodeOffset.left - containerOffset.left - containerBorderWidth).to.be.within(-5, 5);
        });

        it("scroll node to container at axis y manually works", function () {
            var nodeOffset = Dom.offset(node),
                containerOffset = Dom.offset(container);

            var scrollTop = nodeOffset.top - containerOffset.top - containerBorderWidth;

            Dom.scrollIntoView(node, container, {
                alignWithTop: true,
                allowHorizontalScroll: false
            });

            nodeOffset = Dom.offset(node);
            containerOffset = Dom.offset(container);

            expect(Dom.scrollTop()).to.be.within(0, 5);

            expect(Dom.scrollTop(container) - scrollTop).to.be.within(-5, 5);
            expect(Dom.scrollLeft(container)).to.be.within(-5, 5);

            expect(nodeOffset.top - containerOffset.top - containerBorderWidth).to.be.within(-5, 5);

            expect(Dom.scrollLeft()).to.be.within(-5, 5);
            expect(nodeOffset.left - containerOffset.left - 105).to.be.within(-5, 5);
        });

        it('works for iframe', function (done) {
            $('#scroll-iframe-holder')[0].innerHTML = iframeTpl;

            var iframe = Dom.get('#test-iframe');

            var ok = 0;

            $(iframe).on('load', function () {
                var inner = Dom.get('#test-inner', iframe.contentWindow.document);
                Dom.scrollIntoView(inner, iframe.contentWindow);
                var nt = Math.round(Dom.offset(inner).top);
                expect(nt - Dom.scrollTop(iframe.contentWindow)).to.be.within(-5, 5);
                setTimeout(function () {
                    ok = 1;
                    done();
                }, 100);
            });
        });

        it("scroll node to container at bottom", function () {
            Dom.scrollIntoView(node, container, {
                alignWithTop: false
            });
            var nt = Math.round(Dom.offset(node).top);
            var ct = Math.round(Dom.offset(container).top);

            // 注意容器边框
            //  --------
            //  |      |
            //  | ---- |
            //  | |  | |
            //  | ---- |
            //  --------
            expect(ct +
                containerBorderWidth +
                containerClientHeight -
                nodeHeight - nt).to.be.within(-5, 5);
        });

        if (UA.ios && window.frameElement) {

        } else {
            it("scroll node into top view of window", function () {
                Dom.scrollIntoView(container);
                var ct = Math.round(Dom.offset(container).top);
                expect(ct - Dom.scrollTop()).to.be.within(-5, 5);
            });
        }
    });

    describe('auto works', function () {
        it('will not scroll if node is inside container', function () {
            Dom.scrollIntoView(node, container);

            Dom.scrollTop(container, Dom.scrollTop(container) - 10);

            var scrollTop = Dom.scrollTop(container);

            Dom.scrollIntoView(node, container, {
                onlyScrollIfNeeded: true
            });

            expect(Dom.scrollTop(container)).to.be(scrollTop);
        });

        it('will scroll and adjust top to true if node is outside container', function () {
            Dom.scrollIntoView(node, container);

            var scrollTop = Dom.scrollTop(container);

            Dom.scrollTop(container, Dom.scrollTop(container) + 10);

            Dom.scrollIntoView(node, container, {
                onlyScrollIfNeeded: true
            });

            expect(Dom.scrollTop(container)).to.be(scrollTop);
        });

        it('will scroll and adjust top to false if node is outside container', function () {
            Dom.scrollIntoView(node, container, {
                alignWithTop: false
            });

            var scrollTop = Dom.scrollTop(container);

            Dom.scrollTop(container, Dom.scrollTop(container) - 10);

            Dom.scrollIntoView(node, container, {
                onlyScrollIfNeeded: true
            });

            expect(Dom.scrollTop(container)).to.be(scrollTop);
        });


        it('will scroll and adjust top to true if node is outside container', function () {
            Dom.scrollIntoView(node, container, {
                alignWithTop: true
            });

            var scrollTop = Dom.scrollTop(container);

            Dom.scrollIntoView(node, container, {
                alignWithTop: false
            });

            Dom.scrollTop(container, Dom.scrollTop(container) - 10);

            Dom.scrollIntoView(node, container, {
                alignWithTop: true,
                onlyScrollIfNeeded: true
            });

            expect(Dom.scrollTop(container)).to.be(scrollTop);
        });

        it('will scroll to top false if node is outside container', function () {
            Dom.scrollIntoView(node, container, {
                alignWithTop: false
            });

            var scrollTop = Dom.scrollTop(container);

            Dom.scrollIntoView(node, container, {
                alignWithTop: true
            });

            Dom.scrollTop(container, Dom.scrollTop(container) + 10);

            Dom.scrollIntoView(node, container, {
                alignWithTop: false,
                onlyScrollIfNeeded: true
            });

            expect(Dom.scrollTop(container)).to.be(scrollTop);
        });
    });
});