/**
 * test cases for data sub module of dom module
 * @author yiminghe@gmail.com
 */

var Dom = require('dom');
var util = require('util');
var UA = require('ua');
var __EXPANDO = Dom.__EXPANDO;
describe('Dom.data', function () {
    it('data should works', function () {
        var foo = document.body.appendChild(Dom.create('<div>'));
        Dom.data(foo, 'data-1', 'val-1');
        expect(Dom.data(foo, 'data-1')).to.be('val-1');

        Dom.data(foo, 'data-1', 'val-2');
        expect(Dom.data(foo, 'data-1')).to.be('val-2');

        Dom.data(document, 'data', 'val');
        expect(Dom.data(document, 'data')).to.be('val');

        Dom.data(window, 'data', 'val');
        expect(Dom.data(window, 'data')).to.be('val');

        expect(window.data).to.be(undefined); // 不污染全局
        var topOK = true;
        try {
            Dom.data(top, 'data', 'val');
        } catch (e) {
            //不同域
            topOK = false;
        }
        // cloudy run 不同域跑不抛异常
        if (topOK && !UA.webkit) {
            Dom.data(top, 'data', 'val');
            expect(Dom.data(top, 'data')).to.be('val');
        }
        var o = {};
        Dom.data(o, 'data', 'val');
        expect(Dom.data(o, 'data')).to.be('val');
        expect(Dom.data(o).data).to.be('val');

        Dom.remove(foo);
    });

    it('native data should not add unnecessary EXPANDO', function () {
        var foo = document.body.appendChild(Dom.create('<div>'));
        expect(Dom.data(foo, 'd')).to.be(undefined);
        expect(foo[__EXPANDO]).to.be(undefined);
        Dom.removeData(foo);
        expect(foo[__EXPANDO]).to.be(undefined);
        Dom.remove(foo);
    });

    it('custom data should not add unnecessary EXPANDO', function () {
        var foo = {};
        expect(Dom.data(foo, 'd')).to.be(undefined);
        expect(foo[__EXPANDO]).to.be(undefined);
        Dom.removeData(foo);
        expect(foo[__EXPANDO]).to.be(undefined);
    });

    it('removeData should works', function () {
        var foo = document.body.appendChild(Dom.create('<div><span></span><div>'));
        var bar = Dom.get('span', foo);

        Dom.data(foo, 'data', 'val');
        Dom.removeData(foo, 'data');
        //  if data is removed ,then its value is undefined
        expect(Dom.data(foo, 'data')).to.be(undefined);
        expect(Dom.hasData(foo, 'data')).to.be(false);

        Dom.data(window, 'data', 'val');

        Dom.removeData(window, 'data');

        expect(Dom.data(window, 'data')).to.be(undefined);
        expect(Dom.hasData(window)).to.be(false);

        // 返回空对象
        expect(util.isEmptyObject(Dom.data(window))).to.be(true);

        Dom.data(foo, 'custom', 'custom');
        Dom.data(bar, 'custom2', 'custom2');

        expect(Dom.data(foo, 'custom')).to.be('custom');
        expect(Dom.data(bar, 'custom2')).to.be('custom2');

        Dom.remove(foo);

        /**
         * 2011-08-09
         * 删除元素时，会把其下面的元素以及自身都 removeData
         */
        expect(Dom.data(foo, 'custom')).to.be(undefined);
        expect(Dom.data(bar, 'custom2')).to.be(undefined);
    });

    it('hasData should works', function () {
        var p = Dom.create('<p>');
        // 给所有的段落节点设置扩展属性 ``x`` ，值为 ``y``
        Dom.data(p, 'x', 'y');

        expect(Dom.hasData(p)).to.be(true); // => true , 设置过扩展属性

        expect(Dom.hasData(p, 'x')).to.be(true); // => true , 设置过扩展属性 ``x`` 的值

        expect(Dom.hasData(p, 'z')).to.be(false); // => false , 没有设置过扩展属性 ``z`` 的值

        Dom.removeData(p, 'x'); // => 删除扩展属性 ``x`` 的值

        expect(Dom.hasData(p, 'x')).to.be(false); //=> false

        expect(Dom.hasData(p)).to.be(false); //=> false

        //空对象
        expect(util.isEmptyObject(Dom.data(p))).to.be(true);
    });

    it('cleanData works', function () {
        var div = Dom.create('<div class="t"><div class="t2"></div></div>');
        document.body.appendChild(div);
        var div2 = div.firstChild;
        Dom.data(div2, '1', 1);
        Dom.data(div, '1', 1);
        Dom.cleanData(div);
        expect(Dom.hasData(div)).to.be(false);
        expect(Dom.hasData(div2)).to.be(true);
        Dom.data(div, '1', 1);
        Dom.cleanData(div, '1', 1);
        expect(Dom.hasData(div)).to.be(false);
        expect(Dom.hasData(div2)).to.be(false);
    });
});