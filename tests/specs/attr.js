/**
 * test cases for attribute sub module of dom module
 * @author yiminghe@gmail.com
 */

var url = require('url');
var Dom = require('dom');
var util = require('util');
var $ = window.jQuery;

function trimCssText(str) {
    return str.replace(/;|\s/g, '').toLowerCase();
}

describe('attr', function () {
    var tpl;

    $.ajax({
        url: './specs/attr.html',
        async: false,
        success: function (d) {
            tpl = d;
        }
    });

    beforeEach(function () {
        $('body').append(tpl);
        foo = Dom.get('#foo');
        a = Dom.get('#foo a');
        img = Dom.get('#test-img');
        input = Dom.get('#foo input');
        radio = Dom.get('#test-radio');
        radio2 = Dom.get('#test-radio2');
        button = Dom.get('#foo button');
        label = Dom.get('#foo label');
        table = Dom.get('#test-table');
        td = Dom.get('#test-table td');
        select = Dom.get('#test-select');
        select2 = Dom.get('#test-select2');
        select3 = Dom.get('#test-select3');
        opt = Dom.get('#test-opt');
        div = Dom.get('#test-div');
        opt2 = Dom.query('#test-select option')[1];
        area = Dom.get('#foo textarea');
        disabledTest = Dom.get('#test-20100728-disabled');
    });

    afterEach(function () {
        $('#test-data').remove();
    });

    Dom.get = Dom.get;
    Dom.query = Dom.query;

    var foo ,
        a ,
        img ,
        input ,
        radio ,
        radio2 ,
        button,
        label,
        table,
        td,
        select,
        select2,
        select3 ,
        opt,
        div ,
        opt2 ,
        area ,
        disabledTest;

    describe('getter/setter', function () {
        it('works for placeholder', function () {
            var n = Dom.create('<input placeholder="haha"/>');
            Dom.append(n, 'body');
            expect(Dom.attr(n, 'placeholder')).to.be('haha');
            Dom.attr(n, 'placeholder', 'hei');
            expect(Dom.attr(n, 'placeholder')).to.be('hei');
            Dom.remove(n);
        });

        // kissy 里，对不存在的属性，统一返回 undefined
        it('should return undefined when get no-exist attribute', function () {
            expect(Dom.attr('a', 'no-exist')).to.be(undefined);
        });

        it('should return correctly for readonly, checked, selected', function () {
            expect(Dom.attr(input, 'readonly')).to.be('readonly');
            // same with jquery , null changed to undefined
            expect(Dom.attr(radio, 'checked')).to.be(undefined);
            expect($(radio).attr('checked')).to.be(undefined);
            // standard browser returns null
            // ie<8 return false , === radio.checked
            // expect(radio.getAttribute('checked')).to.be(undefined);
            expect(Dom.attr(input, 'value')).to.be('hello');
            expect(Dom.val(input)).to.be('hello');
            Dom.attr(input, 'value', 'zz');
            expect(Dom.val(input)).to.be('zz');
            Dom.attr(input, 'value', 'hello');
            Dom.val(input, 'hello');
        });

        it('should return style correctly', function () {
            expect(typeof (Dom.attr(a, 'style')) === 'string').to.be(true);
        });

        it('should return selected correctly', function () {
            expect(Dom.attr(opt, 'selected')).to.be('selected');
            expect(Dom.prop(opt, 'selected')).to.be(true);
        });

        it('should get cutom attribute correctly', function () {
            // 对于非 mapping 属性：
            // ie 下可以用 a.name 或 a['name'] 获取，其它浏览器下不能，即便有值也返回 undefined
            //alert(a['data-test']);
            //alert(a.getAttribute('data-test'));
            expect(Dom.attr(a, 'data-test')).to.be('test');
        });

        // ie bugs fix:
        it('should handle class and for correctly for ie7-', function () {
            // ie7- 要用 className
            expect(Dom.attr(label, 'class')).to.be('test');
            // ie7- 要用 htmlFor
            expect(Dom.attr(label, 'for')).to.be('test-input');
        });

        it('should get href/src/rowspan correctly', function () {
            // href - http://www.glennjones.net/Post/809/getAttributehrefbug.htm
            // alert(a.href); // 在所有浏览器下，a.href 和 a['href'] 都返回绝对地址
            // alert(a.getAttribute('href')); // ie7- 下，会返回绝对地址
            Dom.attr(a, 'href', '../kissy/');

            expect(Dom.attr(a, 'href')).to.be('../kissy/');

            Dom.attr(img, 'src', './specs/space.gif');

            expect(Dom.prop(img, 'src'))
                .to.be(url.resolve(location.href, './specs/space.gif'));

            expect(Dom.attr(img, 'src')).to.be('./specs/space.gif');

            // colspan / rowspan:
            expect(Dom.attr(td, 'rowspan') + '').to.be('2');
        });

        it('should get normal attribute correctly', function () {
            expect(Dom.attr(a, 'title')).to.be('test');
        });

        it('should set normal attribute correctly', function () {
            Dom.attr(a, 'data-set', 'test-xx');
            expect(Dom.attr(a, 'data-set')).to.be('test-xx');
        });

        it('should set style correctly', function () {
            // style
            Dom.attr(td, 'style', 'color:red;');
            expect(trimCssText(Dom.attr(td, 'style'))).to.be('color:red');
        });

        it('should batch execute correctly', function () {
            // batch 测试：
            expect(Dom.attr('#test-data input', 'id')).to.be('hidepass');
            Dom.attr('#test-data div', 'data-test', 'test');
            Dom.query('#test-data div').each(function (el) {
                expect(Dom.attr(el, 'data-test')).to.be('test');
            });
            Dom.attr([td], 'style', 'color:green;');
            expect(trimCssText(Dom.attr([td], 'style')))
                .to.be('color:green');
        });

        it('should handle checked attribute correctly', function () {
            // 测试 checked 的 setter
            var checkbox2 = Dom.get('#test-20100728-checkbox');
            var body = document.body;
            Dom.attr(checkbox2, 'checked', true);
            expect(Dom.attr(checkbox2, 'checked')).to.be('checked');
            expect(Dom.prop(checkbox2, 'checked')).to.be(true);
            Dom.removeAttr(checkbox2, 'checked');
            expect(Dom.attr(checkbox2, 'checked')).to.be(undefined);
            expect(Dom.prop(checkbox2, 'checked')).to.be(false);
            expect(Dom.hasAttr(checkbox2, 'checked')).to.be(false);
            checkbox2.checked = true;
            Dom.attr(checkbox2, 'dd', 'dd');
            expect(Dom.hasAttr(checkbox2, 'dd')).to.be(true);
            expect(Dom.hasProp(checkbox2, 'checked')).to.be(true);
            /**
             * 2011-08-19 集合中，一个为true 都为true
             */
            expect(Dom.hasAttr([body, checkbox2], 'dd')).to.be(true);
            expect(Dom.hasProp([body, checkbox2], 'checked')).to.be(true);
        });

        it('should handle disabled correctly', function () {
            expect(Dom.attr(disabledTest, 'disabled')).not.to.be(true);
            Dom.attr(disabledTest, 'disabled', true);
            expect(Dom.attr(disabledTest, 'disabled')).to.be('disabled');
            expect(Dom.prop(disabledTest, 'disabled')).to.be(true);
            Dom.attr(disabledTest, 'disabled', false);
            expect(Dom.attr(disabledTest, 'disabled')).not.to.be(true);
        });

        it('should set/get correctly even encounter same input name', function () {
            var d = Dom.create('<form >' +
                '<input name="custom110829" id="custom110829" value="yy"/>' +
                '</form>');
            Dom.append(d, document.body);
            Dom.attr(d, 'custom110829', 'xx');
            expect(Dom.attr(d, 'custom110829')).to.be('xx');
            expect(Dom.val('#custom110829')).to.be('yy');
            Dom.remove(d);
        });

        // fix #100
        it('option.attr(\'value\')', function () {
            var s = Dom.create('<select><option value="1">一</option>' +
                '<option value="">二</option><option>三</option></select>');
            Dom.append(s, 'body');
            var ret = [];
            Dom.query('option', s).each(function (o) {
                ret.push(Dom.attr(o, 'value'));
            });
            expect(ret.length).to.be(3);
            expect(ret[0]).to.be('1');
            expect(ret[1]).to.be('')
            expect(ret[2]).to.be(undefined);
            Dom.remove(s);
        });

        // https://github.com/kissyteam/kissy/issues/198
        it('do not change text when change link', function () {
            var a = Dom.create('<a href="#">haha@haha</a>');
            Dom.attr(a, 'href', 'http://www.g.cn');
            expect(Dom.attr(a, 'href')).to.be('http://www.g.cn');
            expect(Dom.html(a)).to.be('haha@haha');
        });

        it('get attribute from form correctly', function () {
            var form = Dom.create('<form ' +
                ' xx="zz" ' +
                ' action="http://www.taobao.com" ' +
                ' name="form_name" ' +
                ' title="form_title" ' +
                ' onsubmit="return false;"><input name="xx" value="yy"></form>');
            expect(Dom.attr(form, 'action')).to.be('http://www.taobao.com');
            expect(Dom.attr(form, 'onsubmit')).to.be('return false;');
            expect(Dom.attr(form, 'name')).to.be('form_name');
            expect(Dom.attr(form, 'title')).to.be('form_title');
            // prevent input shadow
            expect(Dom.attr(form, 'xx')).to.be('zz');
            Dom.attr(form, 'xx', 'qq');
            expect(Dom.attr(form, 'xx')).to.be('qq');
            expect(Dom.val(Dom.first(form))).to.be('yy');
            var button = Dom.create('<button value="xxx">zzzz</button>');
            expect(Dom.attr(button, 'value')).to.be('xxx');
        });
    });

    describe('remove', function () {
        it('should remove attribute correctly', function () {
            // normal
            Dom.attr(label, 'test-remove', 'xx');
            expect(Dom.attr(label, 'test-remove')).to.be('xx');
            Dom.removeAttr(label, 'test-remove');
            expect(Dom.attr(label, 'test-remove')).to.be(undefined);
            // style
            Dom.removeAttr(a, 'style');
            expect(Dom.attr(a, 'style')).to.be('');
        });
    });

    describe('val', function () {
        it('should works for input', function () {
            // normal
            expect(Dom.val(input)).to.be('hello');
        });

        it('should works for input', function () {
            // area
            expect(Dom.val(area).length).to.be(4);
        });

        it('should works for options', function () {
            // option
            expect(Dom.val(opt)).to.be('1');
            expect(Dom.val(opt2)).to.be('2');
        });

        it('should works for select', function () {
            // select
            expect(Dom.val(select)).to.be('1');
            expect(Dom.val(select2)).to.be('2');
            expect(Dom.val(select3)).to.eql(['1', '2']);
        });

        it('should works for radio', function () {
            // radio
            expect(Dom.val(radio)).to.be('on');
            expect(Dom.val(radio2)).to.be('on');
        });

        it('should set value correctly', function () {
            // set value
            Dom.val(a, 'test');
            expect(Dom.val(a)).to.be('test');
            Dom.removeAttr(a, 'value');
        });

        it('should set select value correctly', function () {
            // select set value
            Dom.val(select, '3');
            expect(Dom.val(select)).to.be('3');
            // restore
            Dom.val(select, 0);
            Dom.val(select3, ['2', '3']);
            expect(Dom.val(select3)).to.eql(['2', '3']);
            //restore
            Dom.val(select3, ['1', '2']);
            Dom.val(select, '1');
        });
    });

    describe('text', function () {
        it('should set text correctly', function () {
            Dom.text(div, 'hello, are you ok?');
            expect(Dom.text(div)).to.be('hello, are you ok?');
        });

        it('should get text correctly', function () {
            Dom.html(div, '\t<p>1</p><p>2</p>\t');
            expect(Dom.text(div)).to.be('\t12\t');
        });
    });

    describe('tabindex', function () {
        it('should handle tabindex correctly', function () {
            Dom.removeAttr(select, 'tabindex');
            expect(Dom.hasAttr(select, 'tabindex')).to.be(false);
            Dom.attr(select, 'tabindex', 1);
            expect(Dom.attr(select, 'tabindex')).to.be(1);
            expect(Dom.hasAttr(select, 'tabindex')).to.be(true);
            Dom.removeAttr(select, 'tabindex');
            expect(Dom.hasAttr(select, 'tabindex')).to.be(false);

            var a = Dom.create('<a></a>');
            expect(Dom.hasAttr(a, 'tabindex')).to.be(false);

            expect(Dom.attr(a, 'tabindex')).to.be(undefined);
            expect($(a).attr('tabindex')).to.be(undefined);

            a = Dom.create('<a href="#"></a>');
            expect(Dom.hasAttr(a, 'tabindex')).to.be(false);
            expect(Dom.attr(a, 'tabindex')).to.be(0);

            a = Dom.create('<a href="#" tabindex="2"></a>');
            expect(Dom.hasAttr(a, 'tabindex')).to.be(true);
            expect(Dom.attr(a, 'tabindex')).to.be(2);
        });
    });
    describe('prop', function () {
        it('should works', function () {
            var d = Dom.create('<input type="checkbox" checked="checked">');
            expect(Dom.prop(d, 'checked')).to.be(true);
            // undefined property
            expect(Dom.prop(d, 'checked2')).to.be(undefined);
            expect(Dom.hasProp(d, 'checked')).to.be(true);
            expect(Dom.hasProp(d, 'checked2')).to.be(false);
        });

        it('removeProp works', function () {
            var d = Dom.create('<input type="checkbox" checked="checked">');
            Dom.prop(d, 'x', 'i');
            expect(Dom.hasProp(d, 'x')).to.be(true);
            expect(Dom.prop(d, 'x')).to.be('i');
            Dom.removeProp(d, 'x');
            expect(Dom.hasProp(d, 'x')).to.be(false);
        });
    });
});
