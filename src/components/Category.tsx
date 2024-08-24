import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the structure of a Category object
interface Category {
  id: number;
  name: string;
  description: string;
}

const Category: React.FC = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [categories, setCategories] = useState<Category[]>([]); // State to store list of categories
  const [editIndex, setEditIndex] = useState<number | null>(null); // State to track the index of the category being edited
  const [name, setName] = useState(''); // State to store the name of the category being added/edited
  const [description, setDescription] = useState(''); // State to store the description of the category being added/edited

  // useEffect to check if the user is logged in and fetch categories on component mount
  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      fetchCategories(); // Fetch categories if authenticated
    }
  }, [navigate]);

  // Function to fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/categories/');
      if (response.ok) {
        const data = await response.json();
        setCategories(data); // Update state with fetched categories
      } else {
        console.error('Failed to fetch categories'); // Log error if fetching fails
      }
    } catch (error) {
      console.error('Error:', error); // Log any other errors
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    sessionStorage.removeItem('accessToken'); // Remove access token from session storage
    navigate('/login'); // Redirect to login page
  };

  // Function to handle adding a new category
  const handleAddCategory = async () => {
    const newCategory = { name, description }; // Create a new category object with name and description
    try {
      const response = await fetch('http://localhost:8080/categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory), // Send new category data in request body
      });
      if (response.ok) {
        const savedCategory = await response.json();
        setCategories([...categories, savedCategory]); // Add new category to the existing list
        setName(''); // Reset name field
        setDescription(''); // Reset description field
      } else {
        console.error('Failed to save category'); // Log error if saving fails
      }
    } catch (error) {
      console.error('Error:', error); // Log any other errors
    }
  };

  // Function to handle editing a category
  const handleEditCategory = (index: number) => {
    setEditIndex(index); // Set the index of the category being edited
    setName(categories[index].name); // Populate name field with selected category's name
    setDescription(categories[index].description); // Populate description field with selected category's description
  };

  // Function to handle updating an existing category
  const handleUpdateCategory = async () => {
    if (editIndex !== null) {
      const updatedCategory = { name, description }; // Create an updated category object with the new name and description
      try {
        const response = await fetch(`http://localhost:8080/categories/${categories[editIndex].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedCategory), // Send updated category data in request body
        });
        if (response.ok) {
          const updatedCategories = [...categories];
          updatedCategories[editIndex] = { ...updatedCategories[editIndex], ...updatedCategory }; // Update the selected category in the list
          setCategories(updatedCategories); // Update state with the modified category list
          setEditIndex(null); // Reset edit index
          setName(''); // Reset name field
          setDescription(''); // Reset description field
        } else {
          console.error('Failed to update category'); // Log error if updating fails
        }
      } catch (error) {
        console.error('Error:', error); // Log any other errors
      }
    }
  };

  // Function to handle deleting a category
  const handleDeleteCategory = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/categories/${id}`, {
        method: 'DELETE', // Send a DELETE request to the API
      });
      if (response.ok) {
        setCategories(categories.filter(category => category.id !== id)); // Remove the deleted category from the list
      } else {
        console.error('Failed to delete category'); // Log error if deletion fails
      }
    } catch (error) {
      console.error('Error:', error); // Log any other errors
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg rounded-lg lg:w-3/5">
        <h3 className="text-2xl font-bold text-center text-gray-700 mb-5">Category</h3>
        
        {/* List of categories */}
        <ul>
          {categories.map((category, index) => (
            <li key={category.id} className="flex justify-between items-center mt-4">
              <div>
                <strong>{category.name}</strong>: {category.description}
              </div>
              <div>
                <button
                  onClick={() => handleEditCategory(index)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        
        {/* Form for adding/updating category */}
        <div className="mt-8 flex items-center space-x-4">
          <div className="flex-1">
            <label htmlFor="name" className="block text-gray-700">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded py-2 px-3 text-gray-700 w-full"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="description" className="block text-gray-700">Description</label>
            <input
              id="description"
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded py-2 px-3 text-gray-700 w-full"
            />
          </div>
          <div>
            {/* Conditional rendering of Add/Update button */}
            {editIndex === null ? (
              <button
                onClick={handleAddCategory}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6"
              >
                Add Category
              </button>
            ) : (
              <button
                onClick={handleUpdateCategory}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6"
              >
                Update Category
              </button>
            )}
          </div>
        </div>
        
        {/* Logout button */}
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Category;
