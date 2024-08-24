import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importing Link and useNavigate for navigation
import axios from "axios"; // Importing axios for HTTP requests
import { Formik, Form, Field, ErrorMessage } from "formik"; // Importing Formik components for form handling
import * as Yup from "yup"; // Importing Yup for form validation

// Interface to define the structure of an address
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

// Interface to define the structure of the User object
interface User {
  fullName: string;
  email: string;
  dateOfBirth: string;
  address: Address;
  password: string;
}

const SignUpForm: React.FC = () => {
  // State variables to manage modals and error messages
  const [showModal, setShowModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Form validation schema using Yup
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string()
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format")
      .required("Email is required"),
    dateOfBirth: Yup.date().required("Date of Birth is required"),
    address: Yup.object().shape({
      street: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      zipCode: Yup.string().required("Post Code is required"),
    }),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
  });

  // Function to handle form submission
  const handleSubmit = async (values: User) => {
    try {
      // Sending a POST request to the registration endpoint
      await axios.post("http://localhost:8080/register", values);
      setShowModal(true); // Display success modal on successful registration
    } catch (error) {
      setShowErrorMessage(true); // Display error modal on failure
      setErrorMessage(
        (error as any).response?.data?.message ||
          "An error occurred. Please try again."
      );
    }
  };

  // Function to close the success modal and navigate to the login page
  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  // Function to close the error modal
  const handleCloseErrorModal = () => {
    setShowErrorMessage(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg rounded-lg lg:w-1/3">
        <h3 className="text-2xl font-bold text-center text-gray-700 mb-5">
          Sign Up
        </h3>

        {/* Formik form setup */}
        <Formik
          initialValues={{
            fullName: "",
            email: "",
            dateOfBirth: "",
            address: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
            },
            password: "",
          }}
          validationSchema={validationSchema} // Applying validation schema
          onSubmit={handleSubmit} // Handle form submission
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Full Name field */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="fullName"
                  type="text"
                  name="fullName"
                  required
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Email field */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  name="email"
                  required
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Date of Birth field */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="dateOfBirth"
                >
                  Date of Birth
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  required
                />
                <ErrorMessage
                  name="dateOfBirth"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Street Address field */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="street"
                >
                  Address
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="street"
                  type="text"
                  name="address.street"
                  required
                />
                <ErrorMessage
                  name="address.street"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* City field */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="city"
                >
                  City
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="city"
                  type="text"
                  name="address.city"
                  required
                />
                <ErrorMessage
                  name="address.city"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* State field */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="state"
                >
                  State
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="state"
                  type="text"
                  name="address.state"
                  required
                />
                <ErrorMessage
                  name="address.state"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Post Code (ZIP) field */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="zipCode"
                >
                  Post Code
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="zipCode"
                  type="text"
                  name="address.zipCode"
                  required
                />
                <ErrorMessage
                  name="address.zipCode"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Password field */}
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  name="password"
                  required
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Submit button */}
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Sign Up
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-700 mb-4">
                User Registered
              </h2>
              <p className="text-gray-500">
                You have successfully registered. Please log in.
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-700 mb-4">
                Registration Error
              </h2>
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

        {/* Link to login page */}
        <p className="text-center text-gray-500 text-xs mt-4">
          Already have an account? <br />
          <Link
            to="/login"
            className="font-bold text-blue-500 hover:text-blue-800"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
