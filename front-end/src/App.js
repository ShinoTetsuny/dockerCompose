import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get(`http://backend:3000/`);
        setMessage(response.data);
      } catch (error) {
        setMessage('Erreur : ' + error.message);
      }
    };

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
        const response = await axios.get(`${process.env.BACKEND_URL || 'http://app-network:3000'}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur : ' + error.message);
      }
    };

    fetchApiData();
    checkServer();
    //fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.BACKEND_URL || 'http://app-network:3000'}/users`, {
        name,
        email,
      });
      const newUser = response.data;
      setUsers([...users, newUser]);
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Erreur : ' + error.message);
    }
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
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Créer un utilisateur</h2>
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
        <button type="submit">Créer</button>
      </form>
    </div>
  );
}

export default App;
