function read_data_from_file(path_to_file)
{
	result_string = new String();
	try
	{
		var file_pointer = file_system_object.OpenTextFile(path_to_file);
		result_string = read_data_line_by_line(file_pointer);
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

function read_data_line_by_line(file_pointer)
{
	var result_string = new String();
	while (!file_pointer.AtEndOfStream)
		result_string += file_pointer.ReadLine() + ' ';
	result_string += "exit";
	return result_string;
}

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

function get_instruction_to_input(assoc_memory, instruction_pointer)
{
	WScript.Echo("Write the value -> ");
    assoc_memory[assoc_memory[instruction_pointer + 1]] = parseFloat(WScript.StdIn.ReadLine());
	return instruction_pointer + 2;
}

function get_instruction_to_output(assoc_memory, instruction_pointer)
{
	WScript.Echo("-> ", assoc_memory[assoc_memory[instruction_pointer + 1]]);
	return instruction_pointer + 2;
}

function set_instruction(assoc_memory, instruction_pointer)
{
	assoc_memory[assoc_memory[instruction_pointer + 1]] = assoc_memory[assoc_memory[instruction_pointer + 2]];	  
	return instruction_pointer + 3;
}

function swap_instruction(assoc_memory, instruction_pointer)
{
	assoc_memory[assoc_memory[instruction_pointer + 3]] = assoc_memory[assoc_memory[instruction_pointer + 1]];	  
	assoc_memory[assoc_memory[instruction_pointer + 1]] = assoc_memory[assoc_memory[instruction_pointer + 2]];	  
	assoc_memory[assoc_memory[instruction_pointer + 2]] = assoc_memory[assoc_memory[instruction_pointer + 3]];	  
	return instruction_pointer + 4;
}

function set_constant_instruction(assoc_memory, instruction_pointer)
{
	assoc_memory[assoc_memory[instruction_pointer + 1]] = assoc_memory[instruction_pointer + 2];	  
	return instruction_pointer + 3;
}

function dec_instruction(assoc_memory, instruction_pointer)
{
	assoc_memory[assoc_memory[instruction_pointer + 1]]--;	  
	return instruction_pointer + 2;
}

function cmp_jmp_instruction(assoc_memory, instruction_pointer)
{
	if (assoc_memory[assoc_memory[instruction_pointer + 1]] > assoc_memory[assoc_memory[instruction_pointer + 2]])
		return parseInt(assoc_memory[instruction_pointer + 3]); 
	return instruction_pointer + 4;
}

function jmp_instruction(assoc_memory, instruction_pointer)
{
	return parseInt(assoc_memory[instruction_pointer + 1]);
}

function add_instruction(assoc_memory, instruction_pointer)
{
	assoc_memory[assoc_memory[instruction_pointer + 3]] = assoc_memory[assoc_memory[instruction_pointer + 1]] + assoc_memory[assoc_memory[instruction_pointer + 2]];
    return instruction_pointer + 4;
}

function sub_instruction(assoc_memory, instruction_pointer)
{
	assoc_memory[assoc_memory[instruction_pointer + 3]] = assoc_memory[assoc_memory[instruction_pointer + 1]] - assoc_memory[assoc_memory[instruction_pointer + 2]];
    return instruction_pointer + 4;
}

function div_instruction(assoc_memory, instruction_pointer)
{
	assoc_memory[assoc_memory[instruction_pointer + 3]] = assoc_memory[assoc_memory[instruction_pointer + 1]] / assoc_memory[assoc_memory[instruction_pointer + 2]];
    return instruction_pointer + 4;
}

function mul_instruction(assoc_memory, instruction_pointer)
{
	assoc_memory[assoc_memory[instruction_pointer + 3]] = assoc_memory[assoc_memory[instruction_pointer + 1]] * assoc_memory[assoc_memory[instruction_pointer + 2]];
    return instruction_pointer + 4;
}

function mod_instruction(assoc_memory, instruction_pointer)
{
	assoc_memory[assoc_memory[instruction_pointer + 3]] = assoc_memory[assoc_memory[instruction_pointer + 1]] % assoc_memory[assoc_memory[instruction_pointer + 2]];
    return instruction_pointer + 4;
}

function execute_program(assoc_memory)
{
	var instruction_pointer = 0;
	while (assoc_memory[instruction_pointer] != "exit")
	{
		switch (assoc_memory[instruction_pointer])
		{
			case "add":
				instruction_pointer = add_instruction(assoc_memory, instruction_pointer);
				break;
   
			case "sub":
				instruction_pointer = sub_instruction(assoc_memory, instruction_pointer);   
				break;
   
			case "div":
				instruction_pointer = div_instruction(assoc_memory, instruction_pointer);
				break;
   
			case "mul":
				instruction_pointer = mul_instruction(assoc_memory, instruction_pointer);
				break;

			case "mod":
				instruction_pointer = mod_instruction(assoc_memory, instruction_pointer);
				break;
				
			case "cin":
				instruction_pointer = get_instruction_to_input(assoc_memory, instruction_pointer);
				break;

			case "cout":
				instruction_pointer = get_instruction_to_output(assoc_memory, instruction_pointer);
				break;	
   
			case "end":
				WScript.Quit();
	  
			case "set":
				instruction_pointer = set_instruction(assoc_memory, instruction_pointer);
				break;
   
			case "swap":
				instruction_pointer = swap_instruction(assoc_memory, instruction_pointer);
				break;
   
			case "set_const":
				instruction_pointer = set_constant_instruction(assoc_memory, instruction_pointer);
				break;
   
			case "dec":
				instruction_pointer = dec_instruction(assoc_memory, instruction_pointer);
				break;
   
			case "cmpjmp":
				instruction_pointer = cmp_jmp_instruction(assoc_memory, instruction_pointer)  ; 
				break;
   
			case "jmp":
				instruction_pointer = jmp_instruction(assoc_memory, instruction_pointer);
				break;
		}
	}
}

function main()
{
	var text_of_program = read_data_from_file(WSH.Arguments(0));
	var assoc_memory = text_of_program.split(' ');
	execute_program(assoc_memory);
}

var file_system_object = new ActiveXObject("Scripting.FileSystemObject");
main()