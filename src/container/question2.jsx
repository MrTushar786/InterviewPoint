import { useState } from "react";
import "../css/test.css";
import { useLocation, useNavigate } from "react-router-dom";

function Question2() {
    const [index, setIndex] = useState(1);
    const [text, setText] = useState("");
    const [text2, setText2] = useState("");
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { name, selectoption, duration, question1, answer } = location.state || {};


    function add() {
        setValue(text + " ?");
        setText("");
    }
    function remove() {
        setValue("");
    }
    function submit() {
        console.log(value);
        console.log(text2);
        console.log(name);
        if (value == "") {
            alert("Enter Question");
        } else {
            alert("Succesfully Submitted");
            navigate('/dashboard', {
                state: { name, selectoption, duration, question1, answer, value, text2 }
            });
        }
    }

    return (
        <div className="layout-wrapper">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h1>Q-2</h1>
                </div>
            </div>
            <div className="content-area">
                <div className="form-block">
                    <h3>{selectoption}</h3>
                </div>

                <div className="form-block">
                    <label htmlFor="question-box">Q-{index + 1}: {value}</label>
                    <input type="text" id="question-box" className="question-input" placeholder="What is the popular place?" value={text} onChange={(e) => {
                        setText(e.target.value)
                    }} />
                </div>

                <div className="form-block">
                    <label htmlFor="answer-box">Your Answer:</label>
                    <textarea id="answer-box" className="answer-textarea" placeholder="Type your answer here..." value={text2} onChange={(e) => {
                        setText2(e.target.value)
                    }} />
                </div>

                <div className="button-wrap">
                    <button className="btn-primary btn-outline" onClick={add}>Add Question</button>
                    <button className="btn-primary btn-outline" onClick={remove}>Remove Question</button>
                    <button className="btn-primary-save" onClick={submit}>Submit</button>

                </div>
            </div>
        </div>
    );
}

export default Question2;
