import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL || 'http://backend:3000'}/`);
        if (response.ok) {
          const data = await response.text();
          setMessage(data);
        } else {
          setMessage('Erreur de connexion au serveur');
        }
      } catch (error) {
        setMessage('Erreur : ' + error.message);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL || 'http://backend:3000'}/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Erreur : ' + error.message);
      }
    };

    checkServer();
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://backend:3000'}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      if (response.ok) {
        const newUser = await response.json();
        setUsers([...users, newUser]);
        setName('');
        setEmail('');
      } else {
        console.error('Erreur lors de la création de l\'utilisateur');
      }
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
