import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Header from '../components/Header';
import Footer from '../components/Footer';
import './dashboard.css'; // Assuming you might want to add specific dashboard styles later
import { data } from 'react-router-dom';

function Dashboard() {

    const [totalincome, setTotalincome] = useState(0);
    const [totalbudget, setTotalbudget] = useState(0);
    const [totalexpense, setTotalexpense] = useState(0);
    const [categories, setCategories] = useState([]); // State for dynamic categories

    useEffect(() => {
        const fetchingtotalincome = async () => {
            try {
                const token = localStorage.getItem('token');
                const allincomes = await axios.get("http://172.16.33.193:3000/incomes/allincomes", {
                    headers: {
                        token: token
                    }
                });
                //console.log(allincomes)
                const sumofallincomes = allincomes.data.totalincome
                //console.log(sumofallincomes);
                setTotalincome(sumofallincomes)
            } catch (error) {
                console.error("Error fetching income:", error);
            }
        }

        const fetchingtotalbudget = async () => {
            try {
                const token = localStorage.getItem('token');
                const totalbudget = await axios.get("http://172.16.33.193:3000/budget/totalbudget", {
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
                const totalexpense = await axios.get("http://172.16.33.193:3000/expenses/allexpenses", {
                    headers: {
                        token: token
                    }
                })
                const totalexpenseamount = totalexpense.data.totalexpense;
                //console.log(totalexpenseamount);
                setTotalexpense(totalexpenseamount);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        }

        const fetchingcategorywisedata = async () => {
            const token = localStorage.getItem('token');
            const allcategories = await axios.get("http://172.16.33.193:3000/category/allcategories");
            let allcategoryobj = [];
            let categorynames = allcategories.data.categories;
            //console.log(categorynames);
            
            for(let i = 0; i < categorynames.length; i++){
                let categoryobj = {};
                let categoryexpense = await axios.post("http://172.16.33.193:3000/expenses/catexpenses", 
                    {
                        category: categorynames[i]
                    },
                    {headers: {
                        token: token
                    }}
                    
                )
                categoryobj.name = categorynames[i];
                categoryobj.spent = categoryexpense.data.totalexpense;

                let catbudget = await axios.post("http://172.16.33.193:3000/budget/catbudget",
                    {
                        category: categorynames[i]
                    },
                    {
                        headers: {
                            token: token
                        }
                    }
                )
                console.log(catbudget)
                categoryobj.budget = catbudget.data.catbudget;
                //console.log(categoryobj);
                allcategoryobj.push(categoryobj);
            }
            //console.log(allcategoryobj);
            setCategories(allcategoryobj)
        } 

        fetchingtotalincome();
        fetchingtotalbudget();
        fetchingtotalexpense();
        fetchingcategorywisedata();
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <div className="dashboard-layout">
            <Header />
            <main className="dashboard-content">
                <div className="summary-section">
                    <div className="summary-card income">
                        <span className="summary-title">Total Income</span>
                        <span className="summary-amount">{totalincome}</span>
                    </div>
                    <div className="summary-card budget">
                        <span className="summary-title">Total Budget</span>
                        <span className="summary-amount">{totalbudget}</span>
                    </div>
                    <div className="summary-card expenses">
                        <span className="summary-title">Total Expenses</span>
                        <span className="summary-amount">{totalexpense}</span>
                    </div>

                    <div className="daily-limit-container">
                        <div className="daily-limit-circle">
                            <span className="daily-limit-label">Daily Limit</span>
                            <span className="daily-limit-value">$150</span>
                        </div>
                    </div>
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
                                    <button className="category-action-btn">View Details</button>
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
