/**
 * test cases for traversal sub module of dom module
 * @author yiminghe@gmail.com
 */

var tpl = '';
var Dom = require('dom');
var $ = window.$;

$.ajax({
    url: './specs/traversal.html',
    async: false,
    success: function (d) {
        tpl = d;
    }
});

describe('traversal', function () {
    beforeEach(function () {
        $('body').append(tpl);
    });

    afterEach(function () {
        $('#test-children').remove();
    });

    it('parent works', function () {
        var t = Dom.get('#test-parent4');
        expect(Dom.parent(t).tagName.toLowerCase()).to.be('span');
        expect(Dom.parent(t, 4).className).to.be('test-parent');
        expect(Dom.parent(t, 'em').className).to.be('test-em');
        expect(Dom.parent(t, 'EM')).not.to.be(null);
        expect(Dom.parent(t, '.test-p').tagName.toLowerCase()).to.be('p');
        // Unsupported selector: p.test-p em
        expect(Dom.parent(t, 'p.test-p em').className).to.be('test-em');
        expect(Dom.parent(t,
            function (elem) {
                return elem.tagName.toLowerCase() === 'p';
            }).className).to.be('test-p');

        expect(Dom.parent(document.body)).to.be(document.documentElement);

        expect(Dom.parent(t, 0)).to.be(t);

        expect(Dom.parent()).to.be(null);

        expect(Dom.parent('#test-nested', 'p')).to.be(null);
        expect(Dom.parent('#test-nested', ['p']) + '').to.be([] + '');
        // support array of filter
        expect(Dom.parent('#test-nested', ['div']).length).to.be(2);
        expect(Dom.parent('#test-nested', ['DIV']).length).to.be(2);
        expect(Dom.parent('#test-parent4', '.text-next')).to.be(null);
    });


    it('closest works', function () {
        var t = Dom.get('#test-parent4');

        // return itself
        expect(Dom.closest(t, 'a')).to.be(t);

        // support array of filter
        expect(Dom.closest('#test-nested', ['div']).length).to.be(3);

        // parent works
        expect(Dom.closest(t, '.test-p')).to.be(Dom.get('#test-prev'));

        // context works
        expect(Dom.closest(t, '.test-parent', '#test-prev')).to.be(null);

        expect(Dom.closest(t, '.test-parent')).to.be(Dom.get('#test-children'));

        expect(Dom.closest(t, '.test-parent', '#test-children')).to.be(null);
    });

    it('closest works for text node', function () {
        var div = Dom.create('<div>1</div>');
        Dom.append(div, 'body');
        var text = div.firstChild;

        var d = Dom.closest(text, undefined, undefined, true);

        expect(d).to.be(text);

        d = Dom.closest(text, undefined, undefined);

        expect(d).to.be(div);

        Dom.remove(div);
    });

    it('first works for text node', function () {
        var div = Dom.create('<div>1<span></span></div>');
        Dom.append(div, 'body');
        var cs = div.childNodes;

        expect(Dom.first(div)).to.be(cs[1]);
        expect(Dom.first(div, undefined, 1)).to.be(cs[0]);

        Dom.remove(div);
    });

    it('last works for text node', function () {
        var div = Dom.create('<div>1<span></span>1</div>');
        Dom.append(div, 'body');
        var cs = div.childNodes;

        expect(Dom.last(div)).to.be(cs[1]);
        expect(Dom.last(div, undefined, 1)).to.be(cs[2]);

        Dom.remove(div);
    });

    it('next works for text node', function () {
        var div = Dom.create('<div><span></span>1<span></span></div>');
        Dom.append(div, 'body');
        var cs = div.childNodes;
        expect(Dom.next(cs[0])).to.be(cs[2]);
        expect(Dom.next(cs[0], undefined, 1)).to.be(cs[1]);
        Dom.remove(div);
    });

    it('prev works for text node', function () {
        var div = Dom.create('<div><span></span>1<span></span></div>');
        Dom.append(div, 'body');
        var cs = div.childNodes;
        expect(Dom.prev(cs[2])).to.be(cs[0]);
        expect(Dom.prev(cs[2], undefined, 1)).to.be(cs[1]);
        Dom.remove(div);
    });

    it('siblings works for text node', function () {
        var div = Dom.create('<div><span></span>1<span></span></div>');
        Dom.append(div, 'body');
        var cs = div.childNodes;
        expect(Dom.siblings(cs[2]).length).to.be(1);
        expect(Dom.siblings(cs[2], undefined, 1).length).to.be(2);
        Dom.remove(div);
    });

    it('next works', function () {
        var t = Dom.get('#test-next');

        expect(Dom.next(t).className).to.be('test-next-p');

        expect(Dom.next(t, 0)).to.be(t);

        expect(Dom.next(t, 1).className).to.be('test-next-p');
        expect(Dom.next(t, 2).className).to.be('test-next');

        expect(Dom.next(t, '.test-next').tagName.toLowerCase()).to.be('p');
        expect(Dom.next(t, '.test-none')).to.be(null);

        expect(Dom.next(t,
            function (elem) {
                return elem.className === 'test-p';
            }).tagName.toLowerCase()).to.be('p');
    });

    it('prev works', function () {
        var t = Dom.get('#test-prev');

        expect(Dom.prev(t).className).to.be('test-next');

        expect(Dom.prev(t, 0)).to.be(t);
        expect(Dom.prev(t, 1).className).to.be('test-next');
        expect(Dom.prev(t, 2).className).to.be('test-next-p');

        expect(Dom.prev(t, '.test-none')).to.be(null);

        expect(Dom.prev(t,
            function (elem) {
                return elem.className === 'test-next-p';
            }).tagName.toLowerCase()).to.be('p');
    });


    it('siblings works', function () {
        var t = Dom.get('#test-prev');
        // not include itself
        expect(Dom.siblings(t).length).to.be(5);

        expect(Dom.siblings(t, '.test-none').length).to.be(0);

        expect(Dom.siblings(t,
            function (elem) {
                return elem.className === 'test-next-p';
            }).length).to.be(1);
    });

    it('children works', function () {
        var t = Dom.get('#test-children');

        expect(Dom.children(t).length).to.be(6);
        //expect(Dom.children(t, '.test-next,.test-next-p').length).to.be(2);
        //expect(Dom.children(t, 'p:first')[0].id).to.be('test-next');
        expect(Dom.children('#test-div').length).to.be(0);
    });

    it('contents works', function () {
        var div = Dom.create('<div>1<span>2</span></div>');
        Dom.append(div, 'body');
        expect(Dom.contents(div).length).to.be(2);
        Dom.remove(div);
    });


    it('contains works', function () {
        expect(Dom.contains(document, '#test-prev')).to.be(true);
        expect(Dom.contains(document.documentElement, document.body)).to.be(true);
        expect(Dom.contains(document, document.body)).to.be(true);
        expect(Dom.contains(document.body, document.documentElement)).to.be(false);

        // test text node
        var tn = Dom.get('#test-contains').firstChild;

        expect(tn.nodeType).to.be(3);

        expect(Dom.contains('#test-contains', tn)).to.be(true);

        expect(Dom.contains(document.body, document.body)).to.be(false);

        expect(Dom.contains(document, document)).to.be(false);

        expect(Dom.contains(document.body, document)).to.be(false);
    });

    // https://github.com/kissyteam/kissy/issues/183
    it('contains works for non-document node', function () {
        var newNode = Dom.create('<div><div></div></div>');

        expect(Dom.contains(document, newNode)).to.be(false);
        expect(Dom.contains(document.body, newNode)).to.be(false);

        expect(Dom.contains(document, newNode.firstChild)).to.be(false);
        expect(Dom.contains(document.body, newNode.firstChild)).to.be(false);
    });


    it('index works', function () {
        var div = Dom.create('<ul class="index-ul">' +
            '<li class="index-li">0</li>' +
            '<li class="index-li">1</li>' +
            '<li class="index-li">2</li>' +
            '</ul>');

        Dom.append(div, 'body');

        // 单个节点
        expect(Dom.index('.index-li', Dom.query('.index-li')[1])).to.be(1);

        // 取第一个节点
        expect(Dom.index('.index-li', Dom.query('.index-li'))).to.be(0);

        // 第一个节点在 parent 中找
        expect(Dom.index('.index-li')).to.be(0);

        expect(Dom.index(Dom.query('.index-li')[1])).to.be(1);

        // selector 集合中找当前第一个节点
        expect(Dom.index(Dom.query('.index-li')[1], '.index-li')).to.be(1);

        expect(Dom.index(Dom.get('body'), '.index-li')).to.be(-1);

        Dom.remove(div);
    });
});