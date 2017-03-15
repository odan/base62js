/**
 * Base62 Encoding JavaScript implementation
 *
 * @author odan (https://github.com/odan)
 * @license: MIT
 *
 * Thanks to: renmengye
 * https://github.com/renmengye/base62-csharp
 *
 * @example
 *
 * // encode
 * var strBase62 = $d.encodeBase62('test123');
 * console.log(strBase62);
 *
 * // decode
 * var strText = $d.decodeBase62(strBase62);
 * console.log(strText);
 *
 */

// Namespace stuff
if (!$d) {
    var $d = {};
}


/**
 * Utility that read and write bits in byte array
 * @param {type} options
 * @returns {BitStream}
 */
$d.BitStream = function BitStream(options) {
    this.Source = [];

    if (typeof options === 'object') {
        // Initialize the stream with a source byte array
        this.Source = options;
    }

    if (typeof options === 'number') {
        // Initialize the stream with capacity
        var dim = Math.floor(options);
        this.Source = new Array(dim);
    }

    // Bit position of the stream
    this.Position = 0;

    /**
     * Bit length of the stream
     * @returns {Number|@pro;length@this.Source}
     */
    this.Length = function () {
        return this.Source.length * 8;
    };

    /**
     * Read the stream to the buffer
     * @param {Array} buffer Buffer
     * @param {integer} offset Offset bit start position of the stream
     * @param {integer} count Number of bits to read
     * @returns {integer} Number of bits read
     */
    this.Read = function (buffer, offset, count) {
        // Temporary position cursor
        var tempPos = this.Position;
        tempPos += offset;
        // Buffer byte position and in-byte position
        var readPosCount = 0;
        var readPosMod = 0;
        // Stream byte position and in-byte position
        var posCount = tempPos >> 3;
        var posMod = (tempPos - ((tempPos >> 3) << 3));
        while (tempPos < this.Position + offset + count && tempPos < this.Length()) {
            // Copy the bit from the stream to buffer
            if (((this.Source[posCount]) & (0x1 << (7 - posMod))) != 0) {
                buffer[readPosCount] = ((buffer[readPosCount]) | (0x1 << (7 - readPosMod)));
            } else {
                buffer[readPosCount] = ((buffer[readPosCount]) & (0xffffffff - (0x1 << (7 - readPosMod))));
            }

            // Increment position cursors
            tempPos++;
            if (posMod == 7) {
                posMod = 0;
                posCount++;
            } else {
                posMod++;
            }
            if (readPosMod == 7) {
                readPosMod = 0;
                readPosCount++;
            } else {
                readPosMod++;
            }
        }
        var bits = (tempPos - this.Position - offset);
        this.Position = tempPos;
        return bits;
    };

    /**
     * Set up the stream position
     * @param {integer} offset Position
     * @param {integer} origin Position origin
     * @returns {integer} Position after setup
     */
    this.Seek = function (offset, origin) {
        switch (origin) {
            case (1):
                /*SeekOrigin.Begin*/
            {
                this.Position = offset;
                break;
            }
            case (2):
                /*SeekOrigin.Current*/
            {
                this.Position += offset;
                break;
            }
            case (3):
                /*SeekOrigin.End*/
            {
                this.Position = this.Length() + offset;
                break;
            }
        }
        return this.Position;
    };

    /**
     * Write from buffer to the stream
     * @param {type} buffer
     * @param {type} offset Offset start bit position of buffer
     * @param {type} count
     * @returns {undefined} Number of bits
     */
    this.Write = function (buffer, offset, count) {
        // Temporary position cursor
        var tempPos = this.Position;
        // Buffer byte position and in-byte position
        var readPosCount = offset >> 3,
            readPosMod = offset - ((offset >> 3) << 3);
        // Stream byte position and in-byte position
        var posCount = tempPos >> 3;
        var posMod = (tempPos - ((tempPos >> 3) << 3));
        while (tempPos < this.Position + count && tempPos < this.Length()) {
            // Copy the bit from buffer to the stream
            if (((buffer[readPosCount]) & (0x1 << (7 - readPosMod))) != 0) {
                this.Source[posCount] = ((this.Source[posCount]) | (0x1 << (7 - posMod)));
            } else {
                this.Source[posCount] = ((this.Source[posCount]) & (0xffffffff - (0x1 << (7 - posMod))));
            }

            // Increment position cursors
            tempPos++;
            if (posMod == 7) {
                posMod = 0;
                posCount++;
            } else {
                posMod++;
            }
            if (readPosMod == 7) {
                readPosMod = 0;
                readPosCount++;
            } else {
                readPosMod++;
            }
        }
        this.Position = tempPos;
    };
};


/**
 * Base62 Coding Space
 * @type String
 */
$d.Base62CodingSpace = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Convert a byte array
 * @param {String} original Byte array
 * @returns {unresolved} Base62 string
 */
$d.encodeBase62ToString = function encodeBase62ToString(original) {
    var sb = []; // new StringBuilder();
    var stream = new $d.BitStream(original); // Set up the BitStream
    var read = []; // Only read 6-bit at a time
    read.push(0);

    while (true) {
        read[0] = 0;

        var length = stream.Read(read, 0, 6); // Try to read 6 bits
        if (length == 6) // Not reaching the end
        {
            if ((read[0] >> 3) == 0x1f) // First 5-bit is 11111
            {
                sb.push($d.Base62CodingSpace.charAt(61));
                stream.Seek(-1, 2 /*SeekOrigin.Current*/); // Leave the 6th bit to next group
            } else if ((read[0] >> 3) == 0x1e) // First 5-bit is 11110
            {
                sb.push($d.Base62CodingSpace.charAt(60));
                stream.Seek(-1, 2 /*SeekOrigin.Current*/);
            } else // Encode 6-bit
            {
                sb.push($d.Base62CodingSpace.charAt((read[0] >> 2)));
            }
        } else if (length == 0) {
            // Reached the end completely
            break;
        } else {
            // Padding 0s to make the last bits to 6 bit
            sb.push($d.Base62CodingSpace.charAt((read[0] >> (8 - length))));
            break;
        }
    }
    var str = sb.join('');
    return str;
};

