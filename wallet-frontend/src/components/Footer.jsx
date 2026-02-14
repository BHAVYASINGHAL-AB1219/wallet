import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-brand">Wallet</div>
                    <div className="footer-links">
                        <Link to="#" className="footer-link">About Us</Link>
                        <Link to="#" className="footer-link">Privacy Policy</Link>
                        <Link to="#" className="footer-link">Terms of Service</Link>
                        <Link to="#" className="footer-link">Contact</Link>
                    </div>
                </div>
                <div className="footer-copyright">
                    &copy; {currentYear} Wallet App. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
