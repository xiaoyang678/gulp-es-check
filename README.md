# gulp-es-check
gulp插件，用于检查javascript语法是否符合规范

## 使用方式

```javasctipt
const esCheck = require("./util/gulp-es-check");

gulp.task('task-esCheck', () => {
  return gulp.src('./**/*.html')
    .pipe(esCheck({
      ecmaVersion: 'es5'
    }))
});
```

## 参数列表

|     参数名称     |          类型          |    说明    |
| :--------------: | :--------------------: | :----------: |
|   **`ecmaVersion`**   |     `string`     | `ECMAScript` |

## ECMAScript版本对照

|     ecmaVersion     |
|  :--------------:   |
|   **`es3`** |
|   **`es4`** |
|   **`es5`** |
|   **`es6`** |
|   **`es7`** |
|   **`es8`** |
|   **`es9`** |
|   **`es10`** |
|   **`es2015`** |
|   **`es2016`** |
|   **`es2017`** |
|   **`es2018`** |
|   **`es2019`** |

> 具体可以参考acorn模块包，也可以看下源码，很简单的。
