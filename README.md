
## Explanation of Key Parts:
- **State Management:** `useState` hooks are used to manage form fields, the list of categories, and the index of the category being edited.
- **Effect Hook:** `useEffect` is used to check for user authentication and fetch categories from the server when the component mounts.
- **Event Handlers:** Functions like `handleAddCategory`, `handleEditCategory`, `handleUpdateCategory`, and `handleDeleteCategory` manage interactions with the server for adding, updating, and deleting categories.
- **Conditional Rendering:** The component conditionally renders the "Add" or "Update" button based on whether a category is being edited.
- **Logout Functionality:** The `handleLogout` function removes the access token and redirects the user to the login page.

![Screenshot](/src/Screenshot1.png)
![Screenshot](/src/Screenshot2.png)