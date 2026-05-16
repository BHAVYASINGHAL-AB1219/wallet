const { Router } = require("express");

const BudgetRouter = Router();
const { UserMiddleware } = require("../middlewares/user")
const { BudgetModel, categoriesModel, IncomesModel } = require("../db")

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
        let budgetarramount = 0;
        for (let i = 0; i < budgetarramount.length; i++) {
            budgetarramount += budgetarr.amount;
        }

        console.log(budgetarramount);
        //console.log(budgetarr)
        const categoryexists = await budgetarr.filter(val => val.categoryId.toString() === categoryId.toString())
        //console.log(categoryexists)
        if (categoryexists.length == 0) {
            budgetarramount += amount;

            if (budgetarramount > maxbudget) {
                flag = 3;
            } else {
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
        }
    } else {

        if (amount > maxbudget) {
            flag = 3;
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
    }
    if (flag == 0) {
        res.status(200).json({
            message: `Budget updated of category ${category}`
        })
    } else if (flag == 1) {
        res.status(200).send(`New Budget has been created for user with UserId: ${UserId.id}`)
    } else if (flag == 3) {
        res.status(403).send(`Budget is getting over Income ${maxbudget}`)
    } else {
        res.status(403).send(`Error Occured`)
    }

})

BudgetRouter.put("/editbudget", UserMiddleware, async function (req, res) {
    const UserId = req.UserId;
    const currdate = new Date();
    let maxbudget = 0;
    let maxbudgetobj = await IncomesModel.find({
        UserId: UserId.id
    })

    console.log(maxbudgetobj);

    maxbudgetobj = maxbudgetobj.filter(income => (new Date(income.createdAt).getMonth() == currdate.getMonth() && new Date(income.createdAt).getFullYear == currdate.getFullYear));

    console.log(maxbudgetobj);

    for (let i = 0; i < maxbudgetobj.length; i++) {
        maxbudget += maxbudgetobj[i].amount;
    }

    console.log(maxbudget);
    let isoverbudget = false;
    let totalbudgetamount = 0;

    const { category, amount } = req.body;

    const categoryobj = await categoriesModel.findOne({
        categoryName: category
    })

    const categoryid = categoryobj.id

    const budgetexists = await BudgetModel.findOne({
        UserId: UserId.id
    })

    const budgetarr = budgetexists.budget;

    for (let i = 0; i < budgetarr.length; i++) {
        if (budgetarr[i].categoryId.toString() == categoryid.toString()) {
            totalbudgetamount += amount;
        } else {
            totalbudgetamount += budgetarr[i].amount;
        }
    }

    if (totalbudgetamount > maxbudget) {
        isoverbudget = true;
    }

    if (!isoverbudget) {
        for (let i = 0; i < budgetarr.length; i++) {
            if (budgetarr[i].categoryId.toString() == categoryid.toString()) {
                budgetarr[i].amount = amount;
            }
        }
    }

    if(!isoverbudget){
        const updatedbudget = await BudgetModel.updateOne({
        UserId: UserId.id
    }, {
        budget: budgetarr,
        createdAt: new Date()
    })
    }
    

    if (!overbudget && updatedbudget.matchedCount == 1) {
        res.status(200).json({
            message: `Budget of category: ${category} updated`
        })
    } else if(isoverbudget){
        res.status(403).send(`OverBudget excedding Income: ${maxbudget}`);
    } else {
        res.status(404).send(`Some Error Occured, Budget not Upddated`)
    }
})

BudgetRouter.get("/totalbudget", UserMiddleware, async function (req, res) {
    const UserId = req.UserId;



    const budgetobj = await BudgetModel.findOne({
        UserId: UserId.id
    })
    //console.log(budgetobj)

    if (budgetobj) {
        let totalbudget = 0;
        for (let i = 0; i < budgetobj.budget.length; i++) {
            totalbudget += budgetobj.budget[i].amount;
        }

        res.status(200).json({
            totalbudgetamount: totalbudget
        })
    } else {
        res.status(200).json({
            message: "data not found!"
        })
    }
})

BudgetRouter.post("/catbudget", UserMiddleware, async function (req, res) {
    const UserId = req.UserId;

    const categoryName = req.body.category;


    const userbudget = await BudgetModel.findOne({
        UserId: UserId.id
    })

    const categoryid = await categoriesModel.findOne({
        categoryName: categoryName
    })

    console.log(categoryid._id)
    let budgetamount = 0;

    if (userbudget) {
        for (let i = 0; i < userbudget.budget.length; i++) {
            if (userbudget.budget[i].categoryId.toString() == categoryid._id.toString()) {
                budgetamount = userbudget.budget[i].amount;
                break;
            }
        }
    }

    res.status(200).json({
        catbudget: budgetamount
    })
})

BudgetRouter.post("/categoryexists", UserMiddleware, async function (req, res) {
    const UserId = req.UserId;

    const { categoryName } = req.body

    const categoryobj = await categoriesModel.findOne({
        categoryName: categoryName
    })
    console.log(categoryobj)
    const categoryId = categoryobj._id;


    const budgetobj = await BudgetModel.findOne({
        UserId: UserId.id
    })

    let categoryexists = 0;

    if (!budgetobj) {
        res.status(200).json({
            categoryexists: categoryexists
        })
    } else {
        budgetarr = budgetobj.budget;

        const filteredcategory = budgetarr.filter((budget) => budget.categoryId.toString() === categoryId.toString());

        if (filteredcategory.length > 0) {
            categoryexists = 1;
        }
    }



    res.status(200).json({
        categoryexists: categoryexists
    })

})

module.exports = {
    BudgetRouter
}