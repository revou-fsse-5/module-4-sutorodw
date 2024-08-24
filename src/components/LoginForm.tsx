import React, { useState } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface User {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: {
    email: string;
    id: number;
  };
}

const LoginForm: React.FC = () => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  const handleSubmit = async (values: User) => {
    try {
      const response = await axios.post<LoginResponse>('http://localhost:8080/login', values);
      console.log('User successfully logged in:', response.data);

      sessionStorage.setItem('accessToken', response.data.accessToken);

      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      if (typeof (error as any).response?.data === 'string') {
        setErrorMessage((error as any).response.data);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
      setShowErrorMessage(true);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorMessage(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg rounded-lg lg:w-1/3">
        <h3 className="text-2xl font-bold text-center text-gray-700 mb-5">Login</h3>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  name="email"
                  required
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  name="password"
                  required
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Sign In
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Error Modal */}
        {showErrorMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Login Error</h2>
              <p className="text-gray-500">{errorMessage}</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleCloseErrorModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-gray-500 text-xs mt-4">
          Don't have an account? <br />
          <Link to="/signup" className="font-bold text-blue-500 hover:text-blue-800">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;