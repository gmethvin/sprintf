
This is a simple JavaScript implementation of the sprintf function. This version
also gives the user the option of passing the arguments as an object with named
parameters rather than as positional parameters.  Parameters can be passed as
either an object, array, or as individual arguments. If passed as an object,
named parameters are supported.

# Usage

You can use this in an object-oriented style by doing something like:

    "%s is %d years old".format('Tom', 28); // Tom is 28 years old

or with the String.format function

    String.format("%s is %s at JavaScript", "Greg", "pro"); // Greg is pro at JavaScript

or with the sprintf function

    sprintf("You made $%4.2f this month", 1337.89); // You made $1337.89 this month

All of these versions also allow you to pass an object and use named properties:

    "%{name}s has $%{balance}.2f in his bank account".format({
        name: 'Greg',
        balance: 77344.2
    }); // Greg has $77344.20 in his bank account

# Conversion specifiers

Conversion specifiers consist of a percent sign (%), followed by any of the
following, in order.

1. Position/name specifier, matching one of the following:

    * {[number]} - use parameter number [number] (zero-indexed).
    * {[name]} - use the parameter of name [name] in the passed object.  This
        only works if the parameters are passed as named parameters in an
        object.
    * [number]$ - use parameter number [number] (one-indexed). This is
        compatible with the "argument swapping" behavior of the PHP
        implementation.
    * (empty) - use the next parameter as the argument. Equivalent to {n},
        where n is the number of empty conversion specifiers preceding this one
        in the format string.

2. Sign specifier (+): Force + sign on positive numbers.

3. Padding specifier ((space), 0, or '[character]): Use spaces, zeroes or the
character following the single quote as padding. Default is spaces.

4. Alignment specifier (-): left-justify values instead of right-justifying
them.

5. Width specifier ([digits]): The minimum number of characters this conversion
should result in. In float conversions, the number before the decimal point.

6. Precision specifier (.[digits]): The maximum number of characters in a
string, or the number of characters after the decimal point in a number.

7. Type specifier:

    * % - insert a percent character
    * b - display as a binary integer
    * c - display as the character represented by the number
    * d - display as a decimal integer
    * e - display the argument as a floating-point number in scientific notation
    * E - uppercase version of %e
    * f - display as a floating point number
    * F - uppercase version of %f
    * o - display as an octal number
    * s - display the argument as a string
    * x - display as a hexidecimal number
    * X - uppercase version of %x

