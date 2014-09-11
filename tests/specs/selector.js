/**
 * simple selector test
 * @author yiminghe@gmail.com
 */

var tpl = '';
var $ = window.jQuery;
var jQuery = window.jQuery;
var Dom = require('dom');
var util = require('util');
window.$.ajax({
    url: './specs/selector.html',
    async: false,
    success: function (d) {
        tpl = d;
    }
});

describe('selector', function () {
    beforeEach(function () {
        $('body').append(tpl);
    });

    afterEach(function () {
        $('#test-selector').remove();
    });

    if (document.getElementsByClassName) {
        it('return array type', function () {
            expect(util.isArray(Dom.query('.test-selector'))).to.be(true);
            expect(Dom.query('.test-selector').length).to.be(document.getElementsByClassName('test-selector').length);
        });
    }

    it('throws exception when encounter #.', function () {
        expect(function () {
            Dom.query('#');
        }).throwError();
        expect(function () {
            Dom.query('.');
        }).throwError();
    });

    it('works for fragment', function () {
        var node = Dom.create('<div><i id="i"></i></div><div><b id="b"></b></div>');
        expect(Dom.query('#i', node).length).to.be(1);
        expect(Dom.query('i', node).length).to.be(1);
    });

    it('works for detached node', function () {
        var node = Dom.create('<div><i id="i"></i></div>');
        expect(Dom.query('#i', node).length).to.be(1);
        expect(Dom.query('i', node).length).to.be(1);
    });

    it('should return empty when context is null', function () {
        expect(Dom.query('#test-selector', null).length).to.be(0);
    });

    it('test support disconnect node', function () {
        var div = $('<div id="t"><span id="t2"></span></div>')[0].firstChild;
        expect(Dom.test(div, '#t span')).to.be(true);
    });

    it('support #id', function () {
        expect(Dom.get('#test-selector').id).to.be('test-selector');

        expect(Dom.query('#test-selector').length).to.be(1);

        expect(Dom.get('#test-selector-xx')).to.be(null);

        expect(Dom.query('#test-selector-xx').length).to.be(0);
    });

    it('support tag ignore case', function () {
        expect(Dom.get('#test-selector-1 s').id).to.be('test-selector-tag');
        expect(Dom.query('#test-selector-1 s').length).to.be(1);

        expect(Dom.query('#test-selector-1 S').length).to.be(1);

        expect(Dom.get('sub')).to.be(null);
        expect(Dom.query('sub').length).to.be(0);
    });

    it('support .cls', function () {
        expect(Dom.get('.test-selector').id).to.be('test-selector-1');
        expect(Dom.query('.test-selector').length).to.be(4);
    });

    it('support #id tag', function () {
        expect(Dom.get('#test-selector s').id).to.be('test-selector-tag');
        expect(Dom.get('#test-selector-2 s').id).to.be('');

        expect(Dom.query('#test-selector s').length).to.be(2);
        expect(Dom.query('#test-selector S').length).to.be(2);
        expect(Dom.query('#test-selector-2 s').length).to.be(1);
    });

    it('support comma', function () {
        expect(Dom.query('#test-selector-1 .test-selector ,' +
            ' #test-selector-2 .test-selector').length)
            .to.be(2);
    });

    it('support #id .cls', function () {
        expect(Dom.get('#test-selector-1 .test-selector').tagName.toLowerCase()).to.be('div');
        expect(Dom.get('#test-selector-2 .test-selector').tagName.toLowerCase()).to.be('p');
        expect(Dom.query('#test-selector-1 .test-selector').length).to.be(1);
        expect(Dom.query('#test-selector .test-selector').length).to.be(4);
    });

    it('support tag.cls', function () {
        expect(Dom.get('div.test-selector').id).to.be('test-selector-1');
        expect(Dom.query('div.test-selector').length).to.be(3);
        expect(Dom.query('DIV.test-selector').length).to.be(3);
        expect(Dom.get('p.test-selector').tagName.toLowerCase()).to.be('p');
        expect(Dom.query('p.test-selector').length).to.be(1);
    });

    it('support #id tag.cls', function () {
        expect(Dom.get('#test-selector-1 p.test-selector')).to.be(null);
        expect(Dom.get('#test-selector-2 p.test-selector').tagName.toLowerCase()).to.be('p');
    });

    it('does not confuse name with id', function () {
        var id = 'id' + (+new Date());
        var input = Dom.create('<input name="' + id + '"/>');
        var div = Dom.create('<div id="' + id + '"></div>');
        Dom.append(input, document.body);
        Dom.append(div, document.body);
        expect(Dom.get('#' + id).nodeName.toLowerCase()).to.be('div');
        Dom.remove([input, div]);
    });
});

describe('selector context', function () {
    var html = Dom.create(
            '<div><div id="context-test-1" class="context-test">' +
            '<div>' +
            '<div class="context-test-3" id="context-test-2"></div>' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<div class="context-test-3" id="context-test-4"></div>' +
            '</div>' +
            '<div class="context-test">' +
            '<div class="context-test">' +
            '<div>' +
            '<div class="context-test-3" id="context-test-5"></div>' +
            '</div>' +
            '</div>' +
            '</div></div>');

    Dom.prepend(html, document.body);

    it('should attach each properly', function () {
        var c3 = Dom.query('.context-test-3');
        expect(c3.length).to.be(3);
        var a = [];
        // each 绑定正常
        c3.each(function (v, i) {
            a[i] = v;
        });
        expect(a.length).to.be(3);
        expect(Dom.equals(a, c3));
    });

    it('should support #id', function () {
        expect(Dom.query('.context-test-3', '#context-test-1').length).to.be(1);

        expect($('.context-test-3', '#context-test-1').length).to.be(1);

        expect(Dom.query('.context-test-3').length).to.be(3);

        expect($('.context-test-3').length).to.be(3);

        expect(Dom.get('.context-test-3', '#context-test-1').id).to.be('context-test-2');

        expect($('.context-test-3', '#context-test-1').attr('id')).to.be('context-test-2');
    });

    it('should support other string form selector and unique works', function () {
        expect(Dom.query('.context-test-3', '.context-test').length).to.be(2);
    });

    it('should support node array form selector and unique works', function () {
        var r;
        var c3 = Dom.query('.context-test-3');
        expect(r = c3.length).to.be(3);

        var c3j = $('.context-test-3');
        expect(r = c3j.length).to.be(3);

        var c = Dom.query('.context-test');
        expect(r = c.length).to.be(3);

        var cj = jQuery('.context-test');
        expect(r = cj.length).to.be(3);

        expect(r = Dom.query(c3).length).to.be(3);
        expect(r = Dom.query('.context-test-3', c).length).to.be(2);
        expect(r = Dom.query(c3).length).to.be(3);
        expect(r = Dom.query('.context-test-3', '.context-test').length).to.be(2);

        /*jquery contrast test*/
        var t = jQuery(c3j, '.context-test');
        // 上下文不对第一个参数是节点集合时生效
        expect(t.length).to.be(3);
        expect(r = jQuery('.context-test-3', cj).length).to.be(2);
        // 上下文不对第一个参数是节点集合时生效
        expect(r = jQuery(c3j, cj).length).to.be(3);
        expect(r = jQuery('.context-test-3', '.context-test').length).to.be(2);

        expect(r = cj.find('.context-test-3').length).to.be(2);
        expect(r = cj.find(c3j).length).to.be(2);
    });

    it('support other format as first parameter', function () {
        // 普通对象
        var o = {length: 1};
        expect(Dom.query(o)[0]).to.be(o);

        // KISSY NodeList
        o = {
            getDOMNodes: function () {
                return o;
            }
        };
        expect(Dom.query(o)).to.be(o);

        // 数组
        o = [1];
        expect(Dom.query(o)).to.be(o);

        // NodeList
        o = document.getElementsByTagName('div');
        var ret = Dom.query(o);
        expect(ret.length).to.be(o.length);
        expect(ret[0]).to.be(o[0]);
        expect(util.isArray(ret)).to.be(true);
    });

    it('id selector should constrain to context', function () {
        Dom.append(Dom.create('<div id="tt"></div><div id="tt2"></div>'),
            'body');

        expect(Dom.query('#tt', Dom.get('#tt2')).length).to.be(0);

        expect($('#tt', '#tt2').length).to.be(0);

        Dom.remove('#tt,#tt2');

        expect(Dom.get('#tt')).to.be(null);
        expect(Dom.get('#tt2')).to.be(null);
    });

    it('should get child element by id selector ' +
        'even node is not in the document', function () {
        var t = Dom.create('<div id="tt"><div id="tt2"></div></div>');
        expect(Dom.query('#tt2', t).length).to.be(1);
        expect($('#tt2', t).length).to.be(1);
    });

    it('optimize for long simple selector', function () {
        var div = Dom.create('<div id="long-simple-selector">' +
            '<div class="t">' +
            '<div class="t2">' +
            '<span>' +
            '<b class="j" data-id="target"></b>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '<div class="j"></div>' +
            '</div>');

        document.body.appendChild(div);

        var ret = Dom.query('#long-simple-selector .t .t2 span .j');

        expect(ret.length).to.be(1);
        expect(ret[0].getAttribute('data-id')).to.be('target');

        Dom.remove(div);
    });
});