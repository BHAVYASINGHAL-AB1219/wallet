import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import './Signin.css';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [signin, setSignin] = useState('');


    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post("https://n5igchtqxaczere6rgsl2odzuq0mvrvl.lambda-url.eu-north-1.on.aws/users/signin", {
                email: email,
                password: password
            });
            setSignin(response.data.message);
            const token = response.data.token;
            console.log(token)
            localStorage.setItem('token', token)
            navigate('/dashboard')
        } catch (err) {
            console.error(err.response.data.message);
            if (err.response && err.response.data) {
                setError(err.response.data[0].message);
            }
            else if(err.response.data.message){
                setError(err.response.data.message);
            }
            else {
                setError("An error occurred during sign in.");
            }
        }
    };

    const handleSignUpClick = () => {

        console.log('Sign Up button clicked - Redirect to Signup page');

    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                <h2 className="signin-title">Sign In</h2>
                <form onSubmit={handleSignIn}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                    {signin && <div className="signin-message" style={{ color: 'green', marginTop: '10px', marginBottom: '5px' }}>{signin}</div>}
                    <button type="submit" className="btn-primary">Sign In</button>
                </form>
                <div className="signup-section">
                    <span>Not signed up yet?</span>
                    <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

export default SignIn;