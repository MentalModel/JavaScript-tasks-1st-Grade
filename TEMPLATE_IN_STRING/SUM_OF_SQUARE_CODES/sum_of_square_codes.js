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

function find_for_template_in_string(string, template)
{
	var results = new Array();
	var length_of_template = template.length, length_of_string = string.length;
	var start = 0, finish = length_of_template - 1, paradoxes = 0, similarity = 0;
	var hash_sum_of_template = count_the_sum_of_square_codes_of_string(template, length_of_template);
	var hash_sum_of_string = count_the_sum_of_square_codes_of_string(string, length_of_template);
	
	while (finish < length_of_string)
	{
		if (hash_sum_of_template == hash_sum_of_string) 
		{
			if (string.substring(start, finish + 1) != template) paradoxes++; 
			else 
			{
				found_positions_of_template.push(start);
				similarity++;
			}
		}
		start++; finish++;
		hash_sum_of_string += string.charCodeAt(finish) * string.charCodeAt(finish) - string.charCodeAt(start - 1) * string.charCodeAt(start - 1);
	}
	
	results["paradoxes"] = paradoxes;
	results["similarity"] = similarity;
	
	return results;
}

function count_the_sum_of_square_codes_of_string(string, max_side)
{
	var sum_of_codes = 0;	
	for (var index = 0; index < max_side; index++)
		sum_of_codes += string.charCodeAt(index) * string.charCodeAt(index);
	return sum_of_codes;
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
	WSH.echo("This algorithm is HASH SUM.");
	var template_for_search = read_data_from_file(WSH.Arguments(0));
	var string = read_data_from_file(WSH.Arguments(1));
	
	WSH.echo('Template to search for: ', template_for_search);
	
	var start_time = new Date();
	var results = find_for_template_in_string(string, template_for_search);
	var finish_time = new Date();
	
	print_results();
	WSH.echo("Time to find for templates: ", finish_time - start_time);
	WSH.echo("THE NUMBER OF PARADOXES: ", results["paradoxes"], " WITH FOUND SIMILARITY: ", results["similarity"]);
}

main();