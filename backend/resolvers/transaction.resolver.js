import { Transaction } from "../models/transaction.model.js";

export const transactionResolver= {
    Query:{
        transactions: async (_, __, context) => {
            try {
                if(!context.getUser()) throw new Error("Unauthorized");
                const userId = context.getUser()._id;

                const transactions = Transaction.find({userId});
                return transactions;
            } catch (err) {
                console.error("Error getting transactions:", err );
                throw new Error(err.message || "Error getting transactions");
            }
        },

        transaction: async (_, {transsactionId}, context) => {
            try {
                const transaction = Transaction.findOne({transsactionId});
                return transaction;
            } catch (err) {
                console.error("Error getting transaction:", err );
                throw new Error(err.message || "Error getting transaction");
            }
        },

        categoryStatistics: async (_, __, context) => {
            if(!context.getUser()) throw new Error("Unauthorized!");

            const userId = context.getUser()._id;
            const transactions = await Transaction.find({userId});
            const categoryMap = {};
            transactions.forEach((transaction)=>{
                if(!categoryMap[transaction.category])categoryMap[transaction.category]=0;
                categoryMap[transaction.category] += transaction.amount;
            });
            return Object.entries(categoryMap).map(([category, totalAmount])=>({category, totalAmount}));
        }
    },
    Mutation:{
        createTransaction: async (_, {input} , context)=>{
            try {
                // const {description, paymentType, category, amount, location, date} = input;
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id,
                });
                await newTransaction.save();
                return newTransaction;
            } catch (err) {
                console.error("Error creating trancastion", err);
                throw new Error(err.message || "Error creating trancastion");
            }
        },

        updateTransaction: async (_, {input}, context)=>{
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new: true});
                return updatedTransaction;
            } catch (err) {
                console.error("Error updating trancastion", err);
                throw new Error(err.message || "Error updating trancastion");                
            }
        },

        deleteTransaction: async (parent, {transactionId}, context)=>{
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch (err) {
                console.error("Error deleting trancastion", err);
                throw new Error(err.message || "Error deleting trancastion");                
            }
        }
    }
}