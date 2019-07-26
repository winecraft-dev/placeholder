var string = "var map = \n";

for(var x = 0; x < 64; x ++)
{
	string += "\"";
	for(var y = 0; y < 64; y ++)
	{
		var height = Math.cos(x / 64 * Math.PI * 5) * Math.cos(y / 64 * Math.PI * 5) * 2 + 2;

		if(x === 0 || x === 64 - 1 || y === 0 || y === 64 - 1)
			height = 3;
		string += 'g' + height + ' ';
	}
	string += "\\n\" +\n";
}
console.log(string);