import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ViewDetails.css';

function ViewDetails() {
    const navigate = useNavigate();
    const location = useLocation();

    // Mock data for design purposes - user will implement logic later
    const categoryName = location.state?.category?.name || "Category Name";
    const mockExpenses = [
        { id: 1, date: '2023-10-25', description: 'Grocery Shopping', amount: 150.00 },
        { id: 2, date: '2023-10-22', description: 'Lunch at Cafe', amount: 45.50 },
        { id: 3, date: '2023-10-20', description: 'Snacks', amount: 20.00 },
        { id: 4, date: '2023-10-18', description: 'Vegetables', amount: 35.00 },
    ];

    const totalSpent = mockExpenses.reduce((acc, curr) => acc + curr.amount, 0);


    const [Expenses, setExpenses] = useState([]);
    const [totalexpense, setTotalexpense] = useState(0);

    const fetchallexpenses = async (e) => {
        const token = localStorage.getItem('token');
        const allexpenses = await axios.post("http://172.16.33.202:3000/expenses/catexpenses", {
            category: categoryName
        },{
            headers: {
                token: token
            }
        })

        console.log(allexpenses.data);
        setExpenses(allexpenses.data.expenses);
        setTotalexpense(allexpenses.data.totalexpense);

    }
    useEffect(() => {
        if(categoryName !== "Category Name"){
        fetchallexpenses();
    }
    },[categoryName])
    
    
    return (
        <div className="view-details-layout">
            <Header />
            <main className="view-details-content">
                <div className="details-header">
                    <button className="btn-back" onClick={() => navigate('/dashboard')}>
                        ← Back to Dashboard
                    </button>
                    <h1 className="details-title">{categoryName} Overview</h1>
                </div>

                <div className="details-summary-cards">
                    <div className="details-card total-spent">
                        <span className="card-label">Total Spent</span>
                        <span className="card-value">{totalexpense.toFixed(2)}</span>
                    </div>
                    <div className="details-card transactions-count">
                        <span className="card-label">Transactions</span>
                        <span className="card-value">{Expenses.length}</span>
                    </div>
                </div>

                <div className="transactions-list-container">
                    <h2 className="section-title">Expense History</h2>
                    <div className="transactions-table-wrapper">
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Expenses.map((expense) => (
                                    <tr key={expense._id}>
                                        <td className="date-col">{expense.createdAt}</td>
                                        <td className="desc-col">{expense.description}</td>
                                        <td className="amount-col">{expense.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ViewDetails;
