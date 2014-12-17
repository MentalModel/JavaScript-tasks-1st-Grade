var file_system_object = new ActiveXObject("Scripting.FileSystemObject");
var REPEAT_EQUIVALENT = '#';
var ASCII_TABLE = 127;
var MIN_SIDE = 4;
var STR_ASCII_TABLE = String.fromCharCode(ASCII_TABLE);

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

function to_pack_message(message)
{
	var result_message = new String();
	var index = 0;
	var length_of_message = message.length;
		
	while (index < length_of_message)
	{	
		var quantity_of_similar_alphas = 1;
		while (message.charAt(index) == message.charAt(index + quantity_of_similar_alphas)) 
			quantity_of_similar_alphas++;
   
		var current_quantity_of_similar_alphas = quantity_of_similar_alphas;	 
		while (current_quantity_of_similar_alphas >= ASCII_TABLE) 
		{
			result_message += REPEAT_EQUIVALENT + STR_ASCII_TABLE + message.charAt(index) 
			current_quantity_of_similar_alphas -= ASCII_TABLE;
		}
   
		if (current_quantity_of_similar_alphas >= MIN_SIDE) 
			result_message += REPEAT_EQUIVALENT + String.fromCharCode(current_quantity_of_similar_alphas) + message.charAt(index); 
		else
		{
			if (message.charAt(index) == REPEAT_EQUIVALENT) 
				result_message += REPEAT_EQUIVALENT + String.fromCharCode(quantity_of_similar_alphas) + REPEAT_EQUIVALENT;
			else
				result_message += message.slice(index, index + current_quantity_of_similar_alphas);
		}
		index += quantity_of_similar_alphas;
	}
	return result_message;
}

function to_unpack_message(message)
{
	var result_message = new String();
	var length_of_message = message.length;
	
	for (var index = 0; index < length_of_message; index++) 
	{
		if	(message.charAt(index) == REPEAT_EQUIVALENT) 
		{
			var quantity_of_repeating_symbol = message.charCodeAt(++index);		// pointer is on the repeating number of 
			index++;															// symbol at message[index]
			for (var idx = 0; idx < quantity_of_repeating_symbol; ++idx)
				result_message += message.charAt(index);
		} 
		else result_message += message.charAt(index); 
	}
	return result_message;
}

function main()
{
	var data_from_file = read_data_from_file(WSH.Arguments(0));
	WSH.echo("\nMESSAGE FROM FILE: ", data_from_file);
	
	var result_packed_message = to_pack_message(data_from_file);
	WSH.echo("\nPACKED MESSAGE LIKE STANDART RLE: ", result_packed_message);
	
	var result_unpacked_message =  to_unpack_message(result_packed_message);
	WSH.echo("\nUNPACKED MESSAGE LIKE STANDART RLE: ", result_unpacked_message);
	write_data_to_file(result_unpacked_message, WSH.Arguments(1));
}

main();