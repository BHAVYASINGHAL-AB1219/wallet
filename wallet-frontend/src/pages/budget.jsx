import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './budget.css'


function Budget() {


    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [editrow, setEditrowId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [budgetobj, setBudgetobj] = useState([]);
    const [catamount, setCatamount] = useState(0);


    useEffect(() => {
        const fetchcategories = async () => {
            const categoriesarr = await axios.get("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/category/allcategories");
            //console.log(categoriesarr)
            setCategories(categoriesarr.data.categories);
        }


        fetchcategories();

    }, [])

    useEffect(() => {
        const fetchcategorywisebudget = async () => {
            let tempresults = [];
            for (let i = 0; i < categories.length; i++) {
                let amount = await axios.post("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/budget/catbudget", {
                    category: categories[i]
                }, {
                    headers: {
                        token: token
                    }
                })
                console.log(amount);
                let newobj = {
                    id: i,
                    categoryName: categories[i],
                    amount: amount.data.catbudget
                }
                tempresults.push(newobj);
            }
            setBudgetobj(tempresults);
        }
        fetchcategorywisebudget();
    }, [categories, editrow])

    const editbudget = async (id) => {
        setEditrowId(id);
    }

    const savebudget = async (categoryname) => {

        const iscategoryexists = await axios.post("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/budget/categoryexists", {
            categoryName: categoryname
        }, {
            headers: {
                token: token
            }
        })
        console.log(iscategoryexists);

        if (iscategoryexists.data.categoryexists === 1) {
            try {
                const repsonse = await axios.put("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/budget/editbudget", {
                    category: categoryname,
                    amount: catamount
                }, {
                    headers: {
                        token: token
                    }
                })
            } catch (e) {
                console.log(e.response.data);
                alert(`${e.response.data}`);
            }
        } else {
            const response = await axios.post("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/budget/setbudget", {
                budget: {
                    category: categoryname,
                    amount: catamount
                }
            }, {
                headers: {
                    token: token
                }
            })
        }



        setEditrowId(null);
    }

    return (
        <div className='budget-layout'>
            <Header />
            <div className='main-budget'>
                <div className='budget-space'>
                    <div className='budget-table-wrapper'>
                        <table className='budget-table'>
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>amount</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {budgetobj.map((budget) => (<tr key={budget.id}>
                                    <td className='category-col'>{budget.categoryName}</td>
                                    {editrow === budget.id && (<td className='amount-col'>
                                        <input className='input-amount'
                                            type="number"
                                            name="budgetamount"
                                            value={catamount}
                                            onChange={(e) => setCatamount(e.target.value)}
                                        />
                                    </td>)}
                                    {editrow !== budget.id && (<td className='amount-col'>{budget.amount}</td>)}
                                    {editrow === budget.id && (<td className='edit-col'><button className='save-button' onClick={() => { savebudget(budget.categoryName) }}>Save</button></td>)}
                                    {editrow !== budget.id && (<td className='edit-col'><button className='edit-button' onClick={() => editbudget(budget.id)}>Edit</button></td>)}
                                </tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Budget;

