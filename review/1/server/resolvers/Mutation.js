const Mutation = {
	async createPost(parent, args, { Message, pubsub }, info) {
		if (!args.data) {
			return;
		}
		else{
			await Message.insertMany([{author: args.data.author, name: args.data.name, body: args.data.message}]);
		}
		
		pubsub.publish(`post ${args.data.name}`, {
			userPost: {
				mutation: "CREATED",
				data: {
					author: args.data.author,
					name: args.data.name,
					message: args.data.message
				}
			}
		});

		pubsub.publish(`post ${args.data.author}`, {
			userPost: {
				mutation: "CREATED",
				data: {
					author: args.data.author,
					name: args.data.name,
					message: args.data.message
				}
			}
		});

		pubsub.publish("post", {
			post: {
				mutation: "CREATED",
				data: {
					author: args.data.author,
					name: args.data.name,
					message: args.data.message
				}
			}
		});

		return args.data;
	},
	async deletePost(parent, args, { Message, pubsub }, info) {
		if (!args.author) {
			Message.deleteMany({});
			return args.author;
		}
		else{
			await Message.deleteMany({author: args.author});
		}
		
		pubsub.publish(`post ${args.author}`, {
			userPost: {
				mutation: "DELETED",
				name: args.author
			}
		});

		pubsub.publish("post", {
			post: {
				mutation: "DELETED",
				name: args.author
			}
		});
		return args.author;
	}

};

export { Mutation as default };
