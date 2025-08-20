import React, { useState } from 'react'
import './MoodSongs.css';

const MoodSongs = () => {
    const [Songs,setSongs]= useState([
      {
        title:"test_title",
        artist:"test_artist",
        url:"test_url",
      },
      {
        title:"test_title",
        artist:"test_artist",
        url:"test_url",
      },
      {
        title:"test_title",
        artist:"test_artist",
        url:"test_url",
      },
    ])
  return (
  <div className='mood-songs'>
    <h2>Recommended Songs</h2>

    {Songs.map((song, index) => (
      <div className='song' key={index}>
        <div className='title'>
          <h3>{song.title}</h3>
          <p>{song.artist}</p>
        </div>

        <div className="play-pause-button">
          <i className="ri-pause-line"></i>
          <i className="ri-play-circle-fill"></i>
        </div>
      </div>
    ))}
  </div>
)
}

export default MoodSongs;