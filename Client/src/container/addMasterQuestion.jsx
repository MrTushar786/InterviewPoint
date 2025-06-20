import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/addMasterQuestion.css';

const AddMasterQuestion = () => {
    const [questions, setQuestions] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [formData, setFormData] = useState({ language: '', question_text: '' });
    const [status, setStatus] = useState('');
    const [editId, setEditId] = useState(null);

    const fetchQuestions = async () => {
        try {
            const res = await axios.get('http://localhost:3000/master-question');
            setQuestions(res.data);
            // Filter on initial load if language is selected
            if (formData.language) {
                setFiltered(res.data.filter(q => q.language === formData.language));
            } else {
                setFiltered(res.data);
            }
        } catch (err) {
            console.error('Error fetching questions:', err);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };
        setFormData(updated);

        if (name === 'language') {
            const filteredQs = value
                ? questions.filter(q => q.language === value)
                : questions;
            setFiltered(filteredQs);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`http://localhost:3000/master-question/${editId}`, formData);
                setStatus('✅ Question updated!');
            } else {
                await axios.post('http://localhost:3000/master-question', formData);
                setStatus('✅ Question added!');
            }
            setFormData({ language: formData.language, question_text: '' }); // keep selected language
            setEditId(null);
            fetchQuestions();
        } catch (err) {
            console.error('Save failed', err);
            setStatus('❌ Save failed');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/master-question/${id}`);
            fetchQuestions();
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const handleEdit = (q) => {
        setFormData({ language: q.language, question_text: q.question_text });
        setEditId(q.id);
    };

    return (
        <div className="mmq-page">
            <div className="mmq-container">
                <h2>📘 Manage Master Questions</h2>
                <form onSubmit={handleSubmit} className="mmq-form-group">
                    <select
                        className="mmq-select"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select Language --</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="c++">C++</option>
                    </select>
                    <textarea
                        className="mmq-textarea"
                        name="question_text"
                        placeholder="Enter question"
                        value={formData.question_text}
                        onChange={handleChange}
                        required
                    />
                    <button className="mmq-button" type="submit">
                        {editId ? 'Update Question' : 'Add Question'}
                    </button>
                </form>

                {status && <p className="mmq-status">{status}</p>}

                <div className="mmq-question-list">
                    <h3>📄 Questions for {formData.language || 'All Languages'}</h3>
                    {filtered.length === 0 ? (
                        <p>No questions found.</p>
                    ) : (
                        <ul>
                            {filtered.map((q) => (
                                <li key={q.id}>
                                    <div className="mmq-btn-group">
                                        <strong>{q.language}:</strong> {q.question_text}
                                    </div>
                                    <div className="mmq-btn-group">
                                        <button className="mmq-button" onClick={() => handleEdit(q)}>✏ Edit</button>
                                        <button className="mmq-button" onClick={() => handleDelete(q.id)}>🗑 Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddMasterQuestion;
