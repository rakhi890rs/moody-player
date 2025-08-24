import React, { useState, useRef } from 'react';
import './MoodSongs.css';

const MoodSongs = ({ songs }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);

  const playSong = (song) => {
    if (currentSong?.audio === song.audio) {
      if (audioRef.current.paused) audioRef.current.play();
      else audioRef.current.pause();
    } else {
      setCurrentSong(song);
      setTimeout(() => audioRef.current.play(), 100);
    }
  };

  return (
    <div className='mood-songs'>
      <h2>Recommended Songs</h2>
      {songs.length === 0 && <p className="no-songs">No songs to display</p>}
      <div className="songs-list">
        {songs.map((song, index) => (
          <div
            className={`song-card ${currentSong?.audio === song.audio ? 'playing' : ''}`}
            key={index}
          >
            <div className='song-info'>
              <h3 className='song-title' title={song.title}>{song.title}</h3>
              <p className='song-artist' title={song.artist}>{song.artist}</p>
            </div>
            <div className="play-button" onClick={() => playSong(song)}>
              {currentSong?.audio === song.audio && !audioRef.current?.paused ? '⏸️' : '▶️'}
            </div>
          </div>
        ))}
      </div>

      {currentSong && <audio ref={audioRef} src={currentSong.audio} />}
    </div>
  );
};

export default MoodSongs;