/**
 * Convert a Base62 string to byte array
 * @param {type} base62 Base62 string
 * @returns {Array} Byte array
 */
$d.decodeBase62ToArray = function decodeBase62ToArray(base62) {
    // Character count
    var count = 0;

    // Set up the BitStream
    var stream = new $d.BitStream(base62.length * 6 / 8);
    var len = base62.length;
    for (var i = 0; i < len; i++) {

        var c = base62.charAt(i);
        // Look up coding table
        var index = $d.Base62CodingSpace.indexOf(c);

        // If end is reached
        if (count == base62.length - 1) {
            // Check if the ending is good
            var mod = (stream.Position % 8);

            if (mod == 0) {
                // InvalidDataException
                throw new Error("An extra character was found");
            }
            if ((index >> (8 - mod)) > 0) {
                // InvalidDataException
                throw new Error("Invalid ending character was found");
            }

            stream.Write([(index << (mod))], 0, 8 - mod);
        } else {
            // If 60 or 61 then only write 5 bits to the stream, otherwise 6 bits.
            if (index == 60) {
                //stream.Write(new byte[] { 0xf0 }, 0, 5);
                stream.Write([0xf0], 0, 5);
            } else if (index == 61) {
                stream.Write([0xf8], 0, 5);
            } else {
                stream.Write([index], 2, 6);
            }
        }
        count++;
    }

    // Dump out the bytes
    var result = new Array(stream.Position / 8);
    stream.Seek(0, 1 /* SeekOrigin.Begin*/);
    stream.Read(result, 0, result.length * 8);
    return result;
};

$d.encodeUtf8 = function (s) {
    return unescape(encodeURIComponent(s));
}

$d.decodeUtf8 = function (s) {
    return decodeURIComponent(escape(s));
}

/**
 * Encodes data with base62
 * @param {String} str The data to encode.
 * @returns {String}
 */
$d.encodeBase62 = function encodeBase62(str) {

    if (typeof str !== 'string' || str === '') {
        return '';
    }

    str = $d.encodeUtf8(str.toString());

    var bytes = [];
    var len = str.length;
    for (var i = 0; i < len; i++) {
        bytes.push(str.charCodeAt(i));
    }
    return this.encodeBase62ToString(bytes);
};

/**
 * Decodes a base62 encoded data.
 * @param {String} str
 * @returns {String} Returns the original data or false on failure.
 * The returned data may be binary.
 */
$d.decodeBase62 = function decodeBase62(str) {

    if (typeof str !== 'string' || str === '') {
        return '';
    }

    str = str.toString();

    var bytes = this.decodeBase62ToArray(str);
    var sb = [];
    var len = bytes.length;

    for (var i = 0; i < len; i++) {
        sb.push(String.fromCharCode(bytes[i]));
    }
    str = sb.join('');
    str = $d.decodeUtf8(str);

    return str;
};

/**
 * Encode base64 url.
 *
 * @param str
 * @returns {string}
 */
$d.encodeBase64url = function (str) {
    str = $d.encodeUtf8(str);
    str = window.btoa(str);
    str = str.replace(/\+/g, '-');
    str = str.replace(new RegExp('/', 'g'), '_');
    var result = str.replace(new RegExp('=', 'g'), '');
    return result;
};

/**
 * Decode Base64 url.
 *
 * @param str
 * @returns {string}
 */
$d.decodeBase64url = function (str) {
    var padding = new Array(4 - (str.length % 4)).join("=");
    str = str.replace(new RegExp('-', 'g'), '+');
    str = str.replace(new RegExp('_', 'g'), '/');
    var result = window.atob(str);
    result = $d.decodeUtf8(result);
    return result;
};

/**
 * jQuery Plugin - Base62 Encoding
 *
 * @example
 * var strBase62 = $.encodeBase62('test123');
 * var strText = $.decodeBase62(strBase62);
 */
(function ($) {

    /**
     * Encodes data with base62.
     *
     * @param {String} str The data to encode.
     * @returns {String}
     */
    $.encodeBase62 = function encodeBase62(str) {
        return $d.encodeBase62(str);
    };

    /**
     * Decodes a base62 encoded data.
     *
     * @param {String} str
     * @returns {String} Returns the original data or false on failure.
     * The returned data may be binary.
     */
    $.decodeBase62 = function decodeBase62(str) {
        return $d.decodeBase62(str);
    };

    /**
     * Encodes data with base64url.
     *
     * @param {String} str The data to encode.
     * @returns {String}
     */
    $.encodeBase64url = function encodeBase64url(str) {
        return $d.encodeBase64url(str);
    };

    /**
     * Decodes a base64url encoded data.
     *
     * @param {String} str
     * @returns {String} Returns the original data or false on failure.
     * The returned data may be binary.
     */
    $.decodeBase64url = function decodeBase64url(str) {
        return $d.decodeBase64url(str);
    };

})(jQuery);