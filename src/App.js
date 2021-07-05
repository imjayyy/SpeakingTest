import axios from 'axios'
import React, { useState, useEffect } from 'react'
import './App.css'
import {Modal,Button} from "react-bootstrap"
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

function App() {

  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  const [savedNotes, setSavedNotes] = useState([])
  const [para,setPara] = useState("")
  // const [newSavedNotes,setNewSavedNotes] = useState(savedNotes.length > 0 ? {...savedNotes} : "")
  useEffect(() => {
    handleListen()
  }, [isListening])


  
  const getText=()=>{
    axios
    .get("https://voicetestehb.herokuapp.com/getParagraph")
    .then((response)=>{
      if(response.status===200){
        setPara(response.data.para)
      }
    })
    .catch((error)=>{
      console.log(error)
    })
  }
  const checkText=()=>{
    if(savedNotes.length>0){
      let newPara = para.split(" ");
      let savedNotesnew = savedNotes[0].split(" ");
      let count = 0;
      var stringSimilarity = require("string-similarity");
      var similarity = stringSimilarity.compareTwoStrings(para, savedNotes[0]);
      
      // for (let index = 0; index < newPara.length; index++) {
      //   if(newPara[index].length>5 && )
      //   if (newPara[index]===savedNotesnew[index]) {
      //     count+=1;
      //   }
      //   else{
      //     savedNotesnew.pop(index)
      //   }
      // }
      console.log(similarity)
      return((similarity)*100)
    }
  }

  useEffect(()=>{
    checkText()
  },[savedNotes])
  useEffect(()=>{
    getText();
  },[])
  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue..')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note])
    setNote('')
  }
  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  return (
    <>
    <center>
      <h1>Speaking Clarity Test - Experts Helping Businesses.</h1></center>
      <div className="textBox">
        <div className="box">
          <h2>Current Note</h2>
          {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
          <button onClick={handleSaveNote} disabled={!note}>
            Check Accuracy
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Notes</h2>
          <p>{para}</p>
          {savedNotes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
      {savedNotes.length > 0 ? (<Modal.Dialog>
        <Modal.Header >
          <Modal.Title >Your Accuracy</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p><strong>{checkText()}% Accuracy</strong></p>
        </Modal.Body>

        {/* <Modal.Footer>
          <Button variant="secondary">Close</Button>
        </Modal.Footer> */}
      </Modal.Dialog>
      ):null} 
    </>
  )
}

export default App
