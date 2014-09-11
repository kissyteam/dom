/**
 * test cases for class sub module of dom module
 * @author yiminghe@gmail.com
 */

var Dom = require('dom');
describe('class', function () {
    var tpl = '';

    window.$.ajax({
        url: './specs/class.html',
        async: false,
        success: function (d) {
            tpl = d;
        }
    });

    beforeEach(function () {
        window.$('body').append(tpl);
        foo = Dom.get('#foo-class');
        a = Dom.get('#foo-class a');
        input = Dom.get('#foo-class input');
        radio = Dom.get('#test-radio-class');
        radio2 = Dom.get('#test-radio2-class');
        button = Dom.get('#foo-class button');
        label = Dom.get('#foo-class label');
        table = Dom.get('#test-table');
        td = Dom.get('#test-table td');
        select = Dom.get('#test-select');
        select2 = Dom.get('#test-select2');
        select3 = Dom.get('#test-select3');
        opt = Dom.get('#test-opt');
        div = Dom.get('#test-div');
        opt2 = Dom.query('#test-select option')[1];
        area = Dom.get('#foo textarea');
    });

    afterEach(function () {
        window.$('#test-data-class').remove();
    });

    var foo ,
        a ,
        input ,
        radio,
        radio2 ,
        button,
        label ,
        table ,
        td ,
        select ,
        select2,
        select3,
        opt,
        div,
        opt2,
        area;

    it('hasClass works', function () {
        a.className = 'link link2\t' + 'link9 link3';
        expect(Dom.hasClass(a, 'link')).to.be(true);
        expect(Dom.hasClass(a, '.link')).to.be(true);
        expect(Dom.hasClass(a, 'link4')).to.be(false);
        expect(Dom.hasClass(a, 'link link3')).to.be(true);
        expect(Dom.hasClass(a, '.link .link3')).to.be(true);
        expect(Dom.hasClass(a, 'link link4')).to.be(false);
        expect(Dom.hasClass(a, '.link .link4')).to.be(false);
        expect(Dom.hasClass(a, 'link9')).to.be(true);

        var test = '<div><a></a><a class="a"></a></div>';
        var n;
        Dom.append(n = Dom.create(test), document.body);
        expect(Dom.hasClass(Dom.query('a', n), '.a')).to.be.ok();
        Dom.remove(n);

        test = '<div><a></a><a></a></div>';
        Dom.append(n = Dom.create(test), document.body);
        expect(Dom.hasClass(Dom.query('a', n), '.a')).to.not.be.ok();
        Dom.remove(n);
    });

    it('addClass works', function () {
        Dom.addClass(a, 'link-added');
        expect(Dom.hasClass(a, 'link-added')).to.be(true);
        Dom.addClass(a, '.cls-a cls-b');
        expect(Dom.hasClass(a, 'cls-a')).to.be(true);
        expect(Dom.hasClass(a, 'cls-b')).to.be(true);
    });

    it('removeClass works', function () {
        a.className = 'link link2 link3 link4 link5';
        Dom.removeClass(a, 'link');
        expect(Dom.hasClass(a, 'link')).to.be(false);
        Dom.removeClass(a, 'link2 link4');
        Dom.removeClass(a, '.link3');
        expect(a.className).to.be('link5');
    });

    it('replaceClass works', function () {
        a.className = 'link link3';
        // oldCls 有的话替换
        Dom.replaceClass(a, '.link', 'link2');
        expect(Dom.hasClass(a, 'link')).to.be(false);
        expect(Dom.hasClass(a, 'link2')).to.be(true);
        // oldCls 没有的话，仅添加
        Dom.replaceClass(a, 'link4', 'link');
        expect(a.className).to.be('link3 link2 link');
    });

    it('toggleClass works', function () {
        a.className = 'link link2';
        Dom.toggleClass(a, 'link2');
        expect(Dom.hasClass(a, 'link2')).to.be(false);
        //Dom.toggleClass(a, '.link2',false);
        //expect(Dom.hasClass(a, 'link2')).to.be(false);
        Dom.toggleClass(a, '.link2');
        expect(Dom.hasClass(a, 'link2')).to.be(true);
        // Dom.toggleClass(a, '.link2',true);
        // expect(Dom.hasClass(a, 'link2')).to.be(true);
    });
});