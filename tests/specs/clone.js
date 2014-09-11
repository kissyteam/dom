/*jshint quotmark:false*/
var Dom = require('dom');
var Event = require('event/dom');
var UA = require('ua');

describe("clone", function () {
    it("works for checkbox", function () {
        var checkbox = Dom.create("<input type='checkbox' checked='checked' />");
        Dom.append(checkbox, "#test_cases");
        Dom.data(checkbox, "custom", 1);
        var cloned = Dom.clone(checkbox);
        document.body.appendChild(cloned);
        expect(Dom.data(checkbox, "custom")).to.be(1);
        expect(cloned.checked).to.be(true);
        expect(Dom.data(cloned, "custom")).to.be(undefined);
        expect(Dom.val(cloned)).to.be("on");
        Dom.remove(checkbox);
        Dom.remove(cloned);
    });

    it("works for checkbox which is checked after create", function () {
        var checkbox = Dom.create("<input type='checkbox'/>");
        Dom.append(checkbox, "#test_cases");
        checkbox.checked = true;
        Dom.data(checkbox, "custom", 1);
        var cloned = Dom.clone(checkbox);
        document.body.appendChild(cloned);
        expect(Dom.data(checkbox, "custom")).to.be(1);
        expect(cloned.checked).to.be(true);
        expect(Dom.data(cloned, "custom")).to.be(undefined);
        expect(Dom.val(cloned)).to.be("on");
        Dom.remove(checkbox);
        Dom.remove(cloned);
    });

    it("works for radio which is checked after create", function () {
        var checkbox = Dom.create("<input type='radio'/>");
        Dom.append(checkbox, "#test_cases");
        checkbox.checked = true;
        Dom.data(checkbox, "custom", 1);
        var cloned = Dom.clone(checkbox);
        document.body.appendChild(cloned);
        expect(Dom.data(checkbox, "custom")).to.be(1);
        expect(cloned.checked).to.be(true);
        expect(Dom.data(cloned, "custom")).to.be(undefined);
        expect(Dom.val(cloned)).to.be("on");
        Dom.remove(checkbox);
        Dom.remove(cloned);
    });

    it("works for select which is select after create", function () {
        var select = Dom.create("<select><option>1</option><option selected>2</option></select>");
        Dom.append(select, "#test_cases");
        var cloned = Dom.clone(select);
        document.body.appendChild(select);
        expect(select.selectedIndex).to.be(1);
        Dom.remove(select);
        Dom.remove(cloned);
    });

    it("works for select which is select after create", function () {
        var select = Dom.create("<select><option>1</option><option>2</option></select>");
        Dom.append(select, "#test_cases");
        select.selectedIndex = 1;
        var cloned = Dom.clone(select);
        document.body.appendChild(select);
        expect(select.selectedIndex).to.be(1);
        Dom.remove(select);
        Dom.remove(cloned);
    });

    it('works for single textarea', function () {
        var input = Dom.create("<textarea></textarea>");
        Dom.append(input, "#test_cases");
        input.defaultValue = 'y';
        input.value = 'x';
        var cloned = Dom.clone(input);
        expect(cloned.defaultValue).to.be('y');
        expect(cloned.value).to.be('x');
        Dom.append(cloned, "#test_cases");
        Dom.remove(input);
        Dom.remove(cloned);
    });

    it('works for nested textarea', function () {
        var input = Dom.create("<div><textarea></textarea></div>");
        Dom.append(input, "#test_cases");
        input = Dom.get('textarea', input);
        input.defaultValue = 'y';
        input.value = 'x';
        var cloned = Dom.clone(input, true);
        expect(cloned.defaultValue).to.be('y');
        expect(cloned.value).to.be('x');
        Dom.append(cloned, "#test_cases");
        Dom.remove(input);
        Dom.remove(cloned);
    });

    //http://msdn.microsoft.com/en-us/library/ms533718%28v=vs.85%29.aspx
    it("works for defaultValue", function () {
        var input = Dom.create("<input type='text' value='x' />");
        input.defaultValue = 'y';
        input.value = 'x';
        Dom.append(input, "#test_cases");
        var cloned = Dom.clone(input);
        expect(cloned.defaultValue).to.be('y');
        expect(cloned.value).to.be('x');
        Dom.remove(input);
    });

    // ie
    if (window.ActiveXObject && UA.ieMode < 9) {
        it("works for classid", function () {
            var flash = '<object ' +
                'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ' +
                'width="550" ' +
                'height="400" ' +
                'id="movie_name" align="middle">' +
                '<param name="movie" value="movie_name.swf"/>' +
                '<' + '/object>';
            var el = Dom.create(flash);
            Dom.append(el, 'body');
            expect(Dom.attr(el.firstChild, 'value')).to.be("movie_name.swf");
            var cloned = Dom.clone(el);
            expect(Dom.attr(cloned.firstChild, 'value')).to.be("movie_name.swf");
            Dom.remove(el);
        });
    } else {
        it("works for flash", function () {
            var flash = '<object class="holiday-logo"' +
                ' data="http://img01.taobaocdn.com/tps/i1/T12MVIXfVNXXXXXXXX.swf" ' +
                'height="68" name="holiday-logo" type="application/x-shockwave-flash" ' +
                'width="300"><param name="wmode" value="transparent" />' +
                '<a href="http://www.taobao.com/" style="height: 43px; margin-left: 56px;"' +
                ' target="_top"> 淘宝网 <img alt="淘宝网" height="110" ' +
                'src="http://www.taobao.com/" ' +
                'title="Taobao.com - 阿里巴巴旗下网站" width="167" /> </a>' +
                '</object>';
            var el = Dom.create(flash);
            Dom.append(el, 'body');
            expect(Dom.attr(el.firstChild, 'value')).to.be("transparent");
            expect(Dom.attr(el, 'data'))
                .to.be("http://img01.taobaocdn.com/tps/i1/T12MVIXfVNXXXXXXXX.swf");
            var cloned = Dom.clone(el, true);
            expect(Dom.attr(cloned.firstChild, 'value')).to.be("transparent");
            expect(Dom.attr(cloned, 'data'))
                .to.be("http://img01.taobaocdn.com/tps/i1/T12MVIXfVNXXXXXXXX.swf");
            Dom.remove(el);
        });
    }

    it("works with data and event", function (done) {
        var div = Dom.create("<div><" + "/div>");
        Dom.append(div, 'body');
        var x = {x: 1};
        Dom.data(div, "web", x);
        Dom.data(div, "web2", 2);
        var d = 1;
        Event.on(div, 'click', function () {
            d++;
        });
        Event.fire(div, 'click', undefined, true);
        expect(d).to.be(2);
        var cloned = Dom.clone(div, {
            deep: false,
            withDataAndEvent: true
        });
        expect(Dom.data(cloned, "web").x).to.be(1);
        expect(Dom.data(cloned, "web2")).to.be(2);
        x.x = 3;
        Dom.data(div, "web2", 4);

        expect(Dom.data(div, "web").x).to.be(3);
        expect(Dom.data(div, "web2")).to.be(4);

        // 可见克隆的 data 为引用
        expect(Dom.data(cloned, "web").x).to.be(3);
        expect(Dom.data(cloned, "web2")).to.be(2);

        Event.fire(cloned, 'click', undefined, true);
        expect(d).to.be(3);

        Dom.append(cloned, 'body');

        window.simulateEvent(cloned, 'click');

        setTimeout(function () {
            expect(d).to.be(4);
            Dom.remove(cloned);
            Dom.remove(div);
            done();
        },500);
    });

    it("works with data and event when deep", function (done) {
        var div = Dom.create("<div><span><" + "/span><" + "/div>");
        var span = Dom.get("span", div);
        Dom.append(div, 'body');
        var x = {x: 1};
        Dom.data(span, "web", x);
        Dom.data(span, "web2", 2);

        var d = 1;

        Event.on(span, 'click', function () {
            d++;
        });

        Event.fire(span, 'click', undefined, true);

        expect(d).to.be(2);

        var cloned = Dom.clone(div, {
                withDataAndEvent: true,
                deep: true,
                deepWithDataAndEvent: true
            }),
            clonedSpan = Dom.get("span", cloned);

        expect(Dom.data(clonedSpan, "web").x).to.be(1);
        expect(Dom.data(clonedSpan, "web2")).to.be(2);

        x.x = 3;
        Dom.data(span, "web2", 4);

        expect(Dom.data(span, "web").x).to.be(3);
        expect(Dom.data(span, "web2")).to.be(4);

        // 可见克隆的 data 为引用
        expect(Dom.data(clonedSpan, "web").x).to.be(3);
        expect(Dom.data(clonedSpan, "web2")).to.be(2);

        Event.fire(clonedSpan, 'click', undefined, true);
        expect(d).to.be(3);

        Dom.append(cloned, 'body');

        window.simulateEvent(clonedSpan, 'click');

        setTimeout(function () {
            expect(d).to.be(4);
            Dom.remove(cloned);
            Dom.remove(div);
            done();
        },500);
    });

    it('does not mess event with cloned src element', function () {
        var div = Dom.create("<div><span id='t1'><" + "/span><" + "/div>");

        var span = Dom.get("span", div);

        Dom.append(div, 'body');

        var d = {
            t1: 1,
            t2: 1
        };

        Event.on(span, 'click', function () {
            d[this.id]++;
        });

        var span2 = Dom.clone(span, {
            withDataAndEvent: true,
            deep: true,
            deepWithDataAndEvent: true
        });

        Event.on(span2, 'click', function () {
        });

        span2.id = 't2';

        Dom.append(span2, 'body');

        window.simulateEvent(span2, 'click');

        var arr = [
            function (next) {
                setTimeout(next, 100);
            },
            function () {
                expect(d.t1).to.be(1);
                expect(d.t2).to.be(2);
            },
            function () {
                window.simulateEvent(span, 'click');
            },

            function (next) {
                setTimeout(next, 100);
            },
            function () {
                expect(d.t1).to.be(2);
                expect(d.t2).to.be(2);
            }
        ];

        (function (arr) {
            function next() {
                ++i;
                if (i !== arr.length) {
                    if (arr[i].length) {
                        arr[i](next);
                    } else {
                        arr[i]();
                        next();
                    }

                }
            }

            var i = -1;
            next();
        })(arr);
    });

    it('does not mess event with cloned src element by firing', function (done) {
        var div = Dom.create("<div><span id='t1'><" + "/span><" + "/div>");

        var span = Dom.get("span", div);

        Dom.append(div, 'body');

        var d = {
            t1: 1,
            t2: 1
        };

        Event.on(span, 'click', function () {
            d[this.id]++;
        });

        var span2 = Dom.clone(span, {
            withDataAndEvent: true,
            deep: true,
            deepWithDataAndEvent: true
        });

        span2.id = 't2';

        Dom.append(span2, 'body');

        Event.fire(span2, 'click');

        setTimeout(function () {
            expect(d.t1).to.be(1);
            expect(d.t2).to.be(2);
            done();
        },100);
    });
});