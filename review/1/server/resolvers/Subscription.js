const Subscription = {
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('post')
    }
  },
  userPost: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator(`post ${args.name}`)
    }
  }
}

export { Subscription as default }
