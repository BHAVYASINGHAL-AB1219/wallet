import React , {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import './Signup.css';

function Signup() {
    const [email,setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const navigate = useNavigate();
    const handlesignup = async(e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {const response = await axios.post("http://172.16.34.119:3000/users/signup", {
            name: name,
            email: email,
            password: password
        })
        console.log(response);
        setSuccess(response.data.message)
        navigate("/signin")
    }catch (e){
            console.log(e)
            console.log(e.response.data.message);
            setError(e.response.data.message)
        }
    }


    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2 className="signup-title">Sign Up</h2>
                <form onSubmit = {handlesignup}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Your Name"
                            value = {name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Username"
                            value = {email}
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
                            value = {password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                    {success && <div className="success-message" style={{ color: 'green', marginTop: '10px', marginBottom:'5px' }}>{success}</div>}
                    <button type="submit" className="btn-primary">Sign Up</button>
                </form>
                <div className="signin-section">
                    <span>Already have an account?</span>
                    <Link to="/signin">Sign In</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
