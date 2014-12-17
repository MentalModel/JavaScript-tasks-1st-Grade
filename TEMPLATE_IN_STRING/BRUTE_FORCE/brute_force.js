var file_system_object = new ActiveXObject("Scripting.FileSystemObject");
var found_positions_of_template = new Array();

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

function find_for_template_in_string_using_brute_force(string, template)
{
	var length_of_template = template.length;
	var max_side_of_search = string.length - length_of_template + 1;
	var index = 0; 
  
	while (index <= max_side_of_search)
	{
		var how_many_symbols_are_similar = 0;
		while (string.charAt(how_many_symbols_are_similar + index) == template.charAt(how_many_symbols_are_similar))
		{
			how_many_symbols_are_similar++;
			if (how_many_symbols_are_similar == length_of_template) 
			{
				found_positions_of_template.push(index);  
				break; 
			}
		}
		index++;
	}
}

function read_database_from_file_and_search_for_template(path_to_file, template)
{
	try
	{
		var file_pointer = file_system_object.OpenTextFile(path_to_file);
		while (!file_pointer.AtEndOfStream)
		{
			var result_string = file_pointer.ReadLine();
			find_for_template_in_string_using_brute_force(result_string, template);
		}
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

function print_results()
{
	var quantity_of_similarity = found_positions_of_template.length;
	found_positions_of_template = found_positions_of_template.reverse();
	
	WSH.echo("The Number of Found words is ", quantity_of_similarity, '.');
	for (var index = 0; index < quantity_of_similarity; index++)
		WSH.echo("Position of ", index," found word is ", found_positions_of_template[index], '.');
}

function main()
{
	WSH.echo("This algorithm is BRUTE FORCE.");
	var template_for_search = read_data_from_file(WSH.Arguments(0));
	WSH.echo('Template to search for: ', template_for_search);
	
	var start_time = new Date();
	read_database_from_file_and_search_for_template(WSH.Arguments(1), template_for_search);
	var finish_time = new Date();
	
	print_results();
	WSH.echo("Time to find for templates: ", finish_time - start_time);
}

main();