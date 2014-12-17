function Node(letter, period, parent, code, use) 
{
	this.Letter = letter;
	this.Period = period;
	this.Parent = parent;
	this.Code = code;
	this.Use = use;
}

function create_alphabet_vector(string)
{
	var alphabet = new Array();
	var length_of_string = string.length;
	
	for(var index = 0; index < length_of_string; ++index) 
		alphabet[string.charAt(index)] = 0;
	
	return alphabet;
}

function initialize_alphabet_vector(string, alphabet)
{
	var length_of_string = string.length;
	
	for(var index = 0; index < length_of_string; ++index) 
		alphabet[string.charAt(index)]++;
}

function create_tree(alphabet)
{
	var new_tree = new Array();
	
	for (var symbol in alphabet) 
	{
		var new_node = new Node(symbol, alphabet[symbol], -1, '', 0);
		new_tree.push(new_node);
	}
	return new_tree;
}

function get_the_no_of_min_frequency(tree, m_period) 
{
	var length_of_tree = tree.length;
	var min = new Node('', m_period + 1, -1, 0, -1); 
	var min_index = -1;
	
	for (var index = 0; index < length_of_tree; index++) 
	{ 
		if (tree[index].Use == 0 && tree[index].Period < min.Period)
		{
			min = tree[index]; 								
			min_index = index;								
		}
	}
	return min_index;
}

function find_similar_nodes_and_plus_them(tree, length_of_string)
{	
	for (var index = 0; index < tree.length; ++index) 
	{
		var imin1 = get_the_no_of_min_frequency(tree, length_of_string);  
		if (imin1 > -1) tree[imin1].Use = 1;	
		
		imin2 = get_the_no_of_min_frequency(tree, length_of_string);    
		if (imin2 > -1) tree[imin2].Use = 1; 
    
		if (imin1 > -1 && imin2 > -1)        // оба эл-та существуют, тогда склеиваим их и, соотвт-но, создаем новую запись 
		{ 
			tree.push(new Node(tree[imin1].Letter + tree[imin2].Letter, tree[imin1].Period + tree[imin2].Period, -1, '', 0));        
			tree[imin1].Code = '0'; 
			tree[imin1].Parent = tree.length - 1;  
			tree[imin2].Code = '1';                  
			tree[imin2].Parent = tree.length - 1;         
		}
	}
}

function reverse_string(string)
{
	var result = new String();
	var length_of_string = string.length;
	
	for (var index = length_of_string - 1; index >=0; index--)
		result += string.charAt(index);
	return result;
}

function form_the_code_for_each_alpha(tree)
{
	var length_of_tree = tree.length;
	var total_hamming_code = new Array();
	
	for (var index = 0; index < length_of_tree; index++) 
	{
		if (tree[index].Letter.length == 1) 										// нашли однобуквенную запись
		{
			var forming_code = tree[index].Code;         							// присвоим ее код переменной
			var next_element = tree[tree[index].Parent];							//следущий элемент -с индексом родителя 
			while(next_element.Parent != -1)   									// пока родитель существует, ищем его
			{
				forming_code += next_element.Code;      						// собираем код, поднимаясь по дереву
				next_element = tree[next_element.Parent]; 						// следующий по родителю пред 
			}
			total_hamming_code[tree[index].Letter] = reverse_string(forming_code);
			WSH.echo(tree[index].Letter, " ", total_hamming_code[tree[index].Letter]);
		}  
	}
	return total_hamming_code;
}

function print_results(total_hamming_code, string)
{
	var output = new String();
	var length_of_string = string.length;
	
	for (var index = 0; index < length_of_string; index++)
		output += total_hamming_code[string.charAt(index)];

	WSH.echo("\nTOTAL HAMMING CODE:", output); 
}

function trace_print(some_array)
{
	for (var symbol in some_array)
		WSH.echo(symbol, some_array[symbol]);
}
	
function main()
{
	var string_to_test = new String("abracadabra");
	WSH.echo("STRING: ", string_to_test);
	
	var alphabet_vector = create_alphabet_vector(string_to_test);
	initialize_alphabet_vector(string_to_test, alphabet_vector);
	
	var tree = create_tree(alphabet_vector);
	find_similar_nodes_and_plus_them(tree, string_to_test.length);
	
	var total_hamming_code = form_the_code_for_each_alpha(tree);
	print_results(total_hamming_code, string_to_test);
	
}

main();