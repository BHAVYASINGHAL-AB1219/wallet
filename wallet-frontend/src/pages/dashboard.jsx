import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Header from '../components/Header';
import Footer from '../components/Footer';
import './dashboard.css';
import { data, useNavigate } from 'react-router-dom';

function Dashboard() {
    const currentdate = new Date();
    const navigate = useNavigate();

    const [totalincome, setTotalincome] = useState(0);
    const [totalbudget, setTotalbudget] = useState(0);
    const [totalexpense, setTotalexpense] = useState(0);
    const [categories, setCategories] = useState([]);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [expamount, setExpamount] = useState(0);
    const [expdescription, setExpensedesc] = useState('');
    const [expcategory, setexpcategory] = useState('');
    const [dailylimit, setDailylimit] = useState(0);


    const [showIncomeForm, setShowIncomeForm] = useState(false);
    const [incAmount, setIncAmount] = useState(0);
    const [incDescription, setIncDescription] = useState('');

    const addexpense = async (e) => {
        const token = localStorage.getItem('token');
        const response = await axios.post("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/expenses/addexpense", {
            category: expcategory,
            amount: expamount,
            description: expdescription
        }, {
            headers: {
                token: token
            }
        })
        console.log(response)
    }


    useEffect(() => {
        const fetchingtotalincome = async () => {
            try {
                const token = localStorage.getItem('token');
                const allincomes = await axios.get("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/incomes/allincomes", {
                    headers: {
                        token: token
                    }
                });
                //console.log(allincomes)
                const sumofallincomes = allincomes.data.monthincome;
                //console.log(sumofallincomes);
                setTotalincome(sumofallincomes)
            } catch (error) {
                console.error("Error fetching income:", error);
            }
        }

        const fetchingtotalbudget = async () => {
            try {
                const token = localStorage.getItem('token');
                const totalbudget = await axios.get("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/budget/totalbudget", {
                    headers: {
                        token: token
                    }
                })
                const totalbudgetamount = totalbudget.data.totalbudgetamount;
                //console.log(totalbudgetamount)
                setTotalbudget(totalbudgetamount)
            } catch (error) {
                console.error("Error fetching budget:", error);
            }
        }

        const fetchingtotalexpense = async () => {
            try {
                const token = localStorage.getItem('token');
                //console.log(token)
                const totalexpense = await axios.get("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/expenses/allexpenses", {
                    headers: {
                        token: token
                    }
                })
                const totalexpenseamount = totalexpense.data.monthlytotalexpense;
                setTotalexpense(totalexpenseamount);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        }

        const fetchingcategorywisedata = async () => {
            const token = localStorage.getItem('token');
            const allcategories = await axios.get("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/category/allcategories");
            let allcategoryobj = [];
            let categorynames = allcategories.data.categories;
            console.log(categorynames);

            for (let i = 0; i < categorynames.length; i++) {
                let categoryobj = {};
                categoryobj.name = categorynames[i];
                categoryobj.spent = 0;
                categoryobj.budget = 0;

                try {
                    let categoryexpense = await axios.post("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/expenses/catexpenses", {
                        category: categorynames[i]
                    }, {
                        headers: {
                            token: token
                        }
                    });
                    categoryobj.spent = categoryexpense.data.totalmonthexpense;
                } catch (err) {
                    console.log(`Error fetching expenses for ${categorynames[i]}:`, err);
                }

                try {
                    let catbudget = await axios.post("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/budget/catbudget", {
                        category: categorynames[i]
                    }, {
                        headers: {
                            token: token
                        }
                    });
                    categoryobj.budget = catbudget.data.catbudget;
                } catch (err) {
                    console.log(`Error fetching budget for ${categorynames[i]}:`, err);
                }

                allcategoryobj.push(categoryobj);
            }

            //console.log(allcategoryobj);
            setCategories(allcategoryobj)
        }

        const fetchingdailylimit = async () => {
            const token = localStorage.getItem('token');

            const dailyexpenselimit = await axios.post("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/expenses/dailyexpense", {}, {
                headers: {
                    token: token
                }
            })
            console.log(dailyexpenselimit)
            setDailylimit(dailyexpenselimit.data.dailylimit);

        }


        fetchingtotalincome();
        fetchingtotalbudget();
        fetchingtotalexpense();
        fetchingcategorywisedata();
        fetchingdailylimit();
    }, []);



    const addincomme = async (e) => {
        const token = localStorage.getItem('token');
        const response = await axios.post("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/incomes/income", {
            amount: incAmount,
            description: incDescription
        }, {
            headers: {
                token: token
            }
        })
    }
    return (
        <div className="dashboard-layout">
            {showExpenseForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Expense</h3>
                        <form onSubmit={addexpense}>
                            <div className="form-group">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Enter amount"
                                    value={expamount}
                                    onChange={(e) => setExpamount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Enter description"
                                    value={expdescription}
                                    onChange={(e) => setExpensedesc(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    name="category"
                                    value={expcategory}
                                    onChange={(e) => setexpcategory(e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowExpenseForm(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">Add Expense</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showIncomeForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Income</h3>
                        <form onSubmit={addincomme}>
                            <div className="form-group">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Enter amount"
                                    value={incAmount}
                                    onChange={(e) => setIncAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Enter description"
                                    value={incDescription}
                                    onChange={(e) => setIncDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowIncomeForm(false)}>Cancel</button>
                                <button type="submit" className="btn-submit">Add Income</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Header />
            <main className="dashboard-content">
                <div className="summary-section">
                    <div className="summary-card income">
                        <span className="summary-title">Total {currentdate.toLocaleString('en-IN', { month: 'long' })} Income</span>
                        <span className="summary-amount">{totalincome}</span>
                    </div>
                    <div className="summary-card budget">
                        <span className="summary-title">Total {currentdate.toLocaleString('en-IN', { month: 'long' })} Budget</span>
                        <span className="summary-amount">{totalbudget}</span>
                    </div>
                    <div className="summary-card expenses">
                        <span className="summary-title">Total {currentdate.toLocaleString('en-IN', { month: 'long' })} Expenses</span>
                        <span className="summary-amount">{totalexpense}</span>
                    </div>

                    <div className="daily-limit-container">
                        <div className="daily-limit-circle">
                            <span className="daily-limit-label">Daily Limit</span>
                            <span className="daily-limit-value">{dailylimit}</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-actions">
                    <button className="btn-action btn-income" onClick={() => setShowIncomeForm(true)}>
                        <span className="action-icon">+</span>
                        Add Income
                    </button>
                    <button className="btn-action btn-expense" onClick={() => setShowExpenseForm(true)}>
                        <span className="action-icon">-</span>
                        Add Expense
                    </button>
                </div>

                <div className="category-frame">
                    <div className="category-frame-header">
                        <h2 className="category-frame-title">Category Overview</h2>
                    </div>
                    <div className="category-list">
                        {categories.length > 0 ? (
                            categories.map((category, index) => (
                                <div key={index} className={`category-item ${category.className || 'default'}`}>
                                    <div className="category-info">
                                        <div className="category-name">{category.name}</div>
                                        <div className="category-stats">
                                            Spent: <span>{category.spent}</span> / Budget: <span>{category.budget}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="category-action-btn"
                                        onClick={() => navigate('/viewdetails', { state: { category } })}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="no-categories">No categories found. Add some expenses to see them here!</div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Dashboard;
