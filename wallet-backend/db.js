const mongoose = require("mongoose");
const { string, object } = require("zod");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;





const users = new mongoose.Schema({
    email: {type: String, unique: true},
    hashedpassword: String,
    name: String
})

const expenses = new mongoose.Schema({
    amount: Number,
    description: String,
    UserId: ObjectId,
    category: ObjectId,
    createdAt: Date
})

const incomes = new mongoose.Schema({
    amount: Number,
    description: String,
    UserId: ObjectId,
    createdAt: Date
})

const budget = new mongoose.Schema({
    budget: [{
        categoryId: ObjectId,
        amount: Number
    }],
    UserId: ObjectId,
    createdAt: Date
})

const categories = new mongoose.Schema({
    categoryName: String
})

const credit = new mongoose.Schema({
    UserId: ObjectId,
    amount: Number,
    createdAt: Date
})

const UsersModel = mongoose.model('users',users);
const ExpensesModel = mongoose.model('expenses',expenses);
const IncomesModel = mongoose.model('incomes',incomes);
const BudgetModel = mongoose.model('budget',budget);
const categoriesModel = mongoose.model('categories',categories);
const creditModel = mongoose.model('credits',credit);

module.exports = {
    UsersModel,
    ExpensesModel,
    IncomesModel,
    BudgetModel,
    categoriesModel,
    creditModel
}


