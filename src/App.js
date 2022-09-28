import { useState, useEffect ,useRef} from "react";
import randomWords from "random-words";
import "./App.css";
const NUMB_OF_WORD = 100;
const SECOND = 30;

function App() {
  const [words, setwords] = useState([]);
  const [countDown, setcountDown] = useState(SECOND);

  const [currInput, setcurrInput] = useState("");
  const [currWordIndex, setcurrWordIndex] = useState(0);

  const [correct, setcorrect] = useState(0);
  const [incorrect, setincorrect] = useState(0);

  const [status, setStatus] = useState("waiting");

  const [currCharIndex, setcurrCharIndex] = useState(-1);
  const [currChar, setcurrChar] = useState(-1);

  const textInput =useRef(null) 

  function start() {

    if(status==='finished')
    {

      setwords(generateWords());
      setcurrWordIndex(0);
      setcorrect(0);
      setincorrect(0);
      setcurrCharIndex(-1);
      setcurrChar('')

    }
    if(status !== 'started')
    {
      setStatus('started')

      let interval = setInterval(() => {
      setcountDown((prevCount) => {
        if (prevCount === 0) {
          clearInterval(interval);
          setStatus('finished');
          setcurrInput('');
          return SECOND;
          
        } else {
          return prevCount - 1;
        }
      });
    }, 1000);

    }
     if(status === 'started') {
      setTimeout(() => {
        setwords(generateWords());
        setcountDown(SECOND);
        
      },500)
      textInput.current.focus();
      setcurrWordIndex(0);
      setcorrect(0);
      setincorrect(0);
      setcurrCharIndex(-1);
      setcurrChar('');
      
      
    } 

    
  }
  function generateWords() {
    return new Array(NUMB_OF_WORD).fill(null).map(() => randomWords());
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();
    // console.log({ doesItMatch });

    if (doesItMatch) {
      setcorrect(correct + 1);
    } else {
      setincorrect(incorrect + 1);
    }
  }
  
  
  function handleKeyDown({ keyCode,key }) {
   
    if (keyCode === 32) {
      checkMatch();
      setcurrInput("");
      setcurrWordIndex(currWordIndex + 1);
      setcurrCharIndex(-1)
    }
    else if(keyCode===8)
    {
      setcurrCharIndex(currCharIndex - 1);
      setcurrChar('')
    }
    else{ setcurrCharIndex(currCharIndex + 1);
      setcurrChar(key)}
  }

function getCharClass(wordIdx,charIdx,char) {
    if(wordIdx===currWordIndex && charIdx===currCharIndex && currChar && status !=='finished')
    { 
      if(char === currChar)
      {
        return 'correct-word';
      }
      else { return 'wrong-word'; }
    }

    else if(wordIdx===currWordIndex && currCharIndex >= words[currWordIndex].length)
    {
      return 'wrong-word';
    }
    else{return; }


  }
  useEffect(() => {
    console.log("inside useEffect");
    setwords(generateWords());
  }, []);


  useEffect(() => {
    if(status==='started' || status==='waiting')
    { textInput.current.focus();}

  },[status])
  return (
    <>
      <div className="App">
        <h1>PandaTyping</h1>
        <div id="header">
          <div id="info">{countDown}</div>
          <div id="buttons">
            <button onClick={start}>New Game</button>
          </div>
        </div>
        {status === "started" && (
          <div className="card">
            <div className="card-content">
              {words.map((word, i) => (
                <span key={i} className="singleWord">
                  <span>
                    {word.split("").map((char, idx) => (
                      <span className={getCharClass(i,idx,char)}key={idx}>{char}</span>
                    ))}
                  </span>
                  <span> </span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="input">
          <input ref={textInput}
          className="input-inner"
            disabled={status !== "started"}
            type="text"
            onChange={(e) => setcurrInput(e.target.value)}
            autoFocus
            value={currInput}
            onKeyDown={handleKeyDown}
          />
        </div>
        {status === "finished" && (
          <div className="result">
            <div className="wordperminute">
              <h1 style={{ fontSize: 20, textAlign: "center" }}>
                {" "}
                Word per Minute
              </h1>
              <h2>{correct}</h2>
            </div>
            <div className="wordperminute">
              <h1 style={{ fontSize: 20, textAlign: "center" }}> Accuracy</h1>
              {correct!==0 && (<h2>  {Math.round((correct / (correct + incorrect)) * 100)}%</h2>)}
              { correct===0 && (<h2>0 %</h2>)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
