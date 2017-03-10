test("qunit test", function () {
    ok(1 == "1", "OK");
});

test("encode string: empty string", function () {
    ok($d.encodeBase62('') === "", "OK");
});

test("encode string: false", function () {
    ok($d.encodeBase62(false) === "", "OK");
});

test("encode string: undefined", function () {
    ok($d.encodeBase62(undefined) === "", "OK");
});

test("encode string: no parameter", function () {
    ok($d.encodeBase62() === "", "OK");
});

test("encode string: null", function () {
    ok($d.encodeBase62(null) === "", "OK");
});

test("encode string: test123", function () {
    ok($d.encodeBase62('test123') === "T6LpT34oC3", "OK");
});

testBytes();

test("decode string", function () {
    ok($d.decodeBase62('T6LpT34oC3') === "test123", "OK");
});

test256();

function testBytes() {

    var bytes1 = [0x53, 0xFE, 0x92];
    var s1 = $d.encodeBase62ToString(bytes1);

    test("encode arrray to string", function () {
        ok(s1 === 'Kzya2', "OK");
    });

    var bytes = [116, 32, 8, 99, 100, 232, 4, 7];

    // T208OsJe107
    var s = $d.encodeBase62ToString(bytes);

    test("encode arrray to string", function () {
        ok(s === 'T208OsJe107', "OK");
    });

    var arr = $d.decodeBase62ToArray(s);

    test("decode string to array", function () {
        ok(arr.toString() === bytes.toString(), "OK");
    });

}

function test256() {
    var str256 = '';
    for (var i = 0; i <= 255; i++) {
        str256 += String.fromCharCode(i);
    }

    var strB62 = $d.encodeBase62(str256);
    //console.log(strB62);

    var strData = $d.decodeBase62(strB62);
    //console.log(strData);

    var boolReturn = (strData === str256);

    test("encode/decode 0-255", function () {
        ok(boolReturn, "OK");
    });
}

testCyrillicCharacters();

function testCyrillicCharacters() {
    var source = 'пример текста на кириллице';
    var enc = $d.encodeBase62(source);
    var dec = $d.decodeBase62(enc);

    test("encode/decode cyrillic characters", function () {
        ok(source === dec, "OK");
    });
}

testBase64EncodeDecode();

function testBase64EncodeDecode() {
    var source = 'пример текста на кириллице';
    //console.log("base64url source: " + source);

    var enc = $d.encodeBase64url(source);
    //console.log("base64url encoded: " + enc);

    var dec = $d.decodeBase64url(enc);
    //console.log("base64url decoded: " + dec);

    test("encode/decode base64url", function () {
        ok(source === dec, "OK");
    });
}
