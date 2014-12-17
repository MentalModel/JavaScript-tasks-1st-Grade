function determine_the_alphabet_of_template(template)
{
	var alph = new Array();
	var length_of_template = template.length;
	
	for (var index = 0;index < length_of_template; index++)
		alph[template.charAt(index)] = 0;
	return alph;
}
	
function create_the_table_of_automata(string, length_of_template)
{
	var table_of_automata = new Array(length_of_template + 1);
	for (var index = 0 ; index <= length_of_template; index++)
		table_of_automata[index] = new Array();
	return table_of_automata;
}

function initialize_the_table_of_automata(table_of_automata, alph)
{
	for (var symbol in alph)
		table_of_automata[0][symbol] = 0;
}

function form_the_table_of_moves(table_of_automata, alph, template)
{
	var length_of_template = template.length;
	
	for(var index = 0; index < length_of_template; index++)
	{
		var prefix_of_string = table_of_automata[index][template.charAt(index)]; 				// берем префикс строки  
		table_of_automata[index][template.charAt(index)] = index + 1;	  						// увеличиваем на 1 т к один символ :-)
		for (var symbol in alph)
			table_of_automata[index + 1][symbol] = table_of_automata[prefix_of_string][symbol];  	// он как минимум будет префиксом данной длины, а может быть  и больше
	}
}

function print_the_table_of_moves(table_of_automata, alph, string, template_length)
{
	for(var symbol in alph)
		string += ' ' + symbol;
		
	WSH.echo(string);	
	WSH.echo("_____________________________________");
	
	for(var index = 0;index <= template_length; index++ ) 
	{
		var output = '';
		for(var symbol in alph)
			output += table_of_automata[index][symbol] + ' ';
		WSH.echo(output);
	} 
}

function search_for_template_matches(string, template, table_of_automata)
{
	var index = 0, found_matches = false;
	var length_of_string = string.length, length_of_template = template.length;
	
	for (var idx = 0; idx < length_of_string; idx++)
	{
		if (template.indexOf(string.charAt(idx)) == -1) 
			index = 0 ; 
		else 
			index = table_of_automata[index][string.charAt(idx)];
		if (index == length_of_template) 
		{ 
			WSH.echo("MATCH AT POSITION: ", idx - length_of_template + 1); 
			found_matches = true; 
		}
	} 
	return found_matches;
}

function main()
{
	var template = new String("ananas");
	var string = new String("ananananas");
	WSH.echo("TEMPLATE:", template);
	WSH.echo("STRING:", string);
	
	var alphabet_of_template = determine_the_alphabet_of_template(template);
	var table_of_automata = create_the_table_of_automata(string, template.length);
	initialize_the_table_of_automata(table_of_automata, alphabet_of_template);
	form_the_table_of_moves(table_of_automata, alphabet_of_template, template);
	print_the_table_of_moves(table_of_automata, alphabet_of_template, string, template.length);
	var have_found = search_for_template_matches(string, template, table_of_automata);
	
	if (!have_found)
		WSH.echo("NO MATCHES OF TEMPLATE IN STRING.");
}

main();