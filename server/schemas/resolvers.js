const {AuthenticationError} = require('apollo-server-express');
const {User} = require('../models');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({_id: context.user._id})
                .select('-__v -password');

                return userData;
            }
            throw new AuthenticationError('Please log in');
        },
    },
    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await user.findOne({email});

            if(!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPassword = await user.isCorrectPassword(password);
            if(!correctPassword) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return {token, user};
        },
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email,password});
            const token = signToken(user);

            return {token, user};
        },
        saveBook: async (parent, {input}, context) => {
            if(context.user) {
                try {
                    const updatedUser = await User.findByIdAndUpdate(
                        {_id: context.user._id},
                        {$addToSet: {savedBooks: input}},
                        {new: true, runValidators: true}
                    );
    
                    console.log(updatedUser)

                    return updatedUser;
                } catch(err) {
                    console.log(err);
                    throw new AuthenticationError('Something went wrong!');

                }
            }
            throw new AuthenticationError('Please log in');
        }, 
        removeBook: async (parent, {book}, context) => {
            if(context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: book}},
                    {new: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('Please log in');
        }
    }
};

module.exports = resolvers;