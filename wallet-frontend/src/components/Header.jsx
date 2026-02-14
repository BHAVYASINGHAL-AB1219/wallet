import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any stored tokens here
        localStorage.removeItem('token');
        navigate('/signin');
    };

    return (
        <header className="header">
            <Link to="/dashboard" className="logo">Wallet</Link>
            <nav className="nav-links">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/categories" className="nav-link">My Categories</Link>
                <Link to="/budget" className="nav-link">Budget</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </nav>
        </header>
    );
}

export default Header;
