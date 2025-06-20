import { useRef, useState, useEffect } from "react";
import "../css/question2.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

function QuestionDynamic() {
  const navigate = useNavigate();
  const editorRef = useRef();
  const inputRef = useRef();

  const [questionInputText, setQuestionInputText] = useState("");
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [answerCode, setAnswerCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [isQuestionLocked, setIsQuestionLocked] = useState(false);
  const [isAnswerPreviewMode, setIsAnswerPreviewMode] = useState(false);
  const [runResult, setRunResult] = useState("");
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(2);

  const location = useLocation();
  const {
    name, email, selectoption, interviewId, duration,
    question1, answer: answer1, answers: initialAnswers = [],
    remainingTime: initialRemaining = 300,
  } = location.state || {};

  const [remainingTime, setRemainingTime] = useState(initialRemaining);
  const [timeoutTriggered, setTimeoutTriggered] = useState(false);
  const [allAnswersSubmitted, setAllAnswersSubmitted] = useState(() => {
    let arr = [];
    if (question1 && answer1) arr.push({ question: question1, answer: answer1 });
    if (initialAnswers && initialAnswers.length > 0) arr = arr.concat(initialAnswers);
    return arr.filter((item, idx, arr) =>
      item.question && item.answer &&
      arr.findIndex((x) => x.question === item.question && x.answer === item.answer) === idx
    );
  });

  useEffect(() => {
    if (!name || !selectoption || !interviewId) {
      alert("Incomplete interview data. Redirecting to home.");
      navigate("/");
      return;
    }
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1 && !timeoutTriggered) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [name, selectoption, interviewId, timeoutTriggered, navigate]);

  const handleTimeout = async () => {
    if (timeoutTriggered) return;
    setTimeoutTriggered(true);
    alert("Time's up! Submitting your answers...");
    await handleSubmitAll();
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const getEditorMode = () => {
    const opt = selectoption?.toLowerCase()?.trim();
    return opt === "java" ? "java" : opt === "python" ? "python" : opt === "c++" ? "c_cpp" : "text";
  };

  const getPistonLanguage = () => {
    const opt = selectoption?.toLowerCase()?.trim();
    if (opt === "java") return { language: "java", version: "15.0.2" };
    if (opt === "python") return { language: "python", version: "3.10.0" };
    if (opt === "c++") return { language: "cpp", version: "10.2.0" };
    return { language: "python", version: "3.10.0" };
  };

  const saveCurrentQuestionToDB = async () => {
    if (!displayedQuestion.trim() || !answerCode.trim()) {
      alert("Question and answer cannot be empty.");
      return false;
    }
    try {
      await axios.post("http://localhost:3000/question", {
        interview_id: interviewId,
        question_text: displayedQuestion,
        answer_text: answerCode,
        score: 0,
      });
      return true;
    } catch (err) {
      console.error(err);
      alert("Failed to save the question.");
      return false;
    }
  };

  const handleAddQuestion = () => {
    if (!questionInputText.trim()) return alert("Enter a question first");
    setDisplayedQuestion(questionInputText.trim() + " ?");
    setIsQuestionLocked(true);
  };

  const handleRemoveQuestion = () => {
    setDisplayedQuestion("");
    setQuestionInputText("");
    setIsQuestionLocked(false);
    setAnswerCode("");
    setRunResult("");
    setStdin("");
    setIsAnswerPreviewMode(false);
  };

  const handleSave = async () => {
    alert("Saved successfully!")
    const saved = await saveCurrentQuestionToDB();
    if (saved) {
      setIsAnswerPreviewMode(true);
      const newAnswer = { question: displayedQuestion, answer: answerCode };
      setAllAnswersSubmitted((prev) => prev.some(a => a.question === newAnswer.question) ? prev : [...prev, newAnswer]);
    }
  };

  const handleEditAnswer = () => {
    setIsAnswerPreviewMode(false);
    setTimeout(() => editorRef.current?.editor.focus(), 0);
  };

  const handleAddNextQuestion = async () => {
    const saved = isAnswerPreviewMode || await saveCurrentQuestionToDB();
    if (saved) {
      const newAnswer = { question: displayedQuestion, answer: answerCode };
      setAllAnswersSubmitted((prev) => prev.some(a => a.question === newAnswer.question) ? prev : [...prev, newAnswer]);
      setCurrentQuestionNumber((n) => n + 1);
      setDisplayedQuestion("");
      setQuestionInputText("");
      setAnswerCode("");
      setStdin("");
      setIsQuestionLocked(false);
      setRunResult("");
      setIsAnswerPreviewMode(false);
    }
  };

  const handleSubmitAll = async () => {
    let finalAnswers = [...allAnswersSubmitted];
    if (!isAnswerPreviewMode && displayedQuestion.trim() && answerCode.trim()) {
      const saved = await saveCurrentQuestionToDB();
      if (saved) finalAnswers.push({ question: displayedQuestion, answer: answerCode });
    }
    navigate("/dashboard", {
      state: {
        name,
        email,
        selectoption,
        interviewId,
        duration,
        question1,
        answer1,
        answers: finalAnswers,
        remainingTime,
      },
    });
  };

  const runCode = async () => {
    if (!answerCode.trim()) return setRunResult("No code to run");
    setIsRunningCode(true);
    const { language, version } = getPistonLanguage();
    try {
      const { data } = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language,
        version,
        files: [{ content: answerCode }],
        stdin,
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000,
      });
      const output = [data.run?.stdout, data.run?.stderr, data.compile?.message].filter(Boolean).join("\n");
      setRunResult(output || "No output");
    } catch (err) {
      setRunResult("Run error: " + err.message);
    } finally {
      setIsRunningCode(false);
    }
  };

  const isComplete = displayedQuestion.trim() && answerCode.trim();

  return (
    <div className="layout-wrapper">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 style={{ color: "#2aaaff" }}>Q-{currentQuestionNumber}</h1>
        </div>
      </div>
      <div className="content-area">
        <div className="form-block-upper">
          <h3 style={{ color: "#2aaaff" }}>{selectoption} Interview</h3>
          <p>⏱️ Time Remaining: {formatTime(remainingTime)}</p>
        </div>
        <div className="form-block">
          <label>Q-{currentQuestionNumber}: {displayedQuestion || "Enter your custom question below"}</label>
          <input
            type="text"
            className="question-input"
            placeholder="Type your custom question here"
            value={questionInputText}
            onChange={(e) => setQuestionInputText(e.target.value)}
            disabled={isQuestionLocked}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button onClick={handleAddQuestion} disabled={isQuestionLocked} className="btn-square">Add Question</button>
            <button onClick={handleRemoveQuestion} className="btn-square" disabled={!isQuestionLocked}>Remove Question</button>
          </div>
        </div>
        <div className="form-block compiler">
          <div className="compiler-div">
            <div className="compiler-div1">
              <label>Your Answer Code:</label>
            </div>
            <div className="compiler-div2">
              {isAnswerPreviewMode && <button className="div-btn" onClick={handleEditAnswer}>✏️ Edit</button>}
            </div>
          </div>
          <AceEditor
            ref={editorRef}
            mode={getEditorMode()}
            theme="monokai"
            onChange={setAnswerCode}
            value={answerCode}
            readOnly={isAnswerPreviewMode}
            name="answer-box"
            setOptions={{ enableBasicAutocompletion: true, enableLiveAutocompletion: true, enableSnippets: true, showLineNumbers: true, tabSize: 2, fontSize: 14 }}
            style={{ width: "100%", height: "400px" }}
          />
          {!isAnswerPreviewMode && (
            <div className="submit-div">
              <div className="submit-div1">
                <textarea
                  ref={inputRef}
                  className="compiler-input"
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="Enter your input here (stdin)..."
                />
              </div>
              <div className="submit-div1">
                <button onClick={runCode} disabled={isRunningCode || !answerCode.trim()} className="btn-square">
                  {isRunningCode ? "Running..." : "Run Code"}
                </button>
              </div>
            </div>
          )}
          {runResult && <pre className="run-result">{runResult}</pre>}
        </div>
        <div className="button-wrap">
          <button onClick={handleAddNextQuestion} className="btn-square" disabled={!isComplete}>Add Another Question</button>
          <button onClick={handleSave} className="btn-square" disabled={!isComplete || isAnswerPreviewMode}>Save</button>
          <button onClick={handleSubmitAll} className="btn-square" disabled={!isComplete && allAnswersSubmitted.length === 0}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default QuestionDynamic;
