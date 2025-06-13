import { useLocation, useNavigate } from 'react-router-dom';
import "../css/home.css";
import { useState } from 'react';

function Home() {
  const [name, setName] = useState("");
  const [selectoption, setSelectoption] = useState("");
  const [duration, setDuration] = useState("");
  const durations = ["30min", "60min", "90min", "120min"];
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const startQuiz = () => {
    if (name.trim().length < 6) {
      setError("Name must be at least 6 characters long.");
    } else if (!selectoption) {
      setError("Please select a medium.");
    } else if (!duration) {
      setError("Please select a duration.");
    } else {
      setError("");
      navigate('/question1', {
        state: { name, selectoption, duration }
      });
    }
  };

  return (
    <>
      <div className="container">
        <h1>Smart Interview System</h1>

        <div className="component">
          <div className="entry">
            <div className="entry-name">
              <p>Enter Name: </p>
              <input
                type="text"
                className="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="entry-medium">
              <p>Select Medium: </p>
              <select
                id="options"
                value={selectoption}
                onChange={(e) => setSelectoption(e.target.value)}
              >
                <option value="">--Select Option--</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
                <option value="C++">C++</option>
              </select>
            </div>
          </div>

          <div className="duration">
            <p>Select Duration</p>
            {durations.map((item, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="duration"
                  value={item}
                  onChange={(e) => setDuration(e.target.value)}
                  checked={duration === item}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <button onClick={startQuiz} className="btn-int">
          Start Interview
        </button>

        {error && (
          <p className="error-para" style={{ color: "red", textAlign: "center" }}>
            {error}
          </p>
        )}
      </div>
    </>
  );
}

export default Home;
