import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  description: string;
}

const Category: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
    } else {
      fetchCategories();
    }
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/categories/');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    navigate('/login');
  };

  const handleAddCategory = async () => {
    const newCategory = { name, description };
    try {
      const response = await fetch('http://localhost:8080/categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });
      if (response.ok) {
        const savedCategory = await response.json();
        setCategories([...categories, savedCategory]);
        setName('');
        setDescription('');
      } else {
        console.error('Failed to save category');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditCategory = (index: number) => {
    setEditIndex(index);
    setName(categories[index].name);
    setDescription(categories[index].description);
  };

  const handleUpdateCategory = async () => {
    if (editIndex !== null) {
      const updatedCategory = { name, description };
      try {
        const response = await fetch(`http://localhost:8080/categories/${categories[editIndex].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedCategory),
        });
        if (response.ok) {
          const updatedCategories = [...categories];
          updatedCategories[editIndex] = { ...updatedCategories[editIndex], ...updatedCategory };
          setCategories(updatedCategories);
          setEditIndex(null);
          setName('');
          setDescription('');
        } else {
          console.error('Failed to update category');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/categories/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCategories(categories.filter(category => category.id !== id));
      } else {
        console.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg rounded-lg lg:w-3/5">
        <h3 className="text-2xl font-bold text-center text-gray-700 mb-5">Category</h3>
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
