const { Router } = require("express");
const CategoryRouter = Router();
const {categoriesModel} = require("../db");



CategoryRouter.post("/addcategory", async function(req,res){
    const { categoryName } = req.body;

    await categoriesModel.create({
        categoryName: categoryName
    })
    res.status(200).json({
        message: "category added succesfully!"
    })
})

module.exports = {
    CategoryRouter
}