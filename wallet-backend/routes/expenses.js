const { Router } = require("express");
const jwt = require("jsonwebtoken");
const JWT_USER = process.env.JWT_USER;
const ExpensesRouter = Router();
const { UserMiddleware } = require("../middlewares/user");
const { ExpensesModel } = require("../db");
const { categoriesModel } = require("../db");


ExpensesRouter.post("/addexpense", UserMiddleware, async function (req, res) {
    const { amount, description, category } = req.body;

    const UserId = req.UserId;

    const categoryobject = await categoriesModel.findOne({
        categoryName: category
    })

    await ExpensesModel.create({
        amount: amount,
        description: description,
        UserId: UserId.id,
        category: categoryobject._id,
        createdAt: new Date()
    })
    res.status(200).json({
        message: "expense added in DB",
        UserId: UserId
    })
})

ExpensesRouter.get("/allexpenses", UserMiddleware, async function (req, res) {
    const UserId = req.UserId;

    const allexpenses = await ExpensesModel.find({
        UserId: UserId.id
    })

    res.status(200).json({
        allexpenses: allexpenses,
        message: `all expenses with user ${UserId}`,
    })
})


ExpensesRouter.get("/catexpenses", UserMiddleware, async function (req, res) {
    const UserId = req.UserId;

    const category = req.body.category;

    const categoryobj = await categoriesModel.findOne({
        categoryName: category
    })
    console.log(categoryobj._id)

    const allexpenses = await ExpensesModel.find({
        UserId: UserId.id,
        category: categoryobj._id
    })
    if (allexpenses.length >= 1) {
        res.status(200).json({
            message: `all expenses with category ${category}`,
            expenses: allexpenses
        })
    } else {
        res.status(404).send(`No expense of category: ${category} found`)
    }

})

ExpensesRouter.put("/editexpense",UserMiddleware,async function(req,res){
    const UserId = req.UserId;
    const { expenseId , amount, description , category} = req.body;

    const categoryobj = await categoriesModel.findOne({
        categoryName: category
    })

    const newexpense = await ExpensesModel.updateOne({
        UserId: UserId.id,
        _id: expenseId
    }, {
        amount: amount,
        description: description,
        category: categoryobj._id
    })

    if(newexpense.matchedCount == 1){
        res.status(200).send(`expense updated with expenseId ${expenseId}`)
    }else{
        res.status(404).send(`expense with expenseId: ${expenseId} not found in database`)
    }
})
module.exports = {
    ExpensesRouter
}