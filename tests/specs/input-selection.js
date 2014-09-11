/**
 * test cases for input-selection
 * @author yiminghe@gmail.com
 */

var Dom = require('dom');
var UA = require('ua');

describe('input-selection', function () {
    it('works for ie', function (done) {
        this.timeout(500000000);
        var textarea = Dom.create('<textarea></textarea>');
        Dom.append(textarea, document.body);

        textarea.value = '1\n2\n3';
        // \n will be '\r\n' in ie<9
        // alert(textarea.value.length);

        var docMode = UA.ieMode;

        if (docMode < 9) {
            var arr = [
                function (next) {
                    setTimeout(next, 100);
                },
                function () {
                    textarea.select();
                    textarea.focus();
                },
                function (next) {
                    setTimeout(next, 100);
                },
                function () {
                    Dom.prop(textarea, 'selectionStart', 1);
                    Dom.prop(textarea, 'selectionEnd', 4);
                },
                function (next) {
                    setTimeout(next, 100);
                },
                function () {
                    expect(document.selection.createRange().text).to.be('\r\n2');
                },
                function () {
                    Dom.prop(textarea, 'selectionStart', 6);
                    expect(document.selection.createRange().text).to.be('');
                    expect(Dom.prop(textarea, 'selectionStart')).to.be(6);
                    expect(Dom.prop(textarea, 'selectionEnd')).to.be(6);
                },
                function (next) {
                    setTimeout(next, 100);
                },
                function () {
                    Dom.prop(textarea, 'selectionEnd', 3);
                    expect(document.selection.createRange().text).to.be('');
                    expect(Dom.prop(textarea, 'selectionStart')).to.be(3);
                    expect(Dom.prop(textarea, 'selectionEnd')).to.be(3);
                },
                function (next) {
                    setTimeout(next, 100);
                },
                function () {
                    Dom.remove(textarea);
                    done();
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
        } else {
            expect('other ok').to.be('other ok');
            Dom.remove(textarea);
            done();
        }
    });
});
