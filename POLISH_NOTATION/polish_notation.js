var operations_priority = new Array();
operations_priority["("] = 0;
operations_priority[")"] = 1;
operations_priority["-"] = 2;
operations_priority["+"] = 2;
operations_priority["*"] = 3;
operations_priority["/"] = 3;
operations_priority["^"] = 4;

var stack = new Array();


function symbol_is_digit(symbol)
{
	if (symbol >= '0' && symbol <= '9')
		return true;
	return false;
}

function symbol_is_number(symbol)
{
	if (symbol_is_digit(symbol) || symbol == '.')
		return true;
	return false;
}

function check_for_errors_in_expression()
{
	var last_element_of_stack = stack[stack.length - 1];
	if (symbol_is_digit(last_element_of_stack) || last_element_of_stack == ')' || last_element_of_stack == '(') 
		abort_program();
}

function check_for_bracket_error()
{
	var last_element_of_stack = stack[stack.length - 1];
	if (last_element_of_stack != '(') abort_program();
}

function abort_program()
{
	WSH.echo("Error!"); 
	WScript.Quit(); 
}

function create_reverse_polish_notation(expression)
{
	var result_polish_notation = new String();
	var index = 0;
	var length_of_expression = expression.length;
	
	while (index < length_of_expression)
	{
		var symbol = expression.charAt(index);
		
		if (symbol_is_digit(symbol))
		{
			var forming_number = symbol;
			symbol = expression.charAt(++index);
			while (symbol_is_number(symbol))
			{
				forming_number += symbol;
				symbol = expression.charAt(++index); 
			}
			--index;
			result_polish_notation += forming_number;
			result_polish_notation += ' ';  
		}
		else if (symbol == '(') stack.push(symbol); 
		else if (symbol == ')') 
		{
			while (stack[stack.length - 1] != '(' && stack.length >= 1)
				result_polish_notation += stack.pop() + ' '; 
			check_for_bracket_error()
			stack.pop(); 
		}
		else if (operations_priority[symbol] > 1)
		{
			if (symbol == '^') 
			{
				while (operations_priority[symbol] < operations_priority[stack[stack.length - 1]]) 
					result_polish_notation += stack.pop() + ' ';		
			} 
			else
			{
				while (operations_priority[symbol] <= operations_priority[stack[stack.length-1]])
					result_polish_notation += stack.pop() + ' ';
			}
			stack.push(symbol); 
		}
		++index; 
	}
	
	while (stack[stack.length - 1])
	{
		check_for_errors_in_expression();
		result_polish_notation += stack.pop() + ' ';
	}
	return result_polish_notation;
}

function count_expression(polish_notation_string)
{
	var result_of_expression = 0;
	var index = 0, position_in_stack = 0;
	var length_of_string = polish_notation_string.length;
	
	while (index < length_of_string)
	{
		var current_symbol = polish_notation_string.charAt(index);  
		var forming_number = new String();
		
		if (current_symbol == ' ') ++index; 
		else if (symbol_is_digit(current_symbol)) 
		{
			forming_number += current_symbol;
			current_symbol = polish_notation_string.charAt(++index); 
			while (symbol_is_number(current_symbol))
			{
				forming_number += current_symbol;
				current_symbol = polish_notation_string.charAt(++index);
			}
			stack[position_in_stack++] = parseFloat(forming_number);
		}
		else
		{
			var result_of_operation = 0;
			switch (current_symbol)
			{
				case '+': 
					result_of_operation = stack[position_in_stack - 1] + stack[position_in_stack - 2];
					break ; 
				case '-': 
					result_of_operation = stack[position_in_stack - 2] - stack[position_in_stack - 1];
					break;
				case '/':
					result_of_operation = stack[position_in_stack - 2] / stack[position_in_stack - 1]; 
					break;
				case '*':
					result_of_operation = stack[position_in_stack - 1] * stack[position_in_stack - 2];
					break;
				case '^':
					result_of_operation = Math.pow(stack[position_in_stack - 2], stack[position_in_stack - 1]);
					break;
			}
			stack.pop(); 
			stack[stack.length - 1] = result_of_operation;
			++index; 
			--position_in_stack;	  
		}	 
	}
	return stack[0]; 
}

function main()
{
	var polish_notation_string = create_reverse_polish_notation(WSH.Arguments(0));
	WSH.echo("RESULT STRING: ", polish_notation_string);
	WSH.echo("RESULT: ", count_expression(polish_notation_string));
}

main();