import { useState } from 'react';
import '../css/quize.css';
import { Navigate, useNavigate } from 'react-router-dom';

function Quize() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [option, setOption] = useState(-1);
  const [optionClasses, setOptionClasses] = useState(["", "", "", ""]);
  const [submitted, setSubmitted] = useState(false);

  const data = [
    {
        "question": "What does CPU stand for?",
        "option1": "Central Process Unit",
        "option2": "Central Processing Unit",
        "option3": "Computer Processing Unit",
        "option4": "Control Process Unit",
        "correct": "Central Processing Unit"
    },
    {
        "question": "Which language is used to style web pages?",
        "option1": "HTML",
        "option2": "JQuery",
        "option3": "CSS",
        "option4": "XML",
        "correct": "CSS"
    },
    {
        "question": "Which one is a version control system?",
        "option1": "Git",
        "option2": "Node.js",
        "option3": "Docker",
        "option4": "Linux",
        "correct": "Git"
    },
    {
        "question": "What does RAM stand for?",
        "option1": "Random Access Memory",
        "option2": "Read Access Memory",
        "option3": "Rapid Access Memory",
        "option4": "Run Access Memory",
        "correct": "Random Access Memory"
    },
    {
        "question": "Which of the following is a NoSQL database?",
        "option1": "MySQL",
        "option2": "MongoDB",
        "option3": "PostgreSQL",
        "option4": "Oracle",
        "correct": "MongoDB"
    },
    {
        "question": "What does HTTP stand for?",
        "option1": "HyperText Transfer Protocol",
        "option2": "HyperText Transmission Protocol",
        "option3": "HighText Transfer Protocol",
        "option4": "Hyper Transmission Text Protocol",
        "correct": "HyperText Transfer Protocol"
    },
    {
        "question": "Which data structure uses FIFO (First In First Out)?",
        "option1": "Stack",
        "option2": "Queue",
        "option3": "Linked List",
        "option4": "Tree",
        "correct": "Queue"
    },
    {
        "question": "Which operator is used for assignment in most programming languages?",
        "option1": "=",
        "option2": "==",
        "option3": "!=",
        "option4": ":=",
        "correct": "="
    },
    {
        "question": "Which of these is a compiled language?",
        "option1": "JavaScript",
        "option2": "Python",
        "option3": "Java",
        "option4": "PHP",
        "correct": "Java"
    },
    {
        "question": "What is an example of an operating system?",
        "option1": "Linux",
        "option2": "HTML",
        "option3": "GitHub",
        "option4": "MySQL",
        "correct": "Linux"
    }
];
  

  const arr = ["option1", "option2", "option3", "option4"];
  let [score, setScore] = useState(0);

  function prev() {
    const prevIndex = index - 1;
    if (prevIndex >= 0) {
      setIndex(prevIndex);
      setOption(-1);
      setOptionClasses(["", "", "", ""]);
      setSubmitted(false);
    }
  }

  function next() {
    if (option !== -1 && data[index][arr[option]] === data[index].correct) {
      setScore(score + 1);
    }

    const nextIndex = index + 1;
    if (nextIndex < data.length) {
      setIndex(nextIndex);
      setOption(-1);
      setOptionClasses(["", "", "", ""]);
      setSubmitted(false);
    } else {
      navigate("/result", { state: { score } });
    }
  }



  function sub() {
    navigate("/result", { state: { score } });

  }
  function clear() {
    setOption(-1);
    setOptionClasses(["", "", "", ""]);
    setSubmitted(false);
  }


  function check(selectedIndex) {
    if (submitted) return;

    setOption(selectedIndex);
    const selectedOptionText = data[index][arr[selectedIndex]];
    const isCorrect = selectedOptionText === data[index].correct;

    const newClasses = ["", "", "", ""];
    newClasses[selectedIndex] = isCorrect ? "green" : "red";

    setOptionClasses(newClasses);
    setSubmitted(true);
  }



  return (
    <>

      <div className="quize-cont">
        <h1>Quize Game</h1>
        <p>Q-{index + 1} {data[index].question}</p>
        <div className="quize-cont-option">

          {arr.map((optKey, i) => (
            <button
              key={i}
              className={optionClasses[i]}
              onClick={() => check(i)}
              disabled={submitted}
            >
              {data[index][optKey]}
            </button>
          ))}

        </div>
        <div className="quize-cont-sub">
          <button className='prev' disabled={index == 0 ? true : false} onClick={prev}>Previous</button>
          <button className='sub' onClick={sub}>Submit</button>
          <button className='next' disabled={option == -1 ? true : false} onClick={next}>Next</button>
          <button className='clear' disabled={option == -1 ? true : false} onClick={clear}>Clear</button>
        </div>
      </div>
    </>
  )
}
export default Quize;