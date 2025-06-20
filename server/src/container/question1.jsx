import { useEffect, useRef, useState } from "react";
import "../css/question1.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

function Question1() {
  const navigate = useNavigate();
  const editorRef = useRef();
  const inputRef = useRef();

  const [question1, setQuestion1] = useState("Loading question...");
  const [questionId, setQuestionId] = useState(null);
  const [answer, setAnswer] = useState("");
  const [stdin, setStdin] = useState("");
  const [isAnswerPreviewMode, setIsAnswerPreviewMode] = useState(false);
  const [runResult, setRunResult] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300);

  const location = useLocation();
  const { name, email, selectoption, interviewId, duration } = location.state || {};

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const response = await axios.get(
          `http://localhost:3000/master-question/${selectoption.toLowerCase()}`
        );
        const questions = response.data;
        if (questions.length > 0) {
          const randomIndex = Math.floor(Math.random() * questions.length);
          setQuestion1(questions[randomIndex].question_text);
          setQuestionId(questions[randomIndex].id);
        } else {
          setQuestion1("No questions found for this language.");
        }
      } catch (err) {
        setQuestion1("Failed to load question.");
      }
    }

    if (selectoption) fetchQuestion();

    const parsedDuration = parseInt(duration);
    setRemainingTime(parsedDuration * 60);

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectoption, duration]);

  const handleTimeout = async () => {
    alert("Time's up! Submitting your answer and redirecting...");
    await handleSubmit(true);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  function getEditorMode() {
    const opt = selectoption?.toLowerCase();
    if (opt === "java") return "java";
    if (opt === "python") return "python";
    if (opt === "c++") return "c_cpp";
    return "text";
  }

  function getPistonLanguage() {
    const opt = selectoption?.toLowerCase();
    if (opt === "java") return { language: "java", version: "15.0.2" };
    if (opt === "python") return { language: "python", version: "3.10.0" };
    if (opt === "c++") return { language: "cpp", version: "10.2.0" };
    return { language: "python", version: "3.10.0" };
  }

  async function handleSubmit(auto = false) {
    if (!answer.trim()) {
      if (!auto) alert("Please enter an answer before saving.");
      return;
    }

    const payload = {
      interview_id: interviewId,
      question_text: question1,
      answer_text: answer,
      master_question_id: questionId,
      score: 0,
    };

    try {
      await axios.post("http://localhost:3000/question", payload);
      if (!auto) {
        alert("Saved successfully!");
        setIsAnswerPreviewMode(true);
      } else {
        navigate("/question2", {
          state: {
            name,
            email,
            duration,
            selectoption,
            question1,
            answer,
            interviewId,
            remainingTime,
            answers: [{ question: question1, answer }],
          },
        });
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || error.message;
      alert("Failed to save answer: " + errMsg);
    }
  }

  async function runCode() {
    if (!answer.trim()) {
      alert("Please write some code to run.");
      return;
    }

    setIsRunning(true);
    setRunResult("");

    const { language, version } = getPistonLanguage();
    const payload = {
      language,
      version,
      files: [{ content: answer }],
      stdin: stdin.trim(),
      args: [],
      compile_timeout: 10000,
      run_timeout: 5000,
    };

    try {
      const res = await axios.post("https://emkc.org/api/v2/piston/execute", payload);
      const result = res.data;
      const output = [result.run?.stdout, result.run?.stderr, result.compile?.message]
        .filter(Boolean)
        .join("\n")
        .trim();
      setRunResult(output || "No output.");
    } catch (err) {
      setRunResult("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setIsRunning(false);
    }
  }

  function handleNextQuestion() {
    navigate("/question2", {
      state: {
        name,
        email,
        selectoption,
        duration,
        question1,
        answer,
        interviewId,
        remainingTime,
        answers: [{ question: question1, answer }],
      },
    });
  }

  function handleEditAnswer() {
    setIsAnswerPreviewMode(false);
    setTimeout(() => {
      editorRef.current?.editor.focus();
    }, 0);
  }

  return (
    <div className="layout-wrapper">
      <div className="sidebar">
        <div className="sidebar-header"><h1>Q-1</h1></div>
      </div>

      <div className="content-area">
        <div className="content-area-div">
          <div className="form-block-upper">
            <div className="form-block-head3"><h3>{selectoption} Interview</h3></div>
          </div>
          <div className="form-block-timer">
            <p>⏱️ Time Remaining: {formatTime(remainingTime)}</p>
          </div>
        </div>

        <div className="form-block">
          <label htmlFor="question-box">Q-1: {question1}</label>
        </div>

        <div className="form-block compiler">
          <div className="form-block1">
            <label>Your Answer Code:</label>
            {isAnswerPreviewMode && (
              <button className="form-block-btn" onClick={handleEditAnswer}>✏️ Edit</button>
            )}
          </div>

          <AceEditor
            ref={editorRef}
            mode={getEditorMode()}
            theme="monokai"
            onChange={setAnswer}
            value={answer}
            readOnly={isAnswerPreviewMode}
            name="answer-box"
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
              fontSize: 14,
            }}
            style={{ width: "100%", height: "400px" }}
          />

          {!isAnswerPreviewMode && (
            <div className="compiler-toolbar">
              <textarea
                ref={inputRef}
                className="compiler-input"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter your input here..."
              />
              <button className="btn-square" onClick={runCode} disabled={isRunning || !answer.trim()}>
                {isRunning ? "Running..." : "Run Code"}
              </button>
            </div>
          )}

          {runResult && (
            <div className="run-result">
              <h4>Run Result:</h4>
              <pre>{runResult}</pre>
            </div>
          )}
        </div>

        <div className="button-wrap">
          <button className="btn-square" onClick={() => handleSubmit(false)} disabled={isAnswerPreviewMode || !answer.trim()}>
            Save
          </button>
          <button className="btn-square" onClick={handleNextQuestion} disabled={!answer.trim()}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Question1;
