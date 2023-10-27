"use strict";
const fs = require('fs');
function generateDot(ast) {
    let dot = 'digraph AST {\n';
    let id = 0;
    function traverse(node, parentId) {
        let nodeId = id++;
        dot += `  ${nodeId} [label="${node.type}"];\n`;
        if (parentId !== null) {
            dot += `  ${parentId} -> ${nodeId};\n`;
        }
        for (let key in node) {
            if (key === 'type' || key === 'start' || key === 'end' || key === 'loc') {
                continue;
            }
            let value = node[key];
            if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++) {
                    if (value[i] !== null && typeof value[i] === 'object') {
                        traverse(value[i], nodeId);
                    }
                }
            }
            else if (value !== null && typeof value === 'object') {
                traverse(value, nodeId);
            }
        }
    }
    traverse(ast, null);
    dot += '}';
    return dot;
}
const ast = {
    type: 'ExpressionStatement',
    start: 0,
    end: 67,
    loc: {
        start: {
            line: 1,
            column: 0,
            index: 0,
        },
        end: {
            line: 1,
            column: 67,
            index: 67,
        },
    },
    expression: {
        type: 'OptionalCallExpression',
        start: 0,
        end: 66,
        loc: {
            start: {
                line: 1,
                column: 0,
                index: 0,
            },
            end: {
                line: 1,
                column: 66,
                index: 66,
            },
        },
        callee: {
            type: 'OptionalMemberExpression',
            start: 0,
            end: 55,
            loc: {
                start: {
                    line: 1,
                    column: 0,
                    index: 0,
                },
                end: {
                    line: 1,
                    column: 55,
                    index: 55,
                },
            },
            object: {
                type: 'OptionalMemberExpression',
                start: 0,
                end: 49,
                loc: {
                    start: {
                        line: 1,
                        column: 0,
                        index: 0,
                    },
                    end: {
                        line: 1,
                        column: 49,
                        index: 49,
                    },
                },
                object: {
                    type: 'OptionalCallExpression',
                    start: 0,
                    end: 35,
                    loc: {
                        start: {
                            line: 1,
                            column: 0,
                            index: 0,
                        },
                        end: {
                            line: 1,
                            column: 35,
                            index: 35,
                        },
                    },
                    callee: {
                        type: 'OptionalMemberExpression',
                        start: 0,
                        end: 19,
                        loc: {
                            start: {
                                line: 1,
                                column: 0,
                                index: 0,
                            },
                            end: {
                                line: 1,
                                column: 19,
                                index: 19,
                            },
                        },
                        object: {
                            type: 'OptionalMemberExpression',
                            start: 0,
                            end: 14,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 0,
                                    index: 0,
                                },
                                end: {
                                    line: 1,
                                    column: 14,
                                    index: 14,
                                },
                            },
                            object: {
                                type: 'OptionalMemberExpression',
                                start: 0,
                                end: 11,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 0,
                                        index: 0,
                                    },
                                    end: {
                                        line: 1,
                                        column: 11,
                                        index: 11,
                                    },
                                },
                                object: {
                                    type: 'Identifier',
                                    start: 0,
                                    end: 5,
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 0,
                                            index: 0,
                                        },
                                        end: {
                                            line: 1,
                                            column: 5,
                                            index: 5,
                                        },
                                        identifierName: 'param',
                                    },
                                    name: 'param',
                                },
                                computed: false,
                                property: {
                                    type: 'Identifier',
                                    start: 7,
                                    end: 11,
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 7,
                                            index: 7,
                                        },
                                        end: {
                                            line: 1,
                                            column: 11,
                                            index: 11,
                                        },
                                        identifierName: 'some',
                                    },
                                    name: 'some',
                                },
                                optional: true,
                            },
                            computed: true,
                            property: {
                                type: 'NumericLiteral',
                                start: 12,
                                end: 13,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 12,
                                        index: 12,
                                    },
                                    end: {
                                        line: 1,
                                        column: 13,
                                        index: 13,
                                    },
                                },
                                extra: {
                                    rawValue: 1,
                                    raw: '1',
                                },
                                value: 1,
                            },
                            optional: false,
                        },
                        computed: false,
                        property: {
                            type: 'Identifier',
                            start: 15,
                            end: 19,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 15,
                                    index: 15,
                                },
                                end: {
                                    line: 1,
                                    column: 19,
                                    index: 19,
                                },
                                identifierName: 'name',
                            },
                            name: 'name',
                        },
                        optional: false,
                    },
                    optional: true,
                    arguments: [
                        {
                            type: 'CallExpression',
                            start: 22,
                            end: 25,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 22,
                                    index: 22,
                                },
                                end: {
                                    line: 1,
                                    column: 25,
                                    index: 25,
                                },
                            },
                            callee: {
                                type: 'Identifier',
                                start: 22,
                                end: 23,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 22,
                                        index: 22,
                                    },
                                    end: {
                                        line: 1,
                                        column: 23,
                                        index: 23,
                                    },
                                    identifierName: 'm',
                                },
                                name: 'm',
                            },
                            arguments: [],
                        },
                        {
                            type: 'CallExpression',
                            start: 26,
                            end: 34,
                            loc: {
                                start: {
                                    line: 1,
                                    column: 26,
                                    index: 26,
                                },
                                end: {
                                    line: 1,
                                    column: 34,
                                    index: 34,
                                },
                            },
                            callee: {
                                type: 'MemberExpression',
                                start: 26,
                                end: 32,
                                loc: {
                                    start: {
                                        line: 1,
                                        column: 26,
                                        index: 26,
                                    },
                                    end: {
                                        line: 1,
                                        column: 32,
                                        index: 32,
                                    },
                                },
                                object: {
                                    type: 'Identifier',
                                    start: 26,
                                    end: 27,
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 26,
                                            index: 26,
                                        },
                                        end: {
                                            line: 1,
                                            column: 27,
                                            index: 27,
                                        },
                                        identifierName: 'e',
                                    },
                                    name: 'e',
                                },
                                computed: false,
                                property: {
                                    type: 'Identifier',
                                    start: 28,
                                    end: 32,
                                    loc: {
                                        start: {
                                            line: 1,
                                            column: 28,
                                            index: 28,
                                        },
                                        end: {
                                            line: 1,
                                            column: 32,
                                            index: 32,
                                        },
                                        identifierName: 'name',
                                    },
                                    name: 'name',
                                },
                            },
                            arguments: [],
                        },
                    ],
                },
                computed: true,
                property: {
                    type: 'StringLiteral',
                    start: 36,
                    end: 48,
                    loc: {
                        start: {
                            line: 1,
                            column: 36,
                            index: 36,
                        },
                        end: {
                            line: 1,
                            column: 48,
                            index: 48,
                        },
                    },
                    extra: {
                        rawValue: 'super name',
                        raw: "'super name'",
                    },
                    value: 'super name',
                },
                optional: false,
            },
            computed: false,
            property: {
                type: 'Identifier',
                start: 51,
                end: 55,
                loc: {
                    start: {
                        line: 1,
                        column: 51,
                        index: 51,
                    },
                    end: {
                        line: 1,
                        column: 55,
                        index: 55,
                    },
                    identifierName: 'nice',
                },
                name: 'nice',
            },
            optional: true,
        },
        optional: false,
        arguments: [
            {
                type: 'BinaryExpression',
                start: 56,
                end: 65,
                loc: {
                    start: {
                        line: 1,
                        column: 56,
                        index: 56,
                    },
                    end: {
                        line: 1,
                        column: 65,
                        index: 65,
                    },
                },
                left: {
                    type: 'BinaryExpression',
                    start: 56,
                    end: 61,
                    loc: {
                        start: {
                            line: 1,
                            column: 56,
                            index: 56,
                        },
                        end: {
                            line: 1,
                            column: 61,
                            index: 61,
                        },
                    },
                    left: {
                        type: 'Identifier',
                        start: 56,
                        end: 57,
                        loc: {
                            start: {
                                line: 1,
                                column: 56,
                                index: 56,
                            },
                            end: {
                                line: 1,
                                column: 57,
                                index: 57,
                            },
                            identifierName: 'a',
                        },
                        name: 'a',
                    },
                    operator: '+',
                    right: {
                        type: 'Identifier',
                        start: 60,
                        end: 61,
                        loc: {
                            start: {
                                line: 1,
                                column: 60,
                                index: 60,
                            },
                            end: {
                                line: 1,
                                column: 61,
                                index: 61,
                            },
                            identifierName: 'b',
                        },
                        name: 'b',
                    },
                },
                operator: '+',
                right: {
                    type: 'Identifier',
                    start: 64,
                    end: 65,
                    loc: {
                        start: {
                            line: 1,
                            column: 64,
                            index: 64,
                        },
                        end: {
                            line: 1,
                            column: 65,
                            index: 65,
                        },
                        identifierName: 'c',
                    },
                    name: 'c',
                },
            },
        ],
    },
};
const dot = generateDot(ast);
fs.writeFileSync('ast.dot', dot);
//# sourceMappingURL=gpt.js.map