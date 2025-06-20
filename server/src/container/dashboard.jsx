import { useLocation } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../css/dashboard.css';
import axios from 'axios';

function Dashboard() {
  const location = useLocation();
  const {
    name,
    selectoption,
    duration,
    interviewId,
    email,
    answers: initialAnswers = [],
  } = location.state || {};

  const [answers, setAnswers] = useState(initialAnswers);
  const [inputs, setInputs] = useState(initialAnswers.map(a => a.score || ""));
  const [error, setError] = useState('');
  const pdfContentRef = useRef();

  // Fetch question IDs for all answers on mount
  useEffect(() => {
    async function fetchIds() {
      const updatedAnswers = await Promise.all(answers.map(async (ans) => {
        if (ans.id) return ans;
        try {
          const res = await axios.get(`http://localhost:3000/question/by-interview-and-text/${interviewId}/${encodeURIComponent(ans.question)}`);
          return { ...ans, id: res.data.id };
        } catch (e) {
          return ans; // fallback if not found
        }
      }));
      setAnswers(updatedAnswers);
    }
    if (answers.length > 0) fetchIds();
    // eslint-disable-next-line
  }, []);

  const handleSetScore = async (index) => {
    alert("Given successfully.")
    const inputScore = inputs[index].toString().trim();
    const parsedScore = parseInt(inputScore);
    const answer = answers[index];
    if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 50) {
      if (!answer.id) {
        setError(`Cannot update score for Q${index + 1}: missing question id`);
        return;
      }
      try {
        await axios.put(`http://localhost:3000/question/${answer.id}`, { score: parsedScore });
        const updatedAnswers = [...answers];
        updatedAnswers[index] = { ...answer, score: parsedScore };
        setAnswers(updatedAnswers);
        setError('');
      } catch (err) {
        console.error(`Error updating score for Q${index + 1}:`, err);
        setError(`Failed to update Q${index + 1} score`);
      }
    } else {
      setError(`Please enter a valid score (0-50) for Q${index + 1}`);
    }
  };

  const handleDownload = () => {
    const input = pdfContentRef.current;
    if (!input) {
      setError("PDF content not found.");
      return;
    }

    input.style.display = 'block';
    html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      input.style.display = 'none';
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save('result.pdf');
    }).catch((error) => {
      input.style.display = 'none';
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    });
  };

  return (
    <>
      <div className="dashboard-container" style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '2rem 0' }}>
        <h1 style={{ color: 'var(--color-accent)', textAlign: 'center', marginBottom: 32 }}>Interview Summary</h1>
        <div className="dashboard-grid" style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div className="dashboard-card test-responses card" style={{ flex: 1.5, minWidth: 0, width: '100%' }}>
            <h2>Test Responses</h2>
            {answers.length > 0 ? answers.map((item, index) => (
              <div key={index} className="response-container" style={{ marginBottom: 24 }}>
                <p><strong>Q{index + 1}:</strong> {item.question || "Not provided"}</p>
                <pre className="response-text">{item.answer || "Not answered"}</pre>
              </div>
            )) : <p>No questions attempted.</p>}
          </div>
          <div className="right-section" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0, width: '100%' }}>
            <div className="dashboard-card candidate-info card">
              <h2 style={{ color: 'var(--color-accent)' }}>Candidate Info</h2>
              <p><strong>Name:</strong> {name || "N/A"}</p>
              <p><strong>Branch:</strong> {selectoption || "N/A"}</p>
              <p><strong>Duration:</strong> {duration || "N/A"}</p>
            </div>
            <div className="dashboard-card score-section card">
              <h2 style={{ color: 'var(--color-accent)' }}>Performance Scores</h2>
              {answers.map((item, index) => (
                <div className="score-card" key={index} >
                  <div className="score-card-div" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <h3 style={{ color: 'var(--color-accent)', margin: 0 }}>Q{index + 1} Score</h3>
                  </div>
                  <div className="score-card-div" style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
                    <input
                      type="number"
                      value={inputs[index]}
                      onChange={(e) => {
                        const newInputs = [...inputs];
                        newInputs[index] = e.target.value;
                        setInputs(newInputs);
                      }}
                      placeholder="Enter score"
                      min="0"
                      max="50"
                      className="score-input"
                      style={{ width: 100, fontSize: 16, borderRadius: 8, border: '1.5px solid var(--color-border)' }}
                    />
                    <button onClick={() => handleSetScore(index)} style={{ minWidth: 80 }}>Give</button>
                  </div>
                  {error && error.includes(`Q${index + 1}`) && <p className="error-message">{error}</p>}
                  <p style={{ marginTop: 8 }}>Score: {item.score !== undefined ? item.score : "Not set"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="buttons-container" style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 32 }}>
          <button className="action-button" onClick={handleDownload} style={{ minWidth: 180 }}>Download PDF</button>
          {error && error.includes("PDF") && <p className="error-message">{error}</p>}
        </div>
      </div>
      <div
        ref={pdfContentRef}
        className="pdf-content"
        style={{ position: 'fixed', top: 0, left: '-1000px', width: '794px', padding: 20, background: 'white', color: 'black' }}
      >
        <h2 className="pdf-heading">Interview Summary</h2>
        <div className="pdf-info-section">
          <p><strong>Name:</strong> {name || "N/A"}</p>
          <p><strong>Branch:</strong> {selectoption || "N/A"}</p>
          <p><strong>Duration:</strong> {duration || "N/A"}</p>
        </div>
        <hr />
        <div className="pdf-response-section">
          {answers.map((item, index) => (
            <div key={index}>
              <p><strong>Q{index + 1}:</strong> {item.question || "Not provided"}</p>
              <pre>{item.answer || "Not answered"}</pre>
              <p><strong>Score:</strong> {item.score !== undefined ? item.score : "Not set"}</p>
              <hr />
            </div>
          ))}
        </div>
        <p className="pdf-footer">Generated on {new Date().toLocaleString()}</p>
      </div>
    </>
  );
}

export default Dashboard;