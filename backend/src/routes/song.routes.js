const express = require('express');
const multer = require('multer');
const uploadFile = require("../service/storage.service"); 
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const SongModel = require("../models/song.model");

router.post('/songs', upload.single("audio"), async (req, res) => {
    try {
        const uploadedFile = await uploadFile(req.file);

        const song = await SongModel.create({
            title: req.body.title,
            artist: req.body.artist,
            audio: uploadedFile.url,
            mood: req.body.mood
        });

        res.status(201).json({
            message: 'Song created successfully',
            song: song,
        });
    } catch (error) {
        res.status(500).json({ message: "Error uploading song", error });
    }
});

router.get('/songs', async (req, res) => {
    try {
        const mood = req.query.mood;
        let songs;

        if (mood) {
            songs = await SongModel.find({ mood: mood });
        } else {
            songs = await SongModel.find();
        }

        res.status(200).json({
            message: "Songs fetched successfully",
            count: songs.length,
            songs: songs
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching songs", error });
    }
});

module.exports = router;
