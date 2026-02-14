const { Router } = require("express");
const CategoryRouter = Router();
const {categoriesModel} = require("../db");
const { UserMiddleware } = require("../middlewares/user");



CategoryRouter.post("/addcategory", async function(req,res){
    const { categoryName } = req.body;

    await categoriesModel.create({
        categoryName: categoryName
    })
    res.status(200).json({
        message: "category added succesfully!"
    })
})

CategoryRouter.get("/allcategories", async function(req,res){
    

    let categories = await categoriesModel.find({});

    categories = categories.map(category => category.categoryName);

    
    res.status(200).json({
        categories: categories
    })
})

module.exports = {
    CategoryRouter
}