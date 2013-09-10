test("qunit test", function() {
    ok(1 == "1", "OK");
});

test("encode string: empty string", function() {
    ok($.encodeBase62('') === "", "OK");
});

test("encode string: false", function() {
    ok($.encodeBase62(false) === "", "OK");
});

test("encode string: undefined", function() {
    ok($.encodeBase62(undefined) === "", "OK");
});

test("encode string: no parameter", function() {
    ok($.encodeBase62() === "", "OK");
});

test("encode string: null", function() {
    ok($.encodeBase62(null) === "", "OK");
});

test("encode string: test123", function() {
    ok($.encodeBase62('test123') === "T6LpT34oC3", "OK");
});

testBytes();

test("decode string", function() {
    ok($.decodeBase62('T6LpT34oC3') === "test123", "OK");
});

test256();

function testBytes()
{
    
    var bytes1 = [0x53, 0xFE, 0x92];
    var s1 = go.string.encodeBase62ToString(bytes1);
    
    test("encode arrray to string", function() {
        ok(s1 === 'Kzya2', "OK");
    });
    
    var bytes = [116, 32, 8, 99, 100, 232, 4, 7];

    // T208OsJe107
    var s = go.string.encodeBase62ToString(bytes);

    test("encode arrray to string", function() {
        ok(s === 'T208OsJe107', "OK");
    });

    var arr = go.string.decodeBase62ToArray(s);

    test("decode string to array", function() {
        ok(arr.toString() === bytes.toString(), "OK");
    });

}

function test256()
{
    var str256 = '';
    for (var i = 0; i <= 255; i++) {
        str256 += String.fromCharCode(i);
    }
    
    var strB62 = go.string.encodeBase62(str256);
    //console.log(strB62);

    var strData = go.string.decodeBase62(strB62);
    //console.log(strData);

    var boolReturn = (strData === str256);
    
    test("encode/decode 0-255", function() {
        ok(boolReturn, "OK");
    });
}
