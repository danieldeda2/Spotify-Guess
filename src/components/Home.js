import logo from '../sg_logo.png';
import './home.scss';
import {useEffect, useState} from "react";
import axios from 'axios';
import sg_logo from "./sg_logo.png";
import {motion} from "framer-motion";
import React from 'react'

const Home = () => {

    const CLIENT_ID = "f9e0f3520c4245ec8abfeb41a280b568"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    let USER_ID = ""
    let PLAYLIST_1_ID = ""
    let artistArray = []
    const openAI_TOKEN = "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"
    const [token, setToken] = useState("")
    const [SearchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])
    const [myInfo, setMyInfo] = useState([])
  
    const spotify_guess = "Spotify Guess"
  
    // content to send chatGPT API
    function artistCountryFrom(artist){  // CITY
  
      return `In only 3 words, Please tell me what country the artist ${artist} is originally from and then give me 2 other countries. only Respond with 3 countries separated by commas with the answer being the first, nothing else`;
    
    }
  
    function artistNationality(artist){  // NATIONALITY
  
      return `In only three words, please tell me what nationality the artist ${artist} is and then give me 2 other random nationalities. Respond with only 3 words separated by spaces`;
  
    }
  
    function artistAge(artist){  // AGE
  
      return `In only 3 numbers, Give me the age of ${artist} as of September 23rd 2024. Then give me 2 numbers that are randomly not more than 10 from the answer. Return ONLY 3 numbers, the first one being the answer`;
  
    }
  
    function artistStartYear(artist){  // START YEAR
  
      return `In only three numbers, please tell me what year the artist ${artist} started making music and then give me 2 other random years not too far from that and don't let them be equidistant from that year. Only respond with 3 numbers separated by spaces`;
  
    }
  
    function artistNotSimilar(artist){  // ARTIST NOT SIMILAR
  
      return `Tell me 2 artists that are most similar to the artist ${artist}. Then give me 1 artist that is not similar to the artist ${artist}. Respond with only the 3 artist names separated by commas`;
  
    }
  
    function artistFunFact(artist){  // FUN FACT
      return `Give me a cool fun fact about the artist ${artist}. Then give me 2 other statements that are not true about the artist ${artist}. Respond with only 3 statements with only 5 words each with the true statement being first`
    }
  
  
    useEffect( () => {
  
      const hash = window.location.hash
  
      let token = window.localStorage.getItem("token")
  
      if(!token && hash){
  
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
  
        window.location.hash = ""
        window.localStorage.setItem("token", token)
      }
  
      setToken(token)
  
    }, [])
  
    const logout = () => {
  
        setToken("")
        window.localStorage.removeItem("token")
  
    }
  
    const searchArtists = async(e) => {
  
      e.preventDefault()
  
      const {data} = await axios.get("https://api.spotify.com/v1/search", {
  
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          q: SearchKey,
          type: "artist"
        }
  
      })
  
      console.log(data)
      setArtists(data.artists.items)
  
    }
  
  
    // get playlists 
    const getPlaylists = async(e) => {
  
      e.preventDefault()
  
      const {data} = await axios.get(`https://api.spotify.com/v1/me/playlists`, {
  
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json'
        },
        data: {
          user_id: `${myInfo.id}`,
          limit: 5,
          offset: 3
        }
  
      })
  
      console.log(data)
  
      PLAYLIST_1_ID = data.items[1].id;
  
      getArtistsFromPlaylist();
  
    }
  
    const getArtistsFromPlaylist = async(e) => {
  
  
      const {data} = await axios.get(`https://api.spotify.com/v1/playlists/${PLAYLIST_1_ID}/tracks`, {
  
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          playlist_id: `${PLAYLIST_1_ID}`,
          fields: "items(track(artists))"
        }
  
      })
  
      console.log(data)
  
      for(let i = 0; i < data.items.length; i++){
        artistArray[i] = data.items[i].track.artists[0].name
      }
  
      console.log(artistArray)
  
    }
  
    
    const chatGPT = async(e) => {
  
      let data = JSON.stringify({
              "model": "gpt-4o-2024-05-13",
              "messages": [
                  {
                      "role": "user",
                      "content": artistAge("Sam Smith"),
                  }
              ]
          });
  
          const apiKey = openAI_TOKEN
  
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
                  console.log(response);
              })
              .catch((error) => {
                  console.log(error);
              });
      }
  
    const searchMyInfo = async(e) => {
  
      e.preventDefault()
  
      const {data} = await axios.get("https://api.spotify.com/v1/me", {
  
      headers: {
        Authorization: `Bearer ${token}`
      }
  
      })
  
      console.log(data)
      setMyInfo(data)
  
      USER_ID = data.id;
  
    }
  
  
  
    const renderArtists = () => {
  
      return artists.map(artist => (
  
        <div key = {artist.id}>
  
        {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt = ""/> : <div>No Image</div>}
        {artist.name}
        {" (" + artist.followers["total"] + " followers)"}
  
        <p></p>
  
        </div>
  
      ))
  
    }


    return (
        <div className="App">
    
          <div className="banner">
    
            <div>
              { token ? <button className="login-logout" onClick = {logout}>Logout</button> : 
              <button className="login-logout"><a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login</a></button>}
            </div>
    
            {/* My info button on left*/}
            <div >
              { !token ? <p></p> : <button className="myInfo">My Info</button>}
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
    
    
            <div className='about_div'>
              <button className="about">About</button>
            </div>
        </div>
      );
}


   {/*

      {token ?

        <form onSubmit = {searchArtists}>

        <input type = "text" onChange={e => setSearchKey(e.target.value)}/>

        <button type = "submit">Search</button>

        </form>

        : <br></br>    
      }

      { token ? <button onClick = {searchMyInfo}>My Info</button> : <p></p>}

      { token ? <button onClick = {getPlaylists}>Playlists</button> : <p></p>}

      { token ? <button onClick = {chatGPT}>Question</button> : <p></p>}
        */}

export default home;

