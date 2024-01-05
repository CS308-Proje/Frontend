import React, { useState } from 'react';

const AddUser = ({ onClose, onAdd }) => {
  const [newUserData, setNewUserData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const handleInputChange = (event) => {
    setNewUserData({ ...newUserData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd(newUserData); // Call the onAdd function passed from the parent component
  };

  return (
    <div className="update-user-modal">
      <h1>Add User</h1>
      <div className="underline"></div>
      <form onSubmit={handleSubmit}>
        <label>
          Name: 
          <input type="text" name="name" value={newUserData.name} onChange={handleInputChange} />
        </label>

        <label>
          Username: 
          <input type="text" name="username" value={newUserData.username} onChange={handleInputChange} />
        </label>

        <label>
          Email: 
          <input type="email" name="email" value={newUserData.email} onChange={handleInputChange} />
        </label>

        <label>
          Password: 
          <input type="text" name="password" value={newUserData.password} onChange={handleInputChange} />
        </label>

        <button type="submit">Add User</button>
      </form>
      <button id="update-user-close" onClick={onClose}>Close</button>
    </div>
  );
};

export default AddUser;
