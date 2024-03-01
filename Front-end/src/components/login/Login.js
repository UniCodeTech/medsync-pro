import {  useState } from "react";
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';

function Login() {
  const [formData, setFormData] = useState({
    patientNumber: '',
    role: '',
  });

  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const { patientNumber } = formData;   // create two variable from formData
    console.log('patientNumber: ', patientNumber);
    UserService.login(patientNumber)            // Login using nic
      .then((res) => {
        if (res.status === 200) {     // if successful
          setError('');
          setFormData({...formData, role: res.data.role});
          if (res.data.role === 'patient') {                  // if patient log in
            navigate(`/patient-dashboard/${res.data.patientNumber}`);   // navigate to patient-dashboard with patient nic
          } else if (res.data.role === 'doctor') {            // if doctor
            navigate('/doctor-dashboard');                    // just navigate to doctor-dashboard
          } else if(res.data.role === 'admin'){
            navigate('/admin');
          }
        } else {
          console.log('Response from the server:', res.data);
          setError('Login failed. Please check your credentials.');
        }
      })
      .catch((error) => {
        console.error('Login failed:', error);
        setError('An error occurred during login. Please try again.');
      });
  };

  const cancel = (e) => {
    navigate('/');  // back to home
  }

  return (
    <div className="container login-container">
      <br/>
      <h2>Login</h2>
      <form>
        <div className="form-group">
          <label htmlFor="nic">Enter Your Patient Number: </label>
          <input
            type="text"
            className="form-control"
            id="patientNumber"
            name="patientNumber"
            value={formData.patientNumber}
            onChange={handleInputChange}
          />
        </div>
        <br/>
        <div className="d-flex">
          <button type="submit" className="btn btn-primary login-button m-2" onClick={handleLogin}>
            Login
          </button>
          <button type="button" className="btn btn-secondary login-button m-2" onClick={cancel}>
            Cancel
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}
    </div>

  );
}

export default Login;
