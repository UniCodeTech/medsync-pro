import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import UserService from '../../services/UserService';
import './Register.css';
import { useNavigate } from 'react-router-dom';

function Register(props) {
  const [formData, setFormData] = useState({
    patientNumber: '',
    firstName: '',
    lastName: '',
    nic: '',
    address: '',
    contactNumber: '',
    dateOfBirth: '',
    age: 0,
    gender: '',
    bloodGroup: '',
    nicRequired: false,
    isNicReadOnly: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [patientNumberMessage, setPatientNumberMessage] = useState('');
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // Form validation
  const validateForm = () => {
    const {
      firstName,
      lastName,
      nic,
      address,
      contactNumber,
      dateOfBirth,
      age,
      gender,
      bloodGroup,
    } = formData;

    const newErrors = {};
    let isValid = true;

    if (!firstName) {
      newErrors.firstName = 'First Name is required';
      isValid = false;
    }

    if (!lastName) {
      newErrors.lastName = 'Last Name is required';
      isValid = false;
    }
    if (!nic) {
      newErrors.nic = 'NIC Number is required';
      isValid = false;
    } else{
      // check NIC duplication
      if(age > 18){
        UserService.existsByNic(nic).then((resp) =>{
          console.log('NIC available in Database: ',resp.data);
          if(resp.data === false){
            console.log('Validate - Patient Created');
            isValid = true;
          } else{
            console.log('Patient not Created');
            newErrors.nic = 'NIC Number is already taken';
            isValid = false;
          }
        })
      } else{
        isValid = true;
      }
    }

    if (!contactNumber) {
      newErrors.contactNumber = 'Contact Number is required';
      isValid = false;
    }

    if (!address) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Date of Birth is required';
      isValid = false;
    }

    if (!age) {
      newErrors.age = 'Age is required';
      isValid = false;
    }

    if (!gender) {
      newErrors.gender = 'Gender is required';
      isValid = false;
    }

    if (!bloodGroup) {
      newErrors.bloodGroup = 'Blood Group is required';
      isValid = false;
    }

    setErrors(newErrors);
    console.log('Validate form: ',isValid);
    return isValid;
  };

  const navigateBack = () => {
    navigate(-1);
  };

  const savePatient = (e) => {
    console.log('savePatient');
    e.preventDefault();
  
    if (validateForm()) {
      console.log('Form Validated');
      const patient = {
        patientNumber: formData.patientNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        nic: formData.nic,
        address: formData.address,
        contactNumber: formData.contactNumber,
        dateOfBirth: formData.dateOfBirth,
        age: formData.age,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
      };

      console.log('Patient: ',patient);
  
      UserService.createPatient(patient)
        .then((res) => {
          console.log('Patient created successfully');
          const patientNumber = formData.patientNumber;
          console.log('Patient Number: ', patientNumber);
          setPatientNumberMessage(`Your Patient Number is: ${patientNumber}`);
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 5000);

          navigate(-1);
        })
        .catch((error) => {
          console.error('Error creating patient: ', error);
        });
    }
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateAge = (dateOfBirth) => {
    // Calculate age from date of birth
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleDateOfBirthBlur = (e) => {
    const dateOfBirth = e.target.value;
    const age = calculateAge(dateOfBirth);
    console.log('Age: ', age);
  
    let nic = formData.nic;
    let isNicReadOnly = formData.isNicReadOnly;
  
    if (age < 18) {
      nic = "Under 18";
      isNicReadOnly = true;
    } else {
      nic = '';
      isNicReadOnly = false;
    }
  
    const updatedFormData = {
      ...formData,
      age: age,
      nicRequired: age > 18,
      isNicReadOnly: isNicReadOnly,
      nic: nic,
    };
    setFormData(updatedFormData);
  };
  

  const getMaxDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    getLastPatientNumber();
  }, []);

  //get last patientNumber
  const getLastPatientNumber = () => {
    UserService.getLastPatientNumber().then((r) => {
      setFormData({...formData, patientNumber: r.data});
    });
  };
  console.log('showSuccessModal:', showSuccessModal);

  return (
    
    <div className="container registration-form">
      <div className="title">
        <h2>Register Patient</h2>
      </div>
      <form>
      <div className="form-group">
          <label htmlFor="firstName">Patient Number:</label>
          <input
            type="text"
            id="patientNumber"
            name="patientNumber"
            readOnly= "true"
            value={formData.patientNumber}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="form-control"
          />
          {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="form-control"
          />
          {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date Of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            max={getMaxDate()}
            onChange={handleChange}
            onBlur={handleDateOfBirthBlur}
            className="form-control"
          />
          {errors.dateOfBirth && <div className="text-danger">{errors.dateOfBirth}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="nic">NIC Number:</label>
          <input
            type="text"
            id="nic"
            name="nic"
            value={formData.nic}
            onChange={(e) => setFormData({...formData, nic: e.target.value})}
            readOnly={formData.isNicReadOnly}
            className="form-control"
          />
          {errors.nic && <div className="text-danger">{errors.nic}</div>}
          {/* {nicError && <div className="text-danger">{nicError}</div>} */}
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
          />
          {errors.address && <div className="text-danger">{errors.address}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="form-control"
          />
          {errors.contactNumber && <div className="text-danger">{errors.contactNumber}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="form-control"
          />
          {errors.age && <div className="text-danger">{errors.age}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">-Select Gender-</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <div className="text-danger">{errors.gender}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="bloodGroup">Blood Group:</label>
          <input
            type="text"
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="form-control"
          />
          {errors.bloodGroup && <div className="text-danger">{errors.bloodGroup}</div>}
        </div>
        
        <div className="button-group">
        <br/>
          <button className="btn btn-primary" onClick={savePatient}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={navigateBack}>Cancel</button>
        </div>
      </form> 
      <Modal show={showSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>New Patient Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{patientNumberMessage}</p>
        </Modal.Body>
      </Modal>

    </div>
  );
} 
  


export default Register;
