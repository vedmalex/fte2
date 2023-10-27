"use strict";
function name1(a, b, c, ...rest) {
    rest.push(a + b + c);
    return rest;
}
const name2 = (a, b, c) => {
    return a + b / c;
};
const name3 = function (a, [b, c, ...rest]) {
    return name1(a, b, c, ...rest);
};
class A {
    name4(a, b, c) {
        return name3(a, [b, c, 0, 1]);
    }
}
const name5 = (function (a, { b, c }) {
    return new A().name4(a, b, c);
})(1, { b: 2, c: 3 });
const name6 = ((a, b, c) => {
    return a + b + c;
})(1, 2, 3);
const r = {
    name7(a, b, c) {
        function name8(a, b, c) {
            return name2(a, b, c);
        }
        const name9 = (a, b, c) => {
            return name8(a, b, c);
        };
        const name10 = function (a, b, c) {
            return name9(a, b, c);
        };
        class A {
            name11(a, b, c) {
                return name10(a, b, c);
            }
        }
        const name12 = (function (a, b, c) {
            return new A().name11(a, b, c);
        })(a, b, c);
        const name13 = ((d, e, f) => {
            return d + e;
        })(1, 2, 3);
        return name12 + name13;
    },
};
r.name7(1, 2, 3);
//# sourceMappingURL=testfile.js.map