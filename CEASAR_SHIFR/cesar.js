var file_system_object = new ActiveXObject("Scripting.FileSystemObject")
var alphabet_using = new String("àáâãäå¸æçèéêëìíîïðñòóôõö÷øùúûüýþÿ ");
var alphabet_length = alphabet_using.length;

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

function to_code_message_using_shifr_of_cesar(shift, string)
{
	var string_length = string.length; 
	var coded_message = new String();  
	
	for (var index = 0; index < string_length; index++)
	{
		if (alphabet_using.indexOf(string.charAt(index) < 0))
			coded_message += string.charAt(index); 
		else
			coded_message += alphabet_using.charAt((alphabet_using.indexOf(string.charAt(index)) - shift + alphabet_length) % alphabet_length);
	} 
	return coded_message;
}

function delete_symbols_which_does_not_contain_using_alphabet(string) 
{
	var new_string = new String();
	var length_of_string = string.length;
	
	for (var index = 0 ; index < length_of_string; ++index) 
		if (alphabet_using.indexOf(string.charAt(index)) >= 0) 
			new_string += string.charAt(index);
			
	return new_string;
}

function to_decode_message(shift, string)
{
	var decoded_message = new String();
	var string_length = string.length; 
	
	for (var index = 0; index < string_length; index++)
	{
		if (string.charAt(index) != ' ')
			decoded_message += alphabet_using.charAt((alphabet_using.indexOf(string.charAt(index)) + shift) % alphabet_length);
		else 
			decoded_message += ' ';
	} 
	return decoded_message;
}

function search_for_shift(global_frequency_of_alphs_table, local_frequency_of_alphas_table, coded_string) 
{
	var result_shift = 0;
	var minsum_of_shift = 1.1; 
	
	for(var shift_temp = 0; shift_temp < alphabet_length; shift_temp++) 
	{
		var sum_of_shift = 0.0;
		for(var index = 0; index < alphabet_length; index++) 
		{
			var position = (index + shift_temp) % alphabet_length;
			sum_of_shift += Math.pow(global_frequency_of_alphs_table[alphabet_using.charAt(position)] - local_frequency_of_alphas_table[alphabet_using.charAt(index)], 2);
		}
		if (sum_of_shift < minsum_of_shift) 
		{
			minsum_of_shift = sum_of_shift;
			result_shift = shift_temp;
		}
	}
	return result_shift;
}

function create_table_of_frequency_of_string(string)
{
	var table_of_frequency = new Array();
	var length_of_string = string.length;
	var new_string = delete_symbols_which_does_not_contain_using_alphabet(string);  
	
	for (var index = 0; index < alphabet_length; index++)
		table_of_frequency[alphabet_using.charAt(index)] = 0; 
	
	for (var index = 0; index < length_of_string; index++)
		table_of_frequency[string.charAt(index)]++; 
	
	for (var index = 0; index < alphabet_length; index++)
		table_of_frequency[alphabet_using.charAt(index)] /= length_of_string;
		
	return table_of_frequency;	
}

function main()
{
	var text_to_create_global_frequency_table = read_data_from_file("example_text.txt").toLowerCase();
	var global_frequency_of_alphs_table = new Array();
	var local_frequency_of_alphas_table = new Array();
	var coded_string_using_cesar_shifr = new String;
	var founded_shift;
	
	var string_to_code = WScript.Arguments(0).toLowerCase();
	var shift_to_code = WScript.Arguments(1);
	
	coded_string_using_cesar_shifr = to_code_message_using_shifr_of_cesar(shift_to_code, string_to_code);
	WSH.echo("Coded string using Cesar shifr:", coded_string_using_cesar_shifr);
	
	local_frequency_of_alphas_table = create_table_of_frequency_of_string(coded_string_using_cesar_shifr);
	global_frequency_of_alphs_table = create_table_of_frequency_of_string(text_to_create_global_frequency_table);
	founded_shift = search_for_shift(global_frequency_of_alphs_table, local_frequency_of_alphas_table, coded_string_using_cesar_shifr);
	
	WSH.echo("Founded shift: ", founded_shift);
	WSH.echo("Decoded string: ", to_decode_message(founded_shift, coded_string_using_cesar_shifr));
}

main();