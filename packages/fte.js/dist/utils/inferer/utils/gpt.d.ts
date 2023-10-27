declare const fs: any;
declare function generateDot(ast: any): string;
declare const ast: {
    type: string;
    start: number;
    end: number;
    loc: {
        start: {
            line: number;
            column: number;
            index: number;
        };
        end: {
            line: number;
            column: number;
            index: number;
        };
    };
    expression: {
        type: string;
        start: number;
        end: number;
        loc: {
            start: {
                line: number;
                column: number;
                index: number;
            };
            end: {
                line: number;
                column: number;
                index: number;
            };
        };
        callee: {
            type: string;
            start: number;
            end: number;
            loc: {
                start: {
                    line: number;
                    column: number;
                    index: number;
                };
                end: {
                    line: number;
                    column: number;
                    index: number;
                };
            };
            object: {
                type: string;
                start: number;
                end: number;
                loc: {
                    start: {
                        line: number;
                        column: number;
                        index: number;
                    };
                    end: {
                        line: number;
                        column: number;
                        index: number;
                    };
                };
                object: {
                    type: string;
                    start: number;
                    end: number;
                    loc: {
                        start: {
                            line: number;
                            column: number;
                            index: number;
                        };
                        end: {
                            line: number;
                            column: number;
                            index: number;
                        };
                    };
                    callee: {
                        type: string;
                        start: number;
                        end: number;
                        loc: {
                            start: {
                                line: number;
                                column: number;
                                index: number;
                            };
                            end: {
                                line: number;
                                column: number;
                                index: number;
                            };
                        };
                        object: {
                            type: string;
                            start: number;
                            end: number;
                            loc: {
                                start: {
                                    line: number;
                                    column: number;
                                    index: number;
                                };
                                end: {
                                    line: number;
                                    column: number;
                                    index: number;
                                };
                            };
                            object: {
                                type: string;
                                start: number;
                                end: number;
                                loc: {
                                    start: {
                                        line: number;
                                        column: number;
                                        index: number;
                                    };
                                    end: {
                                        line: number;
                                        column: number;
                                        index: number;
                                    };
                                };
                                object: {
                                    type: string;
                                    start: number;
                                    end: number;
                                    loc: {
                                        start: {
                                            line: number;
                                            column: number;
                                            index: number;
                                        };
                                        end: {
                                            line: number;
                                            column: number;
                                            index: number;
                                        };
                                        identifierName: string;
                                    };
                                    name: string;
                                };
                                computed: boolean;
                                property: {
                                    type: string;
                                    start: number;
                                    end: number;
                                    loc: {
                                        start: {
                                            line: number;
                                            column: number;
                                            index: number;
                                        };
                                        end: {
                                            line: number;
                                            column: number;
                                            index: number;
                                        };
                                        identifierName: string;
                                    };
                                    name: string;
                                };
                                optional: boolean;
                            };
                            computed: boolean;
                            property: {
                                type: string;
                                start: number;
                                end: number;
                                loc: {
                                    start: {
                                        line: number;
                                        column: number;
                                        index: number;
                                    };
                                    end: {
                                        line: number;
                                        column: number;
                                        index: number;
                                    };
                                };
                                extra: {
                                    rawValue: number;
                                    raw: string;
                                };
                                value: number;
                            };
                            optional: boolean;
                        };
                        computed: boolean;
                        property: {
                            type: string;
                            start: number;
                            end: number;
                            loc: {
                                start: {
                                    line: number;
                                    column: number;
                                    index: number;
                                };
                                end: {
                                    line: number;
                                    column: number;
                                    index: number;
                                };
                                identifierName: string;
                            };
                            name: string;
                        };
                        optional: boolean;
                    };
                    optional: boolean;
                    arguments: ({
                        type: string;
                        start: number;
                        end: number;
                        loc: {
                            start: {
                                line: number;
                                column: number;
                                index: number;
                            };
                            end: {
                                line: number;
                                column: number;
                                index: number;
                            };
                        };
                        callee: {
                            type: string;
                            start: number;
                            end: number;
                            loc: {
                                start: {
                                    line: number;
                                    column: number;
                                    index: number;
                                };
                                end: {
                                    line: number;
                                    column: number;
                                    index: number;
                                };
                                identifierName: string;
                            };
                            name: string;
                            object?: undefined;
                            computed?: undefined;
                            property?: undefined;
                        };
                        arguments: never[];
                    } | {
                        type: string;
                        start: number;
                        end: number;
                        loc: {
                            start: {
                                line: number;
                                column: number;
                                index: number;
                            };
                            end: {
                                line: number;
                                column: number;
                                index: number;
                            };
                        };
                        callee: {
                            type: string;
                            start: number;
                            end: number;
                            loc: {
                                start: {
                                    line: number;
                                    column: number;
                                    index: number;
                                };
                                end: {
                                    line: number;
                                    column: number;
                                    index: number;
                                };
                                identifierName?: undefined;
                            };
                            object: {
                                type: string;
                                start: number;
                                end: number;
                                loc: {
                                    start: {
                                        line: number;
                                        column: number;
                                        index: number;
                                    };
                                    end: {
                                        line: number;
                                        column: number;
                                        index: number;
                                    };
                                    identifierName: string;
                                };
                                name: string;
                            };
                            computed: boolean;
                            property: {
                                type: string;
                                start: number;
                                end: number;
                                loc: {
                                    start: {
                                        line: number;
                                        column: number;
                                        index: number;
                                    };
                                    end: {
                                        line: number;
                                        column: number;
                                        index: number;
                                    };
                                    identifierName: string;
                                };
                                name: string;
                            };
                            name?: undefined;
                        };
                        arguments: never[];
                    })[];
                };
                computed: boolean;
                property: {
                    type: string;
                    start: number;
                    end: number;
                    loc: {
                        start: {
                            line: number;
                            column: number;
                            index: number;
                        };
                        end: {
                            line: number;
                            column: number;
                            index: number;
                        };
                    };
                    extra: {
                        rawValue: string;
                        raw: string;
                    };
                    value: string;
                };
                optional: boolean;
            };
            computed: boolean;
            property: {
                type: string;
                start: number;
                end: number;
                loc: {
                    start: {
                        line: number;
                        column: number;
                        index: number;
                    };
                    end: {
                        line: number;
                        column: number;
                        index: number;
                    };
                    identifierName: string;
                };
                name: string;
            };
            optional: boolean;
        };
        optional: boolean;
        arguments: {
            type: string;
            start: number;
            end: number;
            loc: {
                start: {
                    line: number;
                    column: number;
                    index: number;
                };
                end: {
                    line: number;
                    column: number;
                    index: number;
                };
            };
            left: {
                type: string;
                start: number;
                end: number;
                loc: {
                    start: {
                        line: number;
                        column: number;
                        index: number;
                    };
                    end: {
                        line: number;
                        column: number;
                        index: number;
                    };
                };
                left: {
                    type: string;
                    start: number;
                    end: number;
                    loc: {
                        start: {
                            line: number;
                            column: number;
                            index: number;
                        };
                        end: {
                            line: number;
                            column: number;
                            index: number;
                        };
                        identifierName: string;
                    };
                    name: string;
                };
                operator: string;
                right: {
                    type: string;
                    start: number;
                    end: number;
                    loc: {
                        start: {
                            line: number;
                            column: number;
                            index: number;
                        };
                        end: {
                            line: number;
                            column: number;
                            index: number;
                        };
                        identifierName: string;
                    };
                    name: string;
                };
            };
            operator: string;
            right: {
                type: string;
                start: number;
                end: number;
                loc: {
                    start: {
                        line: number;
                        column: number;
                        index: number;
                    };
                    end: {
                        line: number;
                        column: number;
                        index: number;
                    };
                    identifierName: string;
                };
                name: string;
            };
        }[];
    };
};
declare const dot: string;
//# sourceMappingURL=gpt.d.ts.map