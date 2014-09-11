/**
 * test cases for create sub module of dom module
 * @author yiminghe@gmail.com
 */

var Dom = require('dom');
var util = require('util');
describe('create', function () {
    it('create should works', function () {
        var div = Dom.create('<div>'),
            html = '',
            tag;

        util.each([
            'option', 'optgroup', 'td', 'th', 'tr',
            'tbody', 'thead', 'tfoot',
            'caption', 'col', 'colgroup', 'legend'
        ], function (tag) {
            html = '<' + tag + '></' + tag + '>';

            //div.innerHTML = html;
            div.appendChild(Dom.create(html));

            html = div.innerHTML.toLowerCase();
            expect((html.indexOf('<' + tag + '>') === 0 ||
                html.indexOf('<' + tag + ' ') === 0)).to.be(true);
            div.innerHTML = '';
        });

        // script
        html = tag = 'script';
        div.appendChild(Dom.create('<script><\/script>'));
        html = util.trim(div.innerHTML.toLowerCase());
        expect((html.indexOf('<' + tag + '>') === 0 || html.indexOf('<' + tag + ' ') === 0)).to.be(true);
        div.innerHTML = '';

        // null
        expect(Dom.create()).to.be(null);

        // textNode
        expect(Dom.create('text node').nodeType).to.be(3);

        // 稍微复杂点
        expect(Dom.attr(Dom.create('<img id="test-img" />'), 'id')).to.be('test-img');

        // 多个元素 , fragment
        expect(Dom.create('<p></p><div></div>').nodeType).to.be(11);

        expect(Dom.create('<p></p><div></div>').childNodes[0].tagName.toLowerCase()).to.be('p');

        // 属性支持
        expect(Dom.create('<p>', { rel: '-1', 'class': 'test-p', data: 'test'}).className).to.be('test-p');

        expect(Dom.create('<a hideFocus=\'true\'  ' +
            'tabIndex=\'0\'  ' +
            'class=\'ke-triplebutton ke-triplebutton-off\' />')
            .className).to.be('ke-triplebutton ke-triplebutton-off');
    });

    it('create option works', function () {
        var s = Dom.create('<select>');
        s.appendChild(Dom.create('<option>1</option>'));
        expect(s.innerHTML.toLowerCase().indexOf('option')).to.beGreaterThan(-1);
    });

    it('html option works', function () {
        var s = Dom.create('<select>');
        Dom.html(s, '<option>1</option><option>2</option>');
        expect(Dom.children(s).length).to.be(2);
    });

    it('create should works for style with content in ie<8', function () {
        var style, d;
        expect((style = Dom.create('<style>.styleie67 {width:99px;}</style>'))
            .nodeName.toLowerCase()).to.be('style');
        Dom.append(d = Dom.create('<div class="styleie67"></div>'), document.body);
        Dom.append(style, document.getElementsByTagName('head')[0]);
        expect(Dom.css(d, 'width')).to.be('99px');
    });

    it('html should works', function (done) {
        var t = Dom.create('<div></div>');
        document.body.appendChild(t);
        Dom.html(t, '<div>');
        expect(t.firstChild.nodeName.toLowerCase()).to.be('div');

        Dom.html(t, '<p class="test-html">test p</p>');
        expect(Dom.hasClass(t.firstChild, 'test-html')).to.be(true);

        expect(Dom.text(t)).to.be('test p');

        var testTable = Dom.create('<table></table>');

        Dom.html(t, '');

        expect(function () {
            Dom.html(testTable, '2');
        }).not.throwError();


        // loadScripts
        Dom.html(t, '<script>window.gSetHtml = 1;<\/script>we', true);

        Dom.html(t, '<script>window.gSetHtml2 = 1;<\/script>we');

        expect(window.gSetHtml2).to.be(undefined);
        // src js
        Dom.html(t, '<script src="../others/create/test-dom-create.js"><\/script>we', true);

        function check() {
            setTimeout(function check() {
                if (window.gTestLoadScriptViaInnerHTML) {
                    Dom.remove(t);
                    done();
                } else {
                    check();
                }
            }, 100);
        }

        check();
    });

    it('html works for multiple elements', function () {
        document.body.appendChild(Dom.create('<div class="multiple-html"></div>' +
            '<div class="multiple-html"></div>'));

        var multiple = Dom.query('.multiple-html');

        Dom.html(multiple, '<span>1</span>');


        for (var i = 0; i < multiple.length; i++) {
            expect(multiple[i].innerHTML.toLowerCase()).to.be('<span>1</span>');
        }

        Dom.html(multiple, '<span>2</span><script></script>');

        for (i = 0; i < multiple.length; i++) {
            expect(multiple[i].innerHTML.toLowerCase()).to.be('<span>2</span>');
        }

        Dom.remove(multiple);
    });

    it('html works for fragment', function () {
        var html = '<div></div><span></span>';
        var n = Dom.create(html);
        expect(Dom.html(n).toLowerCase()).to.be(html);
    });

    it('remove should works', function () {
        var n;
        document.body.appendChild(n = Dom.create('<div class="test-remove">' +
            '<div class="test-remove-inner">test-remove-inner</div>' +
            '</div>'));
        expect(Dom.query('.test-remove').length).to.be(1);
        Dom.remove(n);
        expect(Dom.query('.test-remove').length).to.be(0);
        expect(Dom.query('.test-remove-inner').length).to.be(0);
    });

    it('empty should works', function () {
        var n;
        document.body.appendChild(n = Dom.create('<div class="test-empty"><div></div>x</div>'));
        expect(n.childNodes.length).to.be(2);
        var c = n.firstChild;
        Dom.data(c, 'x', 'y');
        expect(Dom.data(c, 'x')).to.be('y');
        Dom.empty(n);
        expect(n.childNodes.length).to.be(0);
        expect(Dom.data(c, 'x')).to.be(undefined);
    });

    it('fix leadingWhiteSpaces in ie<9', function () {
        var n = Dom.create(' <div></div>');
        expect(n.nodeName.toLowerCase()).to.be('div');
        Dom.html(n, ' <span></span>');
        expect(n.firstChild.nodeType).to.be(Dom.NodeType.TEXT_NODE);
        Dom.remove(n);
    });

    it('remove spurious tbody', function () {
        var str = '<table><thead><tr><th>1</th></tr></thead></table>';
        expect(Dom.create(str).innerHTML.toLowerCase().replace(/\s/g, '')).to.be('<thead><tr><th>1</th></tr></thead>');
        var str2 = '<thead><tr><th>1</th></tr></thead>';
        expect(Dom.create(str2).innerHTML.toLowerCase().replace(/\s/g, '')).to.be('<tr><th>1</th></tr>');
    });

    it('outerHtml works', function () {
        var div = Dom.create('<div></div>');
        var div2 = Dom.create('<div></div>');
        var span = Dom.create('<span></span>');
        var span2 = Dom.create('<span></span>');
        Dom.append(span, div);
        Dom.append(span2, div2);
        Dom.append(div, 'body');
        Dom.append(div2, 'body');

        Dom.outerHtml(span, '5<span>3</span>');
        expect(Dom.html(div).toLowerCase()).to.be('5<span>3</span>');

        Dom.html(div, '<span></span>');

        span = Dom.get('span', div);
        Dom.outerHtml([span, span2], '5<span>4</span><script>window.outerHTMLTest=1;</script>');
        expect(Dom.html(div).toLowerCase()).to.be('5<span>4</span>');
        expect(Dom.html(div2).toLowerCase()).to.be('5<span>4</span>');
        expect(window.outerHTMLTest).to.be(undefined);

        Dom.html(div, '<span></span>');

        span = Dom.get('span', div);
        Dom.outerHtml(span, '6<span>5</span><script>window.outerHTMLTest=1;</script>', true);
        expect(Dom.html(div).toLowerCase()).to.be('6<span>5</span>');
        expect(window.outerHTMLTest).to.be(1);

        Dom.remove(div);
        Dom.remove(div2);
    });

    it('outerHtml works for fragment', function () {
        var html = '<div></div><span></span>';
        var n = Dom.create(html);
        expect(Dom.outerHtml(n).toLowerCase()).to.be(html);
    });
});