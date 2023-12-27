import React, { useState } from 'react';

const UpdateUser = ({ user, onClose, onUpdate }) => {
  const [userData, setUserData] = useState(user);

  const handleInputChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdate(userData);
  };

  return (
    <div className="update-user-modal">
      <form onSubmit={handleSubmit}>
        <label>
          Name: 
          <input type="text" name="name" value={userData.name} onChange={handleInputChange} />
        </label>

        <label>
          Username: 
          <input type="text" name="username" value={userData.username} onChange={handleInputChange} />
        </label>

        <label>
          Email: 
          <input type="email" name="email" value={userData.email} onChange={handleInputChange} />
        </label>

        <label>
          Role: 
          <input type="text" name="role" value={userData.role} onChange={handleInputChange} />
        </label>

        <button type="submit">Update User</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default UpdateUser;
