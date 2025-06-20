import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/home.css';
import axios from 'axios';

function Home() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [selectoption, setSelectoption] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const durations = ['30min', '60min', '90min', '120min'];
  const navigate = useNavigate();

  const [validity, setValidity] = useState({
    name: null,
    contact: null,
    email: null,
    language: null,
    duration: null,
  });

  useEffect(() => {
    const nameValid = name.trim().length >= 6;
    const contactValid = /^[0-9]{10}$/.test(contact.trim());
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const languageValid = selectoption !== '';
    const durationValid = duration !== '';
    setValidity({
      name: name ? nameValid : null,
      contact: contact ? contactValid : null,
      email: email ? emailValid : null,
      language: selectoption ? languageValid : null,
      duration: duration ? durationValid : null,
    });
  }, [name, contact, email, selectoption, duration]);

  const startQuiz = async () => {
    if (!name.trim()) return setError('Name is required.');
    if (name.trim().length < 6) return setError('Name must be at least 6 characters long.');
    if (!contact.trim()) return setError('Contact number is required.');
    if (!/^[0-9]{10}$/.test(contact)) return setError('Contact must be a valid 10-digit number.');
    if (!email.trim()) return setError('Email is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.');
    if (!selectoption) return setError('Please select a programming language.');
    if (!duration) return setError('Please select a duration.');

    setError('');

    try {
      const userRes = await axios.post('http://localhost:3000/user', {
        username: name,
        email: email,
        contact: contact,
      });
      const userId = userRes.data.id;

      const interviewRes = await axios.post('http://localhost:3000/interview', {
        company_name: 'Boston Scientific',
        duration,
        p_language: selectoption,
        user_id: userId,
      });

      const interviewId = interviewRes.data.id;

      navigate('/question1', {
        state: {
          name,
          email,
          contact,
          selectoption,
          duration,
          interviewId,
          userId,
        },
      });
    } catch (err) {
      console.error('Error from backend:', err.response?.data || err.message);
      setError('Server error — check console or ensure backend is running.');
    }
  };

  const inputClass = (field) =>
    validity[field] === null ? 'name' : validity[field] ? 'name input-valid' : 'name input-error';

  const selectClass = (field) =>
    validity[field] === null ? 'select' : validity[field] ? 'select input-valid' : 'select input-error';

  return (
    <div className="container">
      <h1>Smart Interview System</h1>
      <div className="component">
        <div className="entry">
          <div className="entry-name">
            <p>Enter Name:</p>
            <input type="text" className={inputClass('name')} value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
          </div>
          <div className="entry-name">
            <p>Enter Contact:</p>
            <input type="text" className={inputClass('contact')} value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Enter your Contact" />
          </div>
          <div className="entry-name">
            <p>Enter Email:</p>
            <input type="email" className={inputClass('email')} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email" />
          </div>
          <div className="entry-medium">
            <p>Select Medium:</p>
            <select id="options" value={selectoption} className={selectClass('language')} onChange={(e) => setSelectoption(e.target.value)}>
              <option value="">--Select Option--</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="C++">C++</option>
            </select>
          </div>
        </div>

        <div className="duration">
          <p>Select Duration:</p>
          {durations.map((item) => (
            <label key={item} style={{ marginRight: '15px' }}>
              <input type="radio" name="duration" value={item} checked={duration === item} onChange={(e) => setDuration(e.target.value)} /> {item}
            </label>
          ))}
        </div>
      </div>

      <button onClick={startQuiz} className="btn-int">Start Interview</button>

      <div className="error-wrapper">
        {error && <p className="error-para">{error}</p>}
      </div>
    </div>
  );
}

export default Home;
