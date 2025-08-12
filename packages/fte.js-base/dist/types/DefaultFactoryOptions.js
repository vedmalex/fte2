"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultFactoryOptions = void 0;
const escapeIt_1 = require("../utils/escapeIt");
const applyIndent_1 = require("../utils/applyIndent");
const applyDeindent_1 = require("../utils/applyDeindent");
const applyDeindentStream_1 = require("../utils/applyDeindentStream");
exports.DefaultFactoryOptions = {
    applyIndent: applyIndent_1.applyIndent,
    escapeIt: escapeIt_1.escapeIt,
    applyDeindent: applyDeindent_1.applyDeindent,
    applyDeindentStream: applyDeindentStream_1.applyDeindentStream,
    sourceMap: false,
    inline: true,
};
//# sourceMappingURL=DefaultFactoryOptions.js.map