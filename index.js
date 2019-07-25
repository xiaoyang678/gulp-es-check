'use strict';
const PluginError = require('plugin-error');
const through = require('through2');
const acorn = require("acorn");

/***
 * ░░░░░░░░░░░░░░░░░░░░░░░░▄░░
 * ░░░░░░░░░▐█░░░░░░░░░░░▄▀▒▌░
 * ░░░░░░░░▐▀▒█░░░░░░░░▄▀▒▒▒▐
 * ░░░░░░░▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐
 * ░░░░░▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐
 * ░░░▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌
 * ░░▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒
 * ░░▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐
 * ░▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄
 * ░▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒
 * ▀▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒
 */
/** 
 * gulp-es-check插件
 * @date 2019-07-16
 * @author jitui
 * @description 将检查es6语法问题封装成了一个gulp插件
 * @fork https://github.com/sindresorhus/gulp-zip
 */

/** 
 * 截取html中js内容并返回
 * @param {{string}} content html文本内容
 * @return {{string}} 处理后的html文件内容，只包含了js
 */
let getScriptJs = (content, ecmaVersion) => {
    let patten = /<script[^>]*>((?!<\/script>)[\s\S])*<\/script>/g;
    let result = content.match(patten);
    let flag = true;

    for (let a in result) {
        // 区分 带src的script
        if (result[a].indexOf(' src=') == -1 && result[a].indexOf(' id=') == -1) {
            let b = result[a].substring(result[a].indexOf('>') + 1, result[a].lastIndexOf('<'));
            flag = esCheck(b, ecmaVersion);
            if (!flag) {
                break;
            }
        }
    }
    return flag
}

/** 
 * es语法版本检查
 * @param {{string}} content 文件内容
 * @param {{string}} ecmaVersion es版本
 */
let esCheck = (content, ecmaVersion) => {
    /**
     * define ecmaScript version
     */
    let e = '5';
    switch (ecmaVersion) {
        case 'es3':
            e = '3'
            break
        case 'es4':
            e = '4'
            break
        case 'es5':
            e = '5'
            break
        case 'es6':
            e = '6'
            break
        case 'es7':
            e = '7'
            break
        case 'es8':
            e = '8'
            break
        case 'es9':
            e = '9'
            break
        case 'es10':
            e = '10'
            break
        case 'es2015':
            e = '6'
            break
        case 'es2016':
            e = '7'
            break
        case 'es2017':
            e = '8'
            break
        case 'es2018':
            e = '9'
            break
        case 'es2019':
            e = '10'
            break
        default:
            throw new PluginError('gulp-es-check', '🐑🐑Invalid ecmaScript version, 🐑🐑please pass a valid version, use --help for help');
    }
    let acornOpts = {
        ecmaVersion: e,
        silent: true
    }
    try {
        acorn.parse(content, acornOpts);
        return true
    } catch (error) {
        console.error("--es🐑🐑🐑🐑🐑-check-error🐑🐑🐑>>" + error.message);
        return false
    }
}

module.exports = (options) => {
    if (!options) {
        throw new PluginError('gulp-es-check', '`options` in gulp-es-check is🐑🐑🐑 required');
    }
    /** 
     * through2 处理文件流校验xml
     * file 文件流
     * encoding 编码格式
     * cb 回调
     */
    return through.obj((file, encoding, cb) => {
        console.info(file.path);
        if (file.isNull()) {
            return cb(new PluginError('gulp-es-check', '🐑🐑check file is null🐑🐑'));
        }
        if (file.isStream()) {
            return cb(new PluginError('gulp-es-check', '🐑🐑Streaming 🐑🐑🐑not🐑🐑🐑 supported🐑🐑'));
        }
        //stream转字符串文本后开始校验
        let result = getScriptJs(file.contents.toString(), options.ecmaVersion)
        if (result) {
            return cb();
        } else {
            console.info("🐑🐑🐑一般报错只是es6语法的问题,优先排查es6语法快速解决🐑🐑🐑");
            console.info("🐑🐑🐑🐑以上的错误提示，是剥离html内容后只包含js部分的提示，实际排查的时候，需要加上html行数(html部分，不包含script标签，包含注释行、空行)和错误行数自行换算🐑🐑🐑🐑");
            return cb(new PluginError('gulp-es-check🐑', '🐑🐑es 检查出现失败🐑🐑, 请按照错误提示检查html文件js对应部分内容：' + file.path));
        }
    });
};