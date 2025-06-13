import { useEffect, useRef, useState } from "react";
import "../css/test.css";
import { useLocation, useNavigate } from "react-router-dom";
import { java, python, cpp } from "../component/questiondata"

function Question1() {
    const navigate = useNavigate();
    const [questionNo, setQuestionNo] = useState(0);
    const [index] = useState(() => Math.floor(Math.random() * 10));
    const [answer, setAnswer] = useState("");
    const [show, setShow] = useState(0);
    const textarearef = useRef();



    const location = useLocation();
    const { name, selectoption, duration } = location.state || {};

    function selectQuestion() {
    const option = selectoption?.toLowerCase()?.trim();
    if (option === "java" && java[index]) {
        return java[index].question;
    } else if (option === "python" && python[index]) {
        return python[index].question;
    } else if (option === "c++" && cpp[index]) {
        return cpp[index].question;
    } else {
        return "Question not available.";
    }
}


    const question1 = selectQuestion();
    function submit() {
        alert("Saved successfully");
        // localStorage.setItem("question1", JSON.stringify({question1 , answer }))
        setShow(1);
        console.log(question1);
        console.log(answer);
    }


    function next() {
        navigate("/question2", {
            state: { name, selectoption, duration, question1, answer }
        });
    }

    function edit() {
        setShow(0);
        setTimeout(() => {
            textarearef.current?.focus();
        }, 0)
    }

    return (
        <div className="layout-wrapper">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h1>Q-1</h1>
                </div>
            </div>

            <div className="content-area">
                <div className="form-block">
                    <h3>{selectoption}</h3>
                </div>

                <div className="form-block">
                    <label htmlFor="question-box">Q-{questionNo + 1}: {selectQuestion()}</label>
                </div>

                <div className="form-block">
                    <div className="form-block1">
                        <label htmlFor="answer-box">Your Answer:</label>
                        <button className="form-block-btn" disabled={show == 0 ? true : false} onClick={edit} ><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#ffff"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg></button>

                    </div>
                    <textarea
                        ref={textarearef}
                        id="answer-box"
                        className="answer-textarea"
                        disabled={show == 1 ? true : false}
                        value={answer}
                        placeholder="Type your answer here..."
                        onChange={(e) => setAnswer(e.target.value)}
                    ></textarea>
                </div>

                <div className="button-wrap">
                    <button className="btn-primary-save" onClick={submit} disabled={show == 1 ? true : false}>Save</button>
                    <button className="btn-primary-next" onClick={next}>Next</button>
                </div>
            </div>
        </div>
    );
}

export default Question1;
