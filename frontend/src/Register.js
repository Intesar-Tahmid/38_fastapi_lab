import React, { useState } from 'react';
import './App.css'; // Make sure the path is correct based on your project structure.

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNumber: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debugging: Log formData to console before validation
    console.log('Form data before validation:', formData);

    // Validate user input in the frontend
    if (formData.username.length <= 5) {
      setMessage('Username must be more than 5 characters.');
      console.error('Validation error: Username too short');
      return;
    }
    if (formData.password.length <= 6 || formData.password !== formData.confirmPassword) {
      setMessage('Password must be more than 6 characters and match the confirm password.');
      console.error('Validation error: Password issue');
      return;
    }
    if (formData.phoneNumber.length !== 11) {
      setMessage('Phone number must have exactly 11 digits.');
      console.error('Validation error: Phone number incorrect length');
      return;
    }

    // Debugging: Log formData to console after validation
    console.log('Form data after validation:', formData);

    // Send data to the backend using fetch
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Debugging: Log response status and status text
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      const data = await response.json();
      // Debugging: Log response data
      console.log('Response data:', data);
      setMessage(data.message);
    } catch (error) {
      console.error('Error while sending data to the server:', error);
      setMessage('An error occurred while sending data to the server.');
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div><input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} /></div>
        <div><input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} /></div>
        <div><input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} /></div>
        <div><input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /></div>
        <div><input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} /></div>
        <div><button type="submit">Register</button></div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;