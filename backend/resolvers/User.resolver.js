import {users} from '../dummyData/data.js'

export const userResolver = {
    Query: {
        users: () => users,
        user: (_, args) => users.find((user) => user._id == args.userId),
        authUser: () => users.find((user) => user._id == "3"),
    },
    Mutation: {} 
}