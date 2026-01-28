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
app.use("/users",UserRouter);
app.use("/expenses",ExpensesRouter)
app.use("/category",CategoryRouter)
app.use("/incomes",IncomeRouter);
app.use("/budget",BudgetRouter)
async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000);
    console.log("connection estabilished with db and server started listening on port 3000");
}
main()

cron.schedule('58 0 29 1 *', () => {

    async function main() {
        console.log("function started")
        const users = await UsersModel.find({});
        

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

            const allexpenses = await ExpensesModel.find({
                UserId: UserId
            })

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
        }
    }

    main()
})
