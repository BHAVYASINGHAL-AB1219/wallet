require('dotenv').config()
const mongoose = require("mongoose");
const express = require("express");
const schema = require("./db");
const { creditModel, BudgetModel, ExpensesModel, UsersModel } = require('./db');
const cron = require('node-cron');



const app = express();
app.use(express.json())

const { UserRouter } = require("./routes/users")
const { ExpensesRouter } = require("./routes/expenses");
const { CategoryRouter } = require("./routes/category");
const { IncomeRouter } = require("./routes/incomes")
const { BudgetRouter } = require("./routes/budget")
app.use("/users", UserRouter);
app.use("/expenses", ExpensesRouter)
app.use("/category", CategoryRouter)
app.use("/incomes", IncomeRouter);
app.use("/budget", BudgetRouter)
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000);
    console.log("connection estabilished with db and server started listening on port 3000");
}
main()

cron.schedule('0 0 1 * *', () => {

    async function main() {
        console.log("function started")
        const users = await UsersModel.find({});

        let currentmonth = new Date().getMonth();
        let currentyear = new Date().getFullYear();

        console.log(currentmonth);
        console.log(currentyear);


        for (let k = 0; k < users.length; k++) {
            let UserId = users[k]._id;
            UserId = UserId

            const totalbudget = await BudgetModel.findOne({
                UserId: UserId
            })

            const budgetarr = totalbudget.budget;

            let totalamount = 0;
            for (let i = 0; i < budgetarr.length; i++) {
                totalamount += budgetarr[i].amount;
            }

            let allexpenses = await ExpensesModel.find({
                UserId: UserId
            })
            if (currentmonth != 0) {
                allexpenses = allexpenses.filter(expense => (expense.createdAt.getMonth() === currentmonth - 1) && (expense.createdAt.getFullYear() === currentyear))
            } else {
                allexpenses = allexpenses.filter(expense => expense.createdAt.getMonth() == 12 && expense.createdAt.getFullYear() == currentyear - 1);
            }

            console.log(allexpenses);

            let totalexpense = 0;
            for (let i = 0; i < allexpenses.length; i++) {
                totalexpense += allexpenses[i].amount;
            }

            const credit = totalamount - totalexpense;

            await creditModel.create({
                UserId: UserId,
                amount: credit,
                createdAt: new Date()
            })
            await BudgetModel.upadateOne({
                UserId: UserId
            }, {
                createdAt: new Date()
            })
        }
    }

    main()
})
