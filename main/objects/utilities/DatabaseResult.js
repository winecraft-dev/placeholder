module.exports = class DatabaseResult
{
	constructor(success = false, data = null)
	{
		this.success = success;
		this.data = data; // an array, no matter what
	}

	hasData()
	{
		return (this.success == true && this.data != null && this.data.length && this.data.length > 0);
	}

	success()
	{
		return this.success;
	}

	single()
	{
		if(this.hasData())
			return this.data[0];
		return null;
	}

	length()
	{
		if(this.hasData())
			return this.data.length;
		return 0;
	}
}