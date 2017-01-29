base62js
========

Base62 Encoding JavaScript implementation

Encodes string to to base62 string.

Decodes base62 string to string.

Encodes byte array to base62 string.

Decodes base62 string to byte array.

This is a port from C# to JavaScript
https://github.com/renmengye/base62-csharp

Thanks to: renmengye

## Example

```js
// encode
var base62 = $d.encodeBase62('test123');
console.log(base62); // T6LpT34oC3

// decode
var text = $d.decodeBase62(base62);
console.log(text); // test123
```
