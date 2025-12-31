import logo from '../sg_logo.png';
import './Home.scss';
import axios from 'axios';
import sg_logo from "../sg_logo.png";
import React from 'react'
import {motion} from "framer-motion";
import { NavLink, useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";


const Home = () => {

    const CLIENT_ID = "f9e0f3520c4245ec8abfeb41a280b568"
    const REDIRECT_URI = "http://spotify-guess.com"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPE = "user-top-read"

    let USER_ID = ""
    let PLAYLIST_1_ID = ""
    let artistArray = []
    let topArtists = []
    let topTracks = []

    let dataState = []

    const [token, setToken] = useState("")
    const [SearchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])
    const [myInfo, setMyInfo] = useState([])

    const navigate = useNavigate();
  
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

      localStorage.setItem("data", JSON.stringify(data))
  
      PLAYLIST_1_ID = data.items[1].id;
  
      getArtistsFromPlaylist();
  
    }
  
    const getArtistsFromPlaylist = async(e) => {

      console.log(PLAYLIST_1_ID);
  
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

      localStorage.setItem("artistArray", JSON.stringify(artistArray))
  
    }

    async function fetchTopArtists3(time, amount) {
 
        const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists", {
    
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            type: "artists",
            time_range: time,
            limit: amount
          }
    
        })

        localStorage.setItem("topArtists3", JSON.stringify(data.items))

    }

    async function fetchTopTracks3(time, amount) {
 
      const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
  
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          type: "tracks",
          time_range: time,
          limit: amount
        }
  
      })

      localStorage.setItem("topTracks3", JSON.stringify(data.items))

  }


  async function fetchTopArtists2(time, amount) {
 
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists", {

      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        type: "artists",
        time_range: time,
        limit: amount
      }

    })

    localStorage.setItem("topArtists2", JSON.stringify(data.items))

}

async function fetchTopTracks2(time, amount) {

  const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {

    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      type: "tracks",
      time_range: time,
      limit: amount
    }

  })

  localStorage.setItem("topTracks2", JSON.stringify(data.items))

}


async function fetchTopArtists1(time, amount) {
 
  const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists", {

    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      type: "artists",
      time_range: time,
      limit: amount
    }

  })

  localStorage.setItem("topArtists1", JSON.stringify(data.items))

}

async function fetchTopTracks1(time, amount) {

const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {

  headers: {
    Authorization: `Bearer ${token}`
  },
  params: {
    type: "tracks",
    time_range: time,
    limit: amount
  }

})

localStorage.setItem("topTracks1", JSON.stringify(data.items))

}
  
  const searchMyInfo = async(e) => {
  
      e.preventDefault()
  
      const {data} = await axios.get("https://api.spotify.com/v1/me", {
  
      headers: {
        Authorization: `Bearer ${token}`
      }
  
      })

      getPlaylists();
  
      console.log(data)
      setMyInfo(data)

      dataState.push(data)
  
      USER_ID = data.id;

      fetchTopArtists3("long_term", 25);
      fetchTopTracks3("long_term", 25);

      fetchTopArtists2("medium_term", 25);
      fetchTopTracks2("medium_term", 25);

      fetchTopArtists1("short_term", 25);
      fetchTopTracks1("short_term", 25);

      console.log("FROM SEARCH")
      console.log(dataState);
      console.log("OUT")

      localStorage.setItem("dataState", dataState);


      navigate('/my-info', { state: {dataState} } );

      console.log(dataState)
  }

    return (
        <div className="App">
    
          <div className="banner">
    
            <div>
              { token ? <button className="login-logout" onClick = {logout}>Logout</button> : 
              <button className="login-logout"><a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login</a></button>}
            </div>
    
            {/* My info button on left*/}
            <div >
              { !token ? <p></p> : 
              <NavLink
              activeclassname="active"
              className="myinfo-link"
              to="/my-info"
              >  
              <button className="myInfo" onClick={searchMyInfo}>My Info</button>
              </NavLink> }
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
    
        {token ? 
          <NavLink
          activeclassname="active"
          className="play-link"
          to="/play"
        >
            <button className="play">Play</button>
        </NavLink> 
        :
        <br></br>
        }

    
        <NavLink
          activeclassname="active"
          className="about-link"
          to="/about"
        >
            <button className="about">About</button>
        </NavLink>
        </div>
      );
}

export default Home

