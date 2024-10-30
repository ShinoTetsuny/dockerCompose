import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const response = await axios.get('/api/');
        setMessage(response.data);
      } catch (error) {
        setMessage('Erreur : ' + error.message);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/api/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur : ' + error.message);
      }
    };

    fetchApiData();
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const response = await axios.put(`/api/users/${editingUser.id}`, {
          name,
          email,
        });
        setUsers(users.map(user => user.id === editingUser.id ? response.data : user));
        setEditingUser(null);
      } else {
        const response = await axios.post(`/api/users`, {
          name,
          email,
        });
        setUsers([...users, response.data]);
      }
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Erreur : ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Erreur : ' + error.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
  };

  return (
    <div>
      <h1>Communication avec le Back-end</h1>
      <p>{message}</p>

      <h2>Liste des utilisateurs</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)} style={{ color: 'red' }}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{editingUser ? 'Modifier un utilisateur' : 'Créer un utilisateur'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">{editingUser ? 'Modifier' : 'Créer'}</button>
      </form>
    </div>
  );
}

export default App;
