var file_system_object = new ActiveXObject("Scripting.FileSystemObject");     
 
function showErrorInfo(e) 
{
	WSH.echo(e);
	WSH.echo("Source of error: ", (e.number >> 16) & 0x1FFF);
	WSH.echo("No of error: ", e.number & 0xFFFF);
	WSH.echo("Description: ", e.description);
}

function try_to_close_source(source_pointer)
{
	try
	{
		source_pointer.Close();
	}
	catch (null_pointer_exception)
	{
		showErrorInfo(null_pointer_exception);
	}
}

function read_data_from_file(path_to_file)
{
	result_string = new String();
	try
	{
		var file_pointer = file_system_object.OpenTextFile(path_to_file);
		result_string = file_pointer.ReadAll();
	}
	catch (some_exception)
	{
		showErrorInfo(some_exception);
	}
	finally
	{
		try_to_close_source(file_pointer)
	}
	return result_string;
}

function write_data_to_file(message_to_write, path_to_file)
{
	try
	{
		var file_pointer = file_system_object.OpenTextFile(path_to_file, 2);
		file_pointer.Write(message_to_write);
	}
	catch (some_exception)
	{
		showErrorInfo(some_exception);
	}
	finally
	{
		try_to_close_source(file_pointer)
	}
}

function make_null_associative_array(array, string)
{
	var length_of_string = string.length 
	for (var string_index = 0; string_index < length_of_string; ++string_index) 
		array[string.charAt(string_index)] = 0;
}

function count_the_frequency_of_symbols_in_string(array, string)
{
	var number_of_zero_repeating = 0;
	var length_of_string = string.length 
	for (var string_index = 0; string_index < length_of_string; ++string_index) 
	{
		if (array[string.charAt(string_index)] == 0) number_of_zero_repeating++;
		array[string.charAt(string_index)]++;
	}
	return number_of_zero_repeating;
}

function count_entropy_of_shannon(array, number_of_zero_repeating, length_of_string)
{
	var sum = 0;
	var log_of_number_of_zero_repeating = Math.log(number_of_zero_repeating);
	for (var alpha in array)
	{
		if (array[alpha] != 0) 
		{
			var k = array[alpha] / length_of_string;  
			sum += k*Math.log(k) / log_of_number_of_zero_repeating;
		}
	}
	return -sum;
}

function main()
{
	var array = new Array();
	
	var data_from_file = read_data_from_file(WSH.Arguments(0));
	WSH.echo("\nMESSAGE FROM FILE: ", data_from_file);
	make_null_associative_array(array, data_from_file);
	var zero_repeating_of_symbols = count_the_frequency_of_symbols_in_string(array, data_from_file);
	var entropy = count_entropy_of_shannon(array, zero_repeating_of_symbols, data_from_file.length);
	WSH.echo("\nENTROPY: ", entropy);
	write_data_to_file(entropy, WSH.Arguments(1));
}

main()