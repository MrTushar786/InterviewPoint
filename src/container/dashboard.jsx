import { useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../css/dashboard.css';

function Dashboard() {
  const location = useLocation();
  const { name, selectoption, duration, question1, answer, value, text2 } = location.state || {};
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');
  const [inputScore1, setInputScore1] = useState('');
  const [inputScore2, setInputScore2] = useState('');
  const [error, setError] = useState('');

  const pdfcontentref = useRef();

  const handleDownload = () => {
    const input = pdfcontentref.current;
    if (!input) {
      setError("PDF content not found.");
      return;
    }

    input.style.display = 'block'; // Temporarily show for rendering
    html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      input.style.display = 'none'; // Hide after capture
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save('result.pdf');
    }).catch((error) => {
      input.style.display = 'none';
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    });
  };

  const handleSetScore1 = () => {
    const score = parseInt(inputScore1);
    if (!isNaN(score) && score >= 0 && score <= 50) {
      setScore1(score.toString());
      setError('');
    } else {
      setError("Please enter a valid score between 0 and 50 for Q1");
    }
  };

  const handleSetScore2 = () => {
    const score = parseInt(inputScore2);
    if (!isNaN(score) && score >= 0 && score <= 50) {
      setScore2(score.toString());
      setError('');
    } else {
      setError("Please enter a valid score between 0 and 50 for Q2");
    }
  };

  return (
    <>
      <div className="dashboard-container">
        <h1>Interview Summary</h1>

        <div className="dashboard-grid">
          <div className="dashboard-card test-responses">
            <h2>Test Responses</h2>
            <div className="response-container">
              <p><strong>Q1:</strong> {question1 || "Not provided"}</p>
              <pre className="response-text">{answer || "Not Answered"}</pre>
            </div>
            <hr />
            <div className="response-container">
              <p><strong>Q2:</strong> {value || "Not provided"}</p>
              <pre className="response-text">{text2 || "Not Answered"}</pre>
            </div>
          </div>

          <div className="right-section">
            <div className="dashboard-card candidate-info">
              <h2>Candidate Info</h2>
              <p><strong>Name:</strong> {name || "N/A"}</p>
              <p><strong>Branch:</strong> {selectoption || "N/A"}</p>
              <p><strong>Duration:</strong> {duration || "N/A"}</p>
            </div>

            <div className="dashboard-card score-section">
              <h2>Performance Scores</h2>

              <div className="score-card">
                <h3>Q1 Performance Score</h3>
                <input
                  type="number"
                  value={inputScore1}
                  onChange={(e) => setInputScore1(e.target.value)}
                  placeholder="Enter score"
                  min="0"
                  max="50"
                  className="score-input"
                  aria-label="Q1 Performance Score"
                />
                <button onClick={handleSetScore1}>Give</button>
                {error && error.includes("Q1") && <p className="error-message">{error}</p>}
                <p>Score: {score1 || "Not set"}</p>
              </div>

              <hr />

              <div className="score-card">
                <h3>Q2 Performance Score</h3>
                <input
                  type="number"
                  value={inputScore2}
                  onChange={(e) => setInputScore2(e.target.value)}
                  placeholder="Enter score"
                  min="0"
                  max="50"
                  className="score-input"
                  aria-label="Q2 Performance Score"
                />
                <button onClick={handleSetScore2}>Give</button>
                {error && error.includes("Q2") && <p className="error-message">{error}</p>}
                <p>Score: {score2 || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="buttons-container">
          <button className="action-button" onClick={handleDownload}>Download PDF</button>
          {error && error.includes("PDF") && <p className="error-message">{error}</p>}
        </div>
      </div>

      <div ref={pdfcontentref} className="pdf-content" style={{ position: 'fixed', top: 0, left: '-1000px', width: '794px', padding: 20, background: 'white', color: 'black' }}>
        <h2 className="pdf-heading">Interview Summary</h2>
        <div className="pdf-info-section">
          <p><strong>Name:</strong> {name || "N/A"}</p>
          <p><strong>Branch:</strong> {selectoption || "N/A"}</p>
          <p><strong>Duration:</strong> {duration || "N/A"}</p>
        </div>
        <hr />
        <div className="pdf-response-section">
          <p><strong>Q1:</strong> {question1 || "Not provided"}</p>
          <pre>{answer || "Not answered"}</pre>
          <p><strong>Q2:</strong> {value || "Not provided"}</p>
          <pre>{text2 || "Not answered"}</pre>
        </div>
        <hr />
        <div className="pdf-score">
          <p><strong>Q1 Score:</strong> {score1 || "Not set"}</p>
          <p><strong>Q2 Score:</strong> {score2 || "Not set"}</p>
        </div>
        <p className="pdf-footer">Generated on {new Date().toLocaleString()}</p>
      </div>
    </>
  );
}

export default Dashboard;