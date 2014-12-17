var MANTISS_SIZE = 23
var IEEE754_ORDER_SHIFT = 127
var IEEE754_ORDER_LENGTH = 8

function integer_to_binary_representation(number)
{
	var binary_representation = new String();
	while (number > 0)
	{
		var last_from_division = number % 2 ;
		binary_representation = last_from_division + binary_representation;
		number = (number - last_from_division) / 2;
	}
	return binary_representation;
}

function fraction_to_binary_representation(fraction)
{
	var binary_representation = new String("0,");
	while (fraction > 0) 
	{
		fraction = fraction * 2;
		if (fraction >= 1) 
		{
			fraction--;
			binary_representation += '1';
		} 
		else binary_representation += '0';
	}
	return binary_representation;
}

function number_to_binary_representation(number)
{
	var sign = '+';
	if (number == 0) return '+0';
	if (number < 0)
	{
		sign = '-';
		number = Math.abs(number);
	}
	var decimal_part = Math.floor(number);
	if (decimal_part == 0)
		return sign + fraction_to_binary_representation(number);
	else 
	if (number - decimal_part == 0)
		return sign + integer_to_binary_representation(decimal_part);
	return sign + integer_to_binary_representation(decimal_part) + fraction_to_binary_representation(number - decimal_part).substring(1);
}

function get_order_of_binary_number(binary_representation_with_sign)
{
	binary_representation = binary_representation_with_sign.substring(1); // delete sign 
	var comma_position = binary_representation.indexOf(',');
	if (comma_position > 0)			// 111,0101   0,01
	{
		if (comma_position == 1) 	// 1.111 or 0.000111
		{
			if (binary_representation.charAt(0) != '0')		// 1.111
			{	
				return comma_position - 1;
			}
			return comma_position - binary_representation.indexOf('1');
		}
		return comma_position - 1;
	}
	else
	{
		if (binary_representation != '0')
			return binary_representation.length - 1;
		return 0;
	}
}

function transform_binary_representation_to_scientific_form(binary_representation_with_sign)
{
	binary_representation = binary_representation_with_sign.substring(1); // delete sign 
	var comma_position = binary_representation.indexOf(',');
	if (comma_position > 0)			// 111,0101   0,01
	{
		if (comma_position == 1) 	// 1.111 or 0.000111
		{
			if (binary_representation.charAt(0) != '0')		// 1.111
			{	
				return binary_representation.substring(2);
			}
			return binary_representation.substring(binary_representation.indexOf('1') + 1);
		}
		return binary_representation.replace(',', '').substring(1);
	}
	else
	{
		if (binary_representation != '0')
			return binary_representation.substring(1);
		return '0';
	}

}

function to_form_mantissa_of_the_number(binary_representation_with_sign)
{
	var result_string = transform_binary_representation_to_scientific_form(binary_representation_with_sign);
	return put_optional_null_to_mantiss_size(result_string);
}

function to_form_order_of_the_number(binary_representation_with_sign)
{
	var order = number_to_binary_representation(get_order_of_binary_number(binary_representation_with_sign) + IEEE754_ORDER_SHIFT);
	order = order.substring(1);		// delete sign
	return put_optional_null_to_order_size(order);
}

function put_optional_null_to_mantiss_size(string)
{
	if (string.length >= MANTISS_SIZE)
		return string.substring(0, MANTISS_SIZE);
	while (string.length < MANTISS_SIZE)
		string += '0';
	return string
}

function put_optional_null_to_order_size(string)
{
	if (string.length == IEEE754_ORDER_LENGTH)
		return string;
	while (string.length < IEEE754_ORDER_LENGTH)
		string = '0' + string;
	return string
}

function transform_to_IEEE754_format(number)
{
	var sign = '1'
	if (number >= 0) sign = '0'
	var binary_representation_with_sign = number_to_binary_representation(number);
	var order = to_form_order_of_the_number(binary_representation_with_sign);
	var mantissa = to_form_mantissa_of_the_number(binary_representation_with_sign);
	return sign + ' ' + order + ' ' + mantissa;
}

function get_number_from_sign(sign)
{
	if (sign == '+') return 0;
	return 1;
}

function addition_two_numbers_with_similar_orders(x_mantissa, y_mantissa, similar_order, sign, flag)
{
	var res_mantissa = add_two_big_mantisses(x_mantissa, y_mantissa, flag);
	var new_order = number_to_binary_representation(similar_order + IEEE754_ORDER_SHIFT).substring(1);
	new_order = put_optional_null_to_order_size(new_order);
	return sign + new_order + res_mantissa; 
}

