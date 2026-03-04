const { Router } = require("express");
const jwt = require("jsonwebtoken");
const JWT_USER = process.env.JWT_USER;
const ExpensesRouter = Router();
const { UserMiddleware } = require("../middlewares/user");
const { ExpensesModel, BudgetModel } = require("../db");
const { categoriesModel } = require("../db");

function getmonthdays(year, month){
    return new Date(year, month , 0).getDate();
}


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

    const currentdate = new Date();

    let allexpenses = await ExpensesModel.find({
        UserId: UserId.id
    });

    const monthlyexpenses = allexpenses.filter(expense => new Date(expense.createdAt).getMonth() == currentdate.getMonth());
    let totalexpense = 0;
    let monthlytotalexpense = 0;
    for(let i = 0; i < allexpenses.length; i++){
        totalexpense += allexpenses[i].amount;
    }
    for(let i = 0; i < monthlyexpenses.length; i++){
        monthlytotalexpense += monthlyexpenses[i].amount;
    }

    res.status(200).json({
        allexpenses: allexpenses,
        message: `all expenses with user ${UserId}`,
        totalexpense: totalexpense,
        monthlytotalexpense: monthlytotalexpense,
        monthlyexpenses: monthlyexpenses
    })
})


ExpensesRouter.post("/catexpenses", UserMiddleware, async function (req, res) {
    const UserId = req.UserId;

    const category = req.body.category;
    const currentdate = new Date();

    const categoryobj = await categoriesModel.findOne({
        categoryName: category
    })
    console.log(categoryobj._id)

    const allexpenses = await ExpensesModel.find({
        UserId: UserId.id,
        category: categoryobj._id
    })

    allexpenses.reverse();

    const monthlyexpenses = allexpenses.filter(exp => new Date(exp.createdAt).getMonth() == currentdate.getMonth());

    let totalmonthexpense = 0;

    for(let i = 0; i < monthlyexpenses.length; i++){
        totalmonthexpense += monthlyexpenses[i].amount;
    }

    let totalexpense = 0;
    for(let i = 0; i < allexpenses.length; i++){
        totalexpense += allexpenses[i].amount;
    }
    if (allexpenses.length >= 1) {
        res.status(200).json({
            message: `all expenses with category ${category}`,
            expenses: allexpenses,
            monthlyexpenses: monthlyexpenses,
            totalmonthexpense: totalmonthexpense,
            totalexpense: totalexpense
        })
    } else {
        res.status(200).send(`No expense of category: ${category} found`)
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

ExpensesRouter.post("/dailyexpense", UserMiddleware, async function(req,res){

    const currentdate = new Date();

    const UserId = req.UserId.id;

    const categoryobj = await categoriesModel.findOne({
        categoryName: "Food and Drinks"
    })

    let categoryid = categoryobj._id;

    const allexpenses = await ExpensesModel.find({
        UserId: UserId,
        category: categoryid
    })

    const allmonthlyexpenses = allexpenses.filter(expense => new Date(expense.createdAt).getMonth() == currentdate.getMonth());

    let totalmonthexpense = 0;
    for(let i = 0; i < allmonthlyexpenses.length; i++){
        totalmonthexpense += allmonthlyexpenses[i].amount;
    }


    const budgetobj = await BudgetModel.findOne({
        UserId: UserId
    })


    let budgetamount = 0;

    for(let i = 0; i < budgetobj.budget.length; i++){
       if(budgetobj.budget[i].categoryId.toString() === categoryid.toString()){
        budgetamount = budgetobj.budget[i].amount;
        break;
       }
    }

    let remainingamount = budgetamount - totalmonthexpense;

    let monthdays = getmonthdays(currentdate.getFullYear(), currentdate.getMonth() + 1);
    console.log(monthdays)

    let daysremaining = monthdays - currentdate.getDate();
    console.log(daysremaining);
    
    let dailylimit = (remainingamount/daysremaining).toFixed(2);

    res.status(200).json({
        dailylimit: dailylimit
    })
})
module.exports = {
    ExpensesRouter
}