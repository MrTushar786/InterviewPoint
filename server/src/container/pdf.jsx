import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../css/style.css";

function App() {
  const pdfContentRef = useRef();

  const downloadPDF = () => {
    const input = pdfContentRef.current;

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("result.pdf");
    });
  };

  // Data to display
  const data = {
    name: "Tushar",
    company: "Boston Scientific",
    q1: "kdksjdksdjd",
    answer: "ksdskdjskddsj",
  };

  return (
    <div className="page">
      {/* Browser Display: Enhanced Dark Theme */}
      <div className="container">
        <div className="card">
          <h2 className="heading">Interview Summary</h2>
          <div className="info-section">
            <p className="info-text">
              <strong className="info-strong">Name:</strong> {data.name}
            </p>
            <p className="info-text">
              <strong className="info-strong">Company:</strong> {data.company}
            </p>
          </div>
          <div className="response-section">
            <p className="response-text">
              <strong className="response-strong">Q1:</strong> {data.q1}
            </p>
            <p className="response-text">
              <strong className="response-strong">Answer:</strong> {data.answer}
            </p>
          </div>
        </div>

        {/* Download PDF Button (Top Right) */}
        <button onClick={downloadPDF} className="download-button">
          Download PDF
        </button>
      </div>

      {/* Hidden PDF Content: Light Theme, A4-Friendly */}
      <div ref={pdfContentRef} className="pdf-content">
        <h2 className="pdf-heading">Interview Summary</h2>
        <div className="pdf-info-section">
          <p className="pdf-info-text">
            <strong>Name:</strong> {data.name}
          </p>
          <p className="pdf-info-text">
            <strong>Branch:</strong> {data.company}
          </p>
        </div>
        <div className="pdf-response-section">
          <p className="pdf-response-text">
            <strong>Q1:</strong> {data.q1}
          </p>
          <p className="pdf-answer-text">
            <strong>Answer:</strong> {data.answer}
          </p>
        </div>
        <p className="pdf-footer">
          Generated on {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default App;