const {Router} = require("express");
const IncomeRouter = Router();
const { IncomesModel } = require("../db")
const { UserMiddleware } = require("../middlewares/user");

IncomeRouter.post("/income",UserMiddleware,async function(req,res){
    const UserId = req.UserId;
    const { amount, description } = req.body;

    const newincome = await IncomesModel.create({
        amount: amount,
        description: description,
        UserId: UserId.id,
        createdAt: new Date()
    })

    if(newincome){
        res.status(200).json({
            message: `new income log with id: ${newincome._id} has been created in database`,
            income: newincome
        })
    }else{
        res.status(403).send("new income log has not been created")
    }
})

IncomeRouter.get("/allincomes",UserMiddleware,async function(req,res){
    const UserId = req.UserId;
    const currentdate = new Date();

    const allincomes = await IncomesModel.find({
        UserId: UserId.id
    })

    let totalincome = 0;
    let monthincome = 0;

    let monthincomes = allincomes.filter(income => new Date(income.createdAt).getMonth() == currentdate.getMonth());

    if(allincomes.length > 0){
        for(let i = 0; i < allincomes.length; i++){
            totalincome += allincomes[i].amount;
        }
        for(let i = 0; i < monthincomes.length; i++){
            monthincome += monthincomes[i].amount;
        }
    }



    if(allincomes.length > 0){
        res.status(200).json({
            message: `Income logs with userid: ${UserId}`,
            incomes: allincomes,
            totalincome: totalincome,
            monthincomes: monthincomes,
            monthincome: monthincome
        })
    }else{
        res.status(404).send(`No income logs found with UserId: ${UserId}`)
    }
})



IncomeRouter.put("/changeincome",UserMiddleware,async function(req,res){
    const UserId = req.UserId;

    const { IncomeId, amount, description } = req.body;

    const editedincome = await IncomesModel.updateOne({
        _id: IncomeId,
        UserId: UserId.id
    },{
        amount: amount,
        description: description
    })
    console.log(editedincome)
    if(editedincome.matchedCount == 1){
        res.status(200).json({
            message: `Income log with IncomeId: ${IncomeId} updated`
        })
    }else{
        res.status(403).send("Income cannot be updated")
    }
})
module.exports = {
    IncomeRouter
}