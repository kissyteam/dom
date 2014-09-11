/**
 * test cases for insertion sub module of dom module
 * @author yiminghe@gmail.com
 */

var Dom = require('dom');
describe('insertion', function () {
    var body = document.body;
    it('insertBefore should works', function () {
        var foo = body.appendChild(Dom.create('div'));
        var t = Dom.create('<p>insertBefore node</p>');
        Dom.insertBefore(t, foo);
        expect(foo.previousSibling).to.be(t);
        Dom.remove([foo, t]);
    });

    it('insertAfter should works', function () {
        var foo = body.appendChild(Dom.create('<div></div>'));
        var t = Dom.create('<p>insertAfter node</p>');
        Dom.insertAfter(t, foo);
        expect(foo.nextSibling).to.be(t);
        Dom.remove([foo, t]);
    });

    it('append should works', function () {
        var foo = body.appendChild(Dom.create('<div><div></div></div>'));
        var t = Dom.create('<p>append node</p>');
        Dom.append(t, foo);
        expect(foo.lastChild).to.be(t);
        Dom.remove([foo, t]);
    });

    // https://github.com/kissyteam/kissy/issues/422
    it('append does not change value for select', function () {
        var select = body.appendChild(Dom.create('<select>' +
            '<option>1</option>' +
            '<option>2</option>' +
            '</select>'));
        expect(select.selectedIndex).to.be(0);
        select.appendChild(Dom.create('<option>3</option>'));
        expect(select.selectedIndex).to.be(0);
        Dom.remove(select);
    });

    it('prepend should works', function () {
        var foo = body.appendChild(Dom.create('<div><div></div></div>'));
        var t = Dom.create('<p>prepend node</p>');
        Dom.prepend(t, foo);
        expect(foo.firstChild).to.be(t);
        Dom.remove([foo, t]);
    });

    it('consider checkbox/radio in ie6/7', function () {
        var radio = Dom.create('<input />');
        Dom.attr(radio, 'type', 'radio');
        Dom.attr(radio, 'checked', true);
        Dom.append(radio, document.body);
        expect(Dom.attr(radio, 'checked')).to.be('checked');
        Dom.remove(radio);
    });

    it('wrapAll should works', function () {
        var time = (+new Date());
        var wrappedCls = 'f' + time;
        var wrapperCls = 'x' + time;
        var foo = body.appendChild(Dom.create('<div class="' + wrappedCls + '"></div>'));
        var foo2 = body.appendChild(Dom.create('<div class="' + wrappedCls + '"></div>'));
        Dom.wrapAll('.' + wrappedCls,
            Dom.create('<div class="' + wrapperCls + '">' +
                '<div class="x' + wrapperCls + '"></div>' +
                '</div>'));
        expect(foo.nextSibling).to.be(foo2);
        expect(foo.parentNode.childNodes.length).to.be(2);
        expect(foo.parentNode.className).to.be('x' + wrapperCls);
        expect(foo.parentNode.parentNode.className).to.be(wrapperCls);
        Dom.remove([foo, foo2]);
        Dom.remove('.' + wrapperCls);
    });

    it('wrap should works', function () {
        var time = (+new Date());
        var wrappedCls = 'f' + time;
        var wrapperCls = 'x' + time;
        var foo = body.appendChild(Dom.create('<div class="' + wrappedCls + '"></div>'));
        var foo2 = body.appendChild(Dom.create('<div class="' + wrappedCls + '"></div>'));
        Dom.wrap('.' + wrappedCls,
            Dom.create('<div class="' + wrapperCls + '">' +
                '<div class="x' + wrapperCls + '"></div>' +
                '</div>'));
        expect(foo.nextSibling).to.be(null);
        expect(foo.parentNode.childNodes.length).to.be(1);
        expect(foo.parentNode.className).to.be('x' + wrapperCls);
        expect(foo.parentNode.parentNode.className).to.be(wrapperCls);

        expect(foo2.nextSibling).to.be(null);
        expect(foo2.parentNode.childNodes.length).to.be(1);
        expect(foo2.parentNode.className).to.be('x' + wrapperCls);
        expect(foo.parentNode.parentNode.className).to.be(wrapperCls);

        expect(foo.parentNode.parentNode.nextSibling).to.be(foo2.parentNode.parentNode);
        Dom.remove([foo, foo2]);
        Dom.remove('.' + wrapperCls);
    });

    it('wrapInner should works', function () {
        var time = (+new Date());
        var wrappedCls = 'f' + time;
        var wrapperCls = 'x' + time;
        var childCls = 'c' + time;
        var foo = body.appendChild(Dom.create('<div class="' + wrappedCls + '">' +
            '<div class="' + childCls + '"></div>' +
            '<div class="c' + childCls + '"></div>' +
            '</div>'));
        Dom.wrapInner('.' + wrappedCls,
            Dom.create('<div class="' + wrapperCls + '">' +
                '<div class="x' + wrapperCls + '"></div>' +
                '</div>'));
        expect(foo.childNodes.length).to.be(1);
        expect(foo.firstChild.className).to.be(wrapperCls);
        expect(foo.firstChild.firstChild.childNodes.length).to.be(2);
        expect(foo.firstChild.firstChild.firstChild.className).to.be(childCls);
        expect(foo.firstChild.firstChild.lastChild.className).to.be('c' + childCls);
        Dom.remove(foo);
        Dom.remove('.' + wrapperCls);
    });

    it('unwrap works', function () {
        var time = (+new Date());
        var wrappedCls = 'f' + time;
        var foo = body.appendChild(Dom.create('<div class="' + wrappedCls + '">' +
            '<div class="x' + wrappedCls + '"></div>' +
            '</div>'));
        var fc = foo.firstChild;
        Dom.unwrap(fc);
        expect(fc.parentNode).to.be(document.body);
        //!!! ie<9 : foo.parentNode == fragment && Dom.contains(document,foo)==true
        expect(foo.parentNode).not.to.be(document.body);
        Dom.remove(fc);
        Dom.remove(foo);
    });
});
