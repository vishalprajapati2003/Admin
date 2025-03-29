import React from 'react';
import { Card, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { useNavigate, NavLink } from 'react-router-dom';

// import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignUp = (values, { setSubmitting }) => {
    // Generate userId and createdAt
    const userId = 'USER_' + Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();

    // Create user object
    const user = {
      ...values,
      userId,
      createdAt
    };

    // Get existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if email already exists
    if (existingUsers.some((u) => u.email === values.email)) {
      toast.error('Email already registered! Please login.');
      setSubmitting(false);
      navigate('/login');
      return;
    }

    // Check if phone number already exists
    if (existingUsers.some((u) => u.phoneNumber === values.phoneNumber)) {
      toast.error('Phone number already registered! Please login.');
      setSubmitting(false);
      navigate('/login');
      return;
    }

    // Add new user
    existingUsers.push(user);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    toast.success('Registration successful!');
    navigate('/login');
  };

  return (
    <React.Fragment>
      {/* <Breadcrumb /> */}
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless text-center">
            <Card.Body>
              <div className="mb-4">
                <i className="feather icon-user-plus auth-icon" />
              </div>
              <h3 className="mb-4">Sign up</h3>
              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: '',
                  phoneNumber: '',
                  dateOfBirth: ''
                }}
                validationSchema={Yup.object().shape({
                  firstName: Yup.string().required('First Name is required'),
                  lastName: Yup.string().required('Last Name is required'),
                  email: Yup.string().email('Must be a valid email').required('Email is required'),
                  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
                  phoneNumber: Yup.string()
                    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
                    .required('Phone number is required'),
                  dateOfBirth: Yup.date().required('Date of Birth is required').max(new Date(), 'Date of Birth cannot be in the future')
                })}
                onSubmit={handleSignUp}
              >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                      <input
                        className="form-control"
                        placeholder="First Name"
                        name="firstName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.firstName}
                      />
                      {touched.firstName && errors.firstName && <small className="text-danger form-text">{errors.firstName}</small>}
                    </div>

                    <div className="input-group mb-3">
                      <input
                        className="form-control"
                        placeholder="Last Name"
                        name="lastName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.lastName}
                      />
                      {touched.lastName && errors.lastName && <small className="text-danger form-text">{errors.lastName}</small>}
                    </div>

                    <div className="input-group mb-3">
                      <input
                        className="form-control"
                        placeholder="Email Address"
                        name="email"
                        type="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                      />
                      {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
                    </div>

                    <div className="input-group mb-4">
                      <input
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        type="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.password}
                      />
                      {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
                    </div>

                    <div className="input-group mb-3">
                      <input
                        className="form-control"
                        placeholder="Phone Number"
                        name="phoneNumber"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.phoneNumber}
                      />
                      {touched.phoneNumber && errors.phoneNumber && <small className="text-danger form-text">{errors.phoneNumber}</small>}
                    </div>

                    <div className="input-group mb-4">
                      <input
                        className="form-control"
                        placeholder="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.dateOfBirth}
                      />
                      {touched.dateOfBirth && errors.dateOfBirth && <small className="text-danger form-text">{errors.dateOfBirth}</small>}
                    </div>

                    {errors.submit && (
                      <Col sm={12}>
                        <Alert variant="danger">{errors.submit}</Alert>
                      </Col>
                    )}

                    <Button className="btn-block mb-4" color="primary" disabled={isSubmitting} type="submit" variant="primary">
                      Sign Up
                    </Button>

                    <p className="mb-0 text-muted">
                      Already have an account?{' '}
                      <NavLink to="/login" className="f-w-400">
                        Login
                      </NavLink>
                    </p>
                  </form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUp;
