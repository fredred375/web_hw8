const { GraphQLServer, PubSub } = require('graphql-yoga');
const mongoose = require('mongoose');
require('dotenv-defaults').config();

const Message = require('./models/message') 

const pubsub = new PubSub();

const resolvers = {
    Query: {
      async messages() {
          try
          {
            const messages = await Message.find();
            if(messages)
            {
                return messages;
            }
            else
            {
                throw new Error('Error fetching Messages from database');
            }
          }
          catch(err)
          {
              throw new Error(err);
          }
      }
    },
    Mutation: {
        async send(_, { messageInput: { name, body } })
        {
            try
            {
                const message = new Message(
                    {
                        name,
                        body
                    }
                );
                const msg = message.save();
                if(msg)
                {
                    pubsub.publish('subscribe', {
                        messages: { mutation: 'UPDATED', data: msg }
                    })
                }
                return msg;
            }
            catch(err)
            {
                throw new Error(err);
            }
        },
        async clear() {
            try {
                await Message.deleteMany({});
                pubsub.publish('subscribe', {
                    messages: { mutation: 'CLEARED', data: null }
                })
                return 'Successfuly deleted all messages'
            } catch (err) {
                throw new Error(err)
            }
        }
    },
    Subscription: {
        messages: {
            async subscribe(_, __, { pubsub }) {
                const message = await Message.find();
                if(!message)
                {
                    throw new Error('Message not found');
                }
                return pubsub.asyncIterator(`subscribe`);
            }
        }
    }
};

if(!process.env.MONGO_URL)
{
    console.error('Missing MONGO_URL');
    process.exit(1);
};

mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
});

const server = new GraphQLServer({ typeDefs: './server/schema.graphql', resolvers, context: { pubsub } })
server.start(() => console.log('Server is running on localhost:4000'))