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
    <div className='mood-songs-container'>
      <div className="songs-header">
        <h2>Recommended Tracks</h2>
        <div className="songs-count">
          {songs.length} {songs.length === 1 ? 'track' : 'tracks'} found
        </div>
      </div>
      
      {songs.length === 0 && (
        <div className="no-songs">
          <div className="no-songs-icon">🎵</div>
          <p>No songs to display</p>
          <span>Try detecting your mood first</span>
        </div>
      )}
      
      <div className="songs-grid">
        {songs.map((song, index) => (
          <div
            className={`song-item ${currentSong?.audio === song.audio ? 'playing' : ''}`}
            key={index}
          >
            <div className="song-content">
              <div className='song-details'>
                <h3 className='song-title' title={song.title}>{song.title}</h3>
                <p className='song-artist' title={song.artist}>{song.artist}</p>
              </div>
              
              <button 
                className="play-btn" 
                onClick={() => playSong(song)}
                aria-label={currentSong?.audio === song.audio && !audioRef.current?.paused ? 'Pause' : 'Play'}
              >
                {currentSong?.audio === song.audio && !audioRef.current?.paused ? '⏸️' : '▶️'}
              </button>
            </div>
            
            {currentSong?.audio === song.audio && (
              <div className="now-playing-indicator">
                <div className="audio-wave">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {currentSong && <audio ref={audioRef} src={currentSong.audio} />}
    </div>
  );
};

export default MoodSongs;