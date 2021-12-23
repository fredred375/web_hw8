import { GraphQLServer, PubSub } from "graphql-yoga";
//import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
require("dotenv-defaults").config();

const mongoose = require("mongoose");
const WebSocket = require("ws");
const Message = require("./models/message");

if (!process.env.MONGO_URL) {
	console.error("Missing MONGO_URL!!!");
	process.exit(1);
}

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const Mdb = mongoose.connection;

Mdb.on("error", (error) => {
	console.error(error);
});

Mdb.once("open", () => {
	console.log("MongoDB connected!");

	const pubsub = new PubSub();

	const server = new GraphQLServer({
		typeDefs: "./server/schema.graphql",
		resolvers: {
			Query,
			Mutation,
			Subscription
		},
		context: {
			Message,
			pubsub,
		},
	});

	server.start({ port: process.env.PORT | 4000 }, () => {
		console.log(`The server is up on port ${process.env.PORT | 4000}!`);
	});	

});