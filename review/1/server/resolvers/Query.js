const Query = {
	async posts(parent, args, { Message }, info) {
		let result = [];
		if (!args.query) {
			let data = await Message.find().limit(100)
			data.map(e => {
				result.push({author: e.author, name: e.name, message: e.body});
			})
		}
		else
		{
			let data = await Message.find({$or:[{name:args.query}, {author:args.query}]}).limit(100)
			data.map(e => {
				result.push({author: e.author, name: e.name, message: e.body});
			})
		}
		return result;
	}
};

export { Query as default };
