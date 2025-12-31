import React from 'react'
import './Play.scss'
import axios from 'axios';
import sg_logo from '../sg_logo.png'
import {m, motion} from "framer-motion";
import { NavLink, useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";


const Play = () => {

    useEffect( () => {

      console.log("Fetched key");

      const hash = window.location.hash
      
      let token = window.localStorage.getItem("token")
      
      if(!token && hash){
      
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
      
        window.location.hash = ""
        window.localStorage.setItem("token", token)

      }
    
        setToken(token)
      
        }, [])

    const CLIENT_ID = "f9e0f3520c4245ec8abfeb41a280b568"
    const REDIRECT_URI = "http://spotify-guess.com"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPE = "user-top-read"

    const playlists = [];

    let playlist_id = ""

    // use to display which button is animated when clicked
    // green if correct
    // red and shake if incorrect
    // use framer motion for the shake
    const [activeButton1, setActiveButton1] = useState(false)
    const [activeButton2, setActiveButton2] = useState(false)
    const [activeButton3, setActiveButton3] = useState(false)

    const [buttonClicks, setButtonClicks] = useState(0)
    const [questions, setQuestions] = useState(0)

    const [apiKey, setApiKey] = useState("")


    const [wrongButton1, setWrongButton1] = useState(false)
    const [wrongButton2, setWrongButton2] = useState(false)
    const [wrongButton3, setWrongButton3] = useState(false)

    const [sameDisplay, setSameDisplay] = useState(false)
    const [prevArray, setPrevArray] = useState([])
    const [prevArrayRandomized, setPrevArrayRandomized] = useState([])

    const [randomize, setRandomize] = useState(true)

    // know when to display question
    const [display_status, setDisplay_status] = useState(false);
    // know when to display playlists
    const [playlistDisplay, setPlaylistDisplay] = useState(true);


    const [arrayHolder, setArrayHolder] = useState([])

    
    const [display1, setDisplay1] = useState("");
    const [display2, setDisplay2] = useState("");
    const [display3, setDisplay3] = useState("");

    const [displayQuestion, setDisplayQuestion] = useState("");

    let artistIndex = 0;
    let questionIndex = 0;

    const [mixedArray, setMixedArray] = useState([])


    const initialArray = [display1, display2, display3];


    const [token, setToken] = useState("")

    let artists = []    
    let available = []

    const navigate = useNavigate();
  
    const spotify_guess = "Spotify Guess"

    var displayOrder = [0,2,1]

    let array = []

    async function fetchKey() {

        try {
    
            const response = await axios.get('https://chat-gpt-api-key-zsd3m.ondigitalocean.app/chatgpt-key');
    
            const apiData = response.data;
    
            setApiKey(apiData.key);

            console.log(apiKey);
    
        } catch (error) {
    
            console.error('Error fetching key:', error);
    
        }
    
    }
    

    /* 
    
    1) generate rand int between 0 and artists
    2) generate rand int between 0 and questions (5)
    3) check if available[artists][questions] is 0
        if yes:
            go to 4
        if no:
            go to 1
    4) assemble question (maybe questionPicker(artist, question) method ?)

    */
   
    function initializeAvailable(available){

        for(let i = 0; i < 100; i++)
                available[i] = [0, 0, 0, 0];

    }

    // 1
    // here its between 0 and 100 (non-inclusive) because spotify gave us back the top 100 artists
    function generateArtistIndex(){

        fetchKey();

        return Math.floor(Math.random() * artists.length)
    }

    // 2
    // between 0 and 4 because we have 4 questions
    function generateQuestionIndex(){
        return Math.floor(Math.random() * 4)
    }

    // 3
    function isAvailable(artistIndex, questionIndex){

        if(available[artistIndex][questionIndex] === 0)
            return true;
        else
            return false;

    }

    function assembleQuestion(artistIndex, questionIndex){

        switch(questionIndex){

            

            // country
            case 0:
                return `In only 3 words, Please tell me what country the artist ${artists[artistIndex]} is originally from and then give me 2 other countries. only Respond with only 3 countries separated by commas with the correct answer being the first, nothing else`;

            // nationality
            case 1:
                return `In only three words, please tell me what nationality the artist ${artists[artistIndex]} is and then give me 2 other random nationalities. Respond with only 3 nationalities separated by commas with the correct answer being the first, nothing else`;

            // age
            case 2:
                return `In only 3 numbers, Give me the age of the artist ${artists[artistIndex]} as of October 31st 2024. Then give me 2 numbers that are randomly not more than 10 from the answer. Return ONLY 3 numbers separated by commas with the first number being the answer, nothing else`;

            // artist start year
            case 3:
                return `In only three numbers, please tell me what year the artist ${artists[artistIndex]} released their first single and then give me 2 other random years not too far from that and don't let them be equidistant from that year. Only respond with 3 numbers separated by commas, nothing else`;

        }
        
    }

    function assembleDisplay(artistIndex, questionIndex){

        switch(questionIndex){

            // country
            case 0:
                return `What country is the artist ${artists[artistIndex]} originally from?`;

            // nationality
            case 1:
                return `What is the nationality of artist ${artists[artistIndex]}?`;

            // age
            case 2:
                return `How old is the artist ${artists[artistIndex]}?`;

            // artist start year
            case 3:
                return `In which year did the artist ${artists[artistIndex]} release their first single?`;

        }
        

    }


    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function button1click() {

        setDisplay_status(true);

        if(mixedArray[0] === display1){

            setActiveButton1(true);

            let tempArray = mixedArray;
            tempArray[1] = " "
            tempArray[2] = " "
            setMixedArray(tempArray)

            await delay(500); 

            tempArray = mixedArray;
            tempArray[0] = " "
            tempArray[1] = " "
            tempArray[2] = " "
            setActiveButton1(false);

            setQuestions(questions + 1);
            setButtonClicks(buttonClicks + 1);

            getQuestion();

        }
        else{

            setSameDisplay(true);

            setWrongButton1(true);

            await delay(500); 

            setWrongButton1(false);

            setButtonClicks(buttonClicks + 1);

        }
        


    }

    async function button2click() {


        setDisplay_status(true);

        if(mixedArray[1] === display1){

            setActiveButton2(true);

            let tempArray = mixedArray;
            tempArray[0] = " "
            tempArray[2] = " "
            setMixedArray(tempArray)

            await delay(500); 

            tempArray = mixedArray;
            tempArray[0] = " "
            tempArray[1] = " "
            tempArray[2] = " "
            setActiveButton1(false);

            setActiveButton2(false);

            setQuestions(questions + 1);
            setButtonClicks(buttonClicks + 1);


            getQuestion();

        }
        else{

            setSameDisplay(true);

            setWrongButton2(true);

            await delay(500); 

            setWrongButton2(false);

            setButtonClicks(buttonClicks + 1);

            
        }


    }

    async function button3click() {


        if(mixedArray[2] === display1){
            

            setActiveButton3(true);

            let tempArray = mixedArray;
            tempArray[0] = " "
            tempArray[1] = " "
            setMixedArray(tempArray)

            await delay(500); 

            tempArray = mixedArray;
            tempArray[0] = " "
            tempArray[1] = " "
            tempArray[2] = " "
            setActiveButton1(false);

            setActiveButton3(false);

            setQuestions(questions + 1);
            setButtonClicks(buttonClicks + 1);

            getQuestion();

        }
        else{

            setSameDisplay(true);

            setWrongButton3(true);

            await delay(500); 

            setWrongButton3(false);

            setButtonClicks(buttonClicks + 1);



            
        }


    }

    
    async function getQuestion(){

        artists = JSON.parse(localStorage.getItem("newArtists"));

        setRandomize(true);

        setActiveButton1(false);
        setActiveButton2(false);
        setActiveButton3(false);

        setDisplay_status(true);

        // 1
        artistIndex = generateArtistIndex();

        // 2
        questionIndex = generateQuestionIndex();

        // 3
        while(!isAvailable(artistIndex, questionIndex)){
            artistIndex = generateArtistIndex();
            questionIndex = generateQuestionIndex();
        }

        // 4

        // mark as viewed
        available[artistIndex][questionIndex] = 1;

        chatGPT_API(assembleQuestion(artistIndex, questionIndex));

        console.log(assembleDisplay(artistIndex, questionIndex));

        setDisplayQuestion(assembleDisplay(artistIndex, questionIndex));

        setSameDisplay(false);

        display();

    }




    function display(){

        return (

            <div className="question">
                <p className="displayQuestion">{displayQuestion}</p>
                <div className='buttons_column'>
                    <button className= {activeButton1 ? 'button1green' : wrongButton1 ? 'buttonRed' : 'button1'} onClick={button1click}>{mixedArray[0]}</button>
                    <button className={activeButton2 ? 'button2green' : wrongButton2 ? 'buttonRed' : 'button2'} onClick={button2click}>{mixedArray[1]}</button>
                    <button className={activeButton3 ? 'button3green' : wrongButton3 ? 'buttonRed' : 'button3'} onClick={button3click}>{mixedArray[2]}</button>
                </div>
            </div>

        )


    }

    async function chatGPT_API(question){
  
        let data = JSON.stringify({
                "model": "gpt-4o-2024-05-13",
                "messages": [
                    {
                        "role": "user",
                        "content": question,
                    }
                ]
        });
    
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            data: data
        };
    
        axios.request(config)
            .then((response) => {
                const string = response.data.choices[0].message.content;
                let s = string.split(",")
                setDisplay1(s[0])
                setDisplay2(s[1])
                setDisplay3(s[2])
                setMixedArray(generateOrder(s));
            })
            .catch((error) => {
                console.log(error);
            });

    }

    
    // durstenfeld shuffle to mix our array up, the optimized version of fisher yates
    function generateOrder(array) {

        displayPlaylists();

        for (var i = array.length - 1; i >= 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;

    }



    const navigateHome = () =>{
        let path = `/`
        navigate(path)
    }

    const logout = () => {

        setToken("")
        window.localStorage.removeItem("token")
  
    }

    function refresh(){
        getQuestion();
    }

    
    function displayPlaylists(){

        if(localStorage.getItem("data") === null)
            return <h6>No playlists found, please create a playlist on Spotify to play.</h6>

        let playlistArray = JSON.parse(localStorage.getItem("data"));
        playlistArray = playlistArray.items;

        playlists.push(<h5 key="0">Please select a playlist below:</h5>)

        for(let i = 0; i < playlistArray.length; i++){
            playlists.push(
                <button className="playlists" key={i+1} onClick={() => changeParameters(i)}>
                    <img src={playlistArray[i].images[0].url}/>
                    <h3>{playlistArray[i].name}</h3>
                </button>)
          }

        return playlists

    }

    function backToPlaylists(){

        setDisplay_status(false);
        setPlaylistDisplay(true);


    }

    
    function changeParameters(i){

        setPlaylistDisplay(false);
        setDisplay_status(true);

        let playlistArray = JSON.parse(localStorage.getItem("data"));
        playlistArray = playlistArray.items;

        // set index
        playlist_id = playlistArray[i].id;

        // get artists
        getArtistsFromPlaylist();

        getQuestion();

  }

  const getArtistsFromPlaylist = async(e) => {
  
    const {data} = await axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {

      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        playlist_id: `${playlist_id}`,
        fields: "items(track(artists))"
      }

    })

    let tempArray = []

    for(let i = 0; i < data.items.length; i++){
      tempArray[i] = data.items[i].track.artists[0].name;
    }

    localStorage.setItem("newArtists", JSON.stringify(tempArray));
    
  }

    




  return (

    <div className='App'>
        
        {initializeAvailable(available)}

        <div className="banner">
            
            <div>
                { token ? <button className="login-logout" onClick = {logout}>Logout</button> : 
                <button className="login-logout"><a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login</a></button>}
            </div>

            {/* My info button on left*/}
            <div >
                    <button className="home" onClick={navigateHome}>Home</button>

            </div> 

        </div>

        <img className="logo" src={sg_logo}/>


        <motion.div className="spotify_guess">
            {spotify_guess.split("").map((letter, index) => (
                <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                {letter}
                </motion.span>
            ))}
        </motion.div>

        {playlistDisplay ? displayPlaylists() : <br></br>}

        {display_status ? display() : <br></br>}    

        {display_status ?   
        <h6>{questions} / {buttonClicks}</h6>
        : <br></br>}   

        {display_status ? 
        <div className='returnToPlaylists'><button onClick={backToPlaylists}>Return to playlists</button></div> : <br></br>} 
           
        </div>

  )
}

export default Play