QUnit.test("qunit test", function (assert) {
    assert.ok(1 == "1", "OK");
});

QUnit.test("encode string: empty string", function (assert) {
    assert.ok($d.encodeBase62('') === "", "OK");
});

QUnit.test("encode string: false", function (assert) {
    assert.ok($d.encodeBase62(false) === "", "OK");
});

QUnit.test("encode string: undefined", function (assert) {
    assert.ok($d.encodeBase62(undefined) === "", "OK");
});

QUnit.test("encode string: no parameter", function (assert) {
    assert.ok($d.encodeBase62() === "", "OK");
});

QUnit.test("encode string: null", function (assert) {
    assert.ok($d.encodeBase62(null) === "", "OK");
});

QUnit.test("encode string: test123", function (assert) {
    assert.ok($d.encodeBase62('test123') === "T6LpT34oC3", "OK");
});

// length == 9
QUnit.test("encode string: testValue", function (assert) {
    var str = "testValue";
    var enc = $d.encodeBase62('testValue');
    var dec = $d.decodeBase62(enc);
    assert.equal(enc, "T6LpT5PXR7Lb", "OK");
    assert.equal(enc, enc, "OK");
});

testBytes();

QUnit.test("decode string", function (assert) {
    assert.ok($d.decodeBase62('T6LpT34oC3') === "test123", "OK");
});

test256();

function testBytes() {

    var bytes1 = [0x53, 0xFE, 0x92];
    var s1 = $d.encodeBase62ToString(bytes1);

    QUnit.test("encode arrray to string", function (assert) {
        assert.ok(s1 === 'Kzya2', "OK");
    });

    var bytes = [116, 32, 8, 99, 100, 232, 4, 7];

    // T208OsJe107
    var s = $d.encodeBase62ToString(bytes);

    QUnit.test("encode arrray to string", function (assert) {
        assert.ok(s === 'T208OsJe107', "OK");
    });

    var arr = $d.decodeBase62ToArray(s);

    QUnit.test("decode string to array", function (assert) {
        assert.ok(arr.toString() === bytes.toString(), "OK");
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

    QUnit.test("encode/decode 0-255", function (assert) {
        assert.ok(boolReturn, "OK");
    });
}

testCyrillicCharacters();

function testCyrillicCharacters() {
    var source = 'пример текста на кириллице';
    var enc = $d.encodeBase62(source);
    var dec = $d.decodeBase62(enc);

    QUnit.test("encode/decode cyrillic characters", function (assert) {
        assert.ok(source === dec, "OK");
    });
}

testBase64EncodeDecode();

function testBase64EncodeDecode() {
    var source = 'пример текста на кириллице';
    console.log("base64url source: " + source);

    var enc = $d.encodeBase64url(source);
    console.log("base64url encoded: " + enc);

    QUnit.test("encode base64url cyrillic", function (assert) {
        assert.ok(enc === '0L_RgNC40LzQtdGAINGC0LXQutGB0YLQsCDQvdCwINC60LjRgNC40LvQu9C40YbQtQ', "OK");
    });

    var dec = $d.decodeBase64url(enc);
    console.log("base64url decoded: " + dec);

    QUnit.test("decode base64url cyrillic", function (assert) {
        assert.ok(source === dec, "OK");
    });

    var source2 = 'test123öäüÿ';
    console.log("base64url source: " + source2);

    var enc2 = $d.encodeBase64url(source2);
    console.log("base64url encoded: " + enc2);

    QUnit.test("encode base64url", function (assert) {
        assert.ok(enc2 === 'dGVzdDEyM8O2w6TDvMO_', "OK");
    });

    var dec2 = $d.decodeBase64url(enc2);
    console.log("base64url decoded: " + dec2);

    QUnit.test("decode base64url", function (assert) {
        assert.ok(source2 === dec2, "OK");
    });
}
