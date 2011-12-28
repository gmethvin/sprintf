/**
 *
 * JavaScript string formatter
 *
 * Copyright (C) 2008-2010 Greg Methvin (greg@methvin.net)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

"use strict";

/**
 * This method allows you to use the string format functionality as a
 * method on the format string. See String.format for documentation.
 */
String.prototype.format = String.prototype.format || function format() {
    return String.format.apply(null, [this].concat(Array.prototype.slice.call(arguments, 0)));
};

/**
 * String.format
 *
 * This function works much like the sprintf function you may be
 * familiar with from languages like C, Perl, PHP, etc. Of those the
 * specification is probably most similar to that of PHP. The function
 * will attempt to coerce the variables given as arguments to the
 * types expected by the conversion specifiers. So, for example, %d
 * can accept a numeric string since it is converted to an integer.
 *
 * The function returns a string resulting from converting the
 * arguments to the proper types and substituting them for the
 * conversion specifiers. If a valid conversion cannot be found or no
 * argument is provided, the specifier is ignored.
 *
 * Format specifiers:
 *   %% - percent sign
 *   %b - binary number
 *   %c - character for the ascii value
 *   %d - signed decimal number
 *   %e - exponential notation
 *   %E - uppercase exponential notation
 *   %f - floating point number
 *   %o - octal number
 *   %s - string
 *   %x - hexadecimal number (lowercase)
 *   %X - hexadecimal number (uppercase)
 *
 * Additional format values (between % and format letter, in order)
 *   + - display sign for both positive and negative values
 *   0, (space) or '[character] - use zero, space or character as padding
 *   [0-9] - minimum width of the value
 *   .[0-9] - number of decimal digits or maximum string length
 *
 * Forced conversions: Arguments are converted to the type given in
 * the conversion specifier, regardless of the original type. For
 * integer and floating-point conversions, parseInt and parseFloat are
 * used to convert the arguments before processing.
 *
 * Argument swapping: For parameters matching the above specification,
 * the nth format specifier passed in the arguments refers to the nth
 * parameter. To refer specifically to the nth parameter, we can add a
 * n$ after the %, e.g. %2$s would refer to the 2nd parameter, treated
 * as a string. It is possible (though not recommended) to use this
 * with standard ordered parameter referencing; in that case, we do
 * not include the explicitly numbered conversion specifiers in
 * determining which argument should be used.
 *
 * Named parameters are also supported. If a plain object or array is
 * passed as the first parameter, then it is assumed you want to use
 * named parameters, and the properties of the object can be accessed
 * using %{param_name}[format], where [format] are the normal format
 * specifiers, including additional format values described above. If
 * we pass an array, we can also access the (n-1)th element of the
 * array with %n$[format], similar to above.
 */
String.format = function (str, params) {
    if (str == null) {
        return str;
    }
    params = arguments.length > 1 ? params : [];  
    if (typeof params !== 'object' ||
        !Object.prototype.toString.call(params).match(/^\[object (Object|Array)\]$/i)) {
        params = Array.prototype.slice.call(arguments, 1);
    }
    var conversions = String.format.conversions;
    var pattern = /%%|%((\d+)\$|\{(\w+)\})?((\+| )?(0|\'(.))?(\-)?(\d+)?(\.(\d+)?)?([scbdeEfoxX]))?/g;
    var i = 0;

    return String(str).replace(pattern, function () {
        var args = arguments, arg;
        if (args[1]) {
            arg = params[args[3] ? args[3] : parseInt(args[2]) - 1];
        } else {
            arg = params[i];
            i += !!args[12];
        }

        var spec = args[12] || (args[1] ? 's' : '%');
        if (!conversions[spec]) {
            return args[0];
        }
        var match = {
            leftAlign: !!args[8],
            sign: parseInt(arg) < 0 ? '-' : args[5] || '',
            padChar: args[6] === '0' ? 0 : args[7] || ' ',
            precision: parseInt(args[11]),
            minLength: parseInt(args[9]),
            value: arg            
        };
        conversions[spec].call(conversions, match);
        
        match.sign = match.sign || '';
        if (typeof match.length === 'undefined') {
            match.length = match.value.length;
        }
        
        var padlen = (match.minLength || 0) - match.length - match.sign.length + 1;
        var pad = new Array(padlen < 0 ? 0 : padlen).join(match.padChar);
        var zeropad = match.padChar === 0;

        return match.leftAlign ?
            match.sign + match.value + (zeropad ? pad.replace(/0/g,' ') : pad) :
            (zeropad ? match.sign + pad : pad + match.sign) + match.value;        
    });
};

String.format.conversions = {
    's': function (m) {
        m.value = String(typeof m.value === 'undefined' ? '' : m.value);
        if (!isNaN(m.precision)) {
            m.value = m.value.substring(0, m.precision);
        }
        m.sign = null;
    },
    'c': function (m) {
        m.value = String.fromCharCode(parseInt(Math.abs(parseInt(m.value))));
        m.sign = null;
    },
    'b': function (m) {
        m.value = String(Math.abs(parseInt(m.value)).toString(2));
        m.sign = null;
    },
    'd': function (m) {
        m.value = String(Math.abs(parseInt(m.value)));
    },
    'e': function (m) {
        if (isNaN(m.precision)) {
            m.precision = 6;
        }
        m.value = String(parseFloat(m.value).toExponential(m.precision)).toLowerCase();
    },
    'E': function (m) {
        this.e(m);
        m.value = m.value.toUpperCase();
    },
    'f': function (m) {
        if (isNaN(m.precision)) {
            m.precision = 6;
        }
        m.value = String(Math.abs(parseFloat(m.value)).toFixed(m.precision));
        m.length = m.value.replace(/\..*$/, '').length;
    },
    'o': function (m) {
        m.value = String(Math.abs(parseInt(m.value)).toString(8));
    },
    'x': function (m) {
        m.value = String(Math.abs(parseInt(m.value)).toString(16)).toLowerCase();
    },
    'X': function (m) {
        this.x(m);
        m.value = m.value.toUpperCase();
    },
    '%': function (m) {
        m.value = '%';
    }
};

/**
 * sprintf
 *
 * We define this function as a shortcut for accessing the String.format function
 */
var sprintf = String.format;