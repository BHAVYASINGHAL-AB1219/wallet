require('dotenv').config()
const mongoose = require("mongoose");
const express = require("express");
const schema = require("./db");



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