function shift_mantisses_to_equal_position(shift, mantissa)
{
	mantissa = '1' + mantissa;
	for (var index = 0; index < shift - 1; index++)
		mantissa = '0' + mantissa;
	return mantissa.substr(0, MANTISS_SIZE);
}

function add_two_numbers_IEEE754(x, y)
{
	var result_sum = new String();
	
	var x_bin_rep = number_to_binary_representation(x);
	var x_order = get_order_of_binary_number(x_bin_rep);

	var y_bin_rep = number_to_binary_representation(y);
	var y_order = get_order_of_binary_number(y_bin_rep);
	
	if (x_order == y_order)
		return addition_two_numbers_with_similar_orders(to_form_mantissa_of_the_number(x_bin_rep), 
														to_form_mantissa_of_the_number(y_bin_rep), x_order + 1, get_number_from_sign(x_bin_rep.charAt(0)), true);
	if (x_order < y_order)
	{
		var new_mantissa = shift_mantisses_to_equal_position(y_order - x_order, to_form_mantissa_of_the_number(x_bin_rep));
		return addition_two_numbers_with_similar_orders(new_mantissa, to_form_mantissa_of_the_number(y_bin_rep), y_order, get_number_from_sign(x_bin_rep.charAt(0)), false);
	}
	else
	{
		var new_mantissa = shift_mantisses_to_equal_position(x_order - y_order, to_form_mantissa_of_the_number(y_bin_rep));
		return addition_two_numbers_with_similar_orders(to_form_mantissa_of_the_number(x_bin_rep), new_mantissa, x_order, get_number_from_sign(x_bin_rep.charAt(0)), false);
	}
}

function add_two_big_mantisses(bin_x, bin_y, was_equal_orders)
{
	var result = new String();
	var optional = 0;
	for (var index = MANTISS_SIZE - 1; index >= 0; --index)
	{
		var temp_sum = (bin_x.charAt(index) * 1 + bin_y.charAt(index) * 1 + optional) % 2;
		result = temp_sum + result;
		if (bin_x.charAt(index) * 1 + bin_y.charAt(index) * 1 + optional >= 2) optional = 1;
		else optional = 0;
	}
	if (was_equal_orders == true) 
		return (10 + optional + result).substring(1, MANTISS_SIZE + 1);
	return result;
}


WSH.echo(add_two_numbers_IEEE754(3.1, 16.07));
WSH.echo(add_two_numbers_IEEE754(17, 3));
WSH.echo(add_two_numbers_IEEE754(17, 22));
//WSH.echo(add_two_numbers_IEEE754(17, 3));
//WSH.echo(add_two_big_mantisses(to_form_mantissa_of_the_number(number_to_binary_representation(17)), add_two_big_mantisses(number_to_binary_representation(22))))


/*
WSH.echo(to_form_mantissa_of_the_number(number_to_binary_representation('13')))
WSH.echo(to_form_mantissa_of_the_number(number_to_binary_representation('-6.75')))
WSH.echo(to_form_mantissa_of_the_number(number_to_binary_representation('0.15625')))
WSH.echo(to_form_mantissa_of_the_number(number_to_binary_representation('1')))
WSH.echo(to_form_mantissa_of_the_number(number_to_binary_representation('0.2')))
/*
function f(x)
{
	WSH.echo("---------------------------------------------------------")
	WSH.echo("number = ",x)
	WSH.echo("bin = ",number_to_binary_representation(x))
	WSH.echo("mantissa = ", transform_binary_representation_to_scientific_form(number_to_binary_representation(x)))
	WSH.echo("---------------------------------------------------------")
}


f(0)
f(0.25)
f(1,25)
f(12)
f(12.25)
*/

/*
WSH.echo(get_order_of_binary_number(number_to_binary_representation(34.25)))

WSH.echo(get_order_of_binary_number(number_to_binary_representation(0.25)))
WSH.echo(get_order_of_binary_number(number_to_binary_representation(1.25)))
WSH.echo(get_order_of_binary_number(number_to_binary_representation(12)))
*/

/*
WSH.echo(transform_to_IEEE754_format('13'))
WSH.echo(transform_to_IEEE754_format('-6.75'))
WSH.echo(transform_to_IEEE754_format('0.15625'))
WSH.echo(transform_to_IEEE754_format('1'))
WSH.echo(transform_to_IEEE754_format('0.2'))
*/