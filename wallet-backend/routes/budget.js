const { Router } = require("express");

const BudgetRouter = Router();
const { UserMiddleware } = require("../middlewares/user")
const { BudgetModel, categoriesModel } = require("../db")

BudgetRouter.post("/setbudget", UserMiddleware, async function (req, res) {
    const UserId = req.UserId;
    // console.log(UserId)
    let flag = 2;

    const { budget } = req.body;
    const { category, amount } = budget

    const categoryobj = await categoriesModel.findOne({
        categoryName: category
    });
    

    const categoryId = categoryobj._id
    
    const budgetexists = await BudgetModel.findOne({
        UserId: UserId.id
    })
    //console.log(budgetexists)

    if (budgetexists) {
        const budgetarr = budgetexists.budget;
        //console.log(budgetarr)
        const categoryexists = await budgetarr.filter(val => val.categoryId.toString() === categoryId.toString())
        //console.log(categoryexists)
        if (categoryexists.length == 0) {
            budgetarr.push({
                categoryId: categoryId,
                amount: amount
            })

            const updatedbudget = await BudgetModel.updateOne({
                UserId: UserId.id
            }, {
                budget: budgetarr,
                createdAt: new Date()
            })
            flag = 0;
        }
    } else {
        const newbudget = await BudgetModel.create({
            budget: {
                categoryId: categoryId,
                amount: amount
            },
            UserId: UserId.id,
            createdAt: new Date()
        })
        flag = 1;
    }
    if (flag == 0) {
        res.status(200).json({
            message: `Budget updated of category ${category}`
        })
    } else if (flag == 1) {
        res.status(200).send(`New Budget has been created for user with UserId: ${UserId.id}`)
    } else {
        res.status(403).send(`Error Occured`)
    }

})

BudgetRouter.put("/editbudget", UserMiddleware , async function(req,res){
    const UserId = req.UserId;

    const { category, amount} = req.body;

    const categoryobj = await categoriesModel.findOne({
        categoryName: category
    })

    const categoryid = categoryobj.id

    const budgetexists = await BudgetModel.findOne({
        UserId: UserId.id
    })

    const budgetarr = budgetexists.budget;

    for(let i = 0; i < budgetarr.length; i++){
        if(budgetarr[i].categoryId.toString() == categoryid.toString()){
            budgetarr[i].amount = amount;
        }
    }

    const updatedbudget = await BudgetModel.updateOne({
       UserId: UserId.id
    },{
        budget: budgetarr,
        createdAt: new Date()
    })

    if(updatedbudget.matchedCount == 1){res.status(200).json({
        message: `Budget of category: ${category} updated`
    })}else{
        res.status(404).send(`Some Error Occured, Budget not Upddated`)
    }
})

module.exports = {
    BudgetRouter
}