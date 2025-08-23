const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/songs', upload.single("audio"), async (req, res) => {
    try {
        console.log(req.body);   // form fields (title, artist, etc.)
        console.log(req.file);   // uploaded file details

        // Access the raw file buffer
        const fileData = req.file.buffer;

        res.status(201).json({
            message: 'Song created successfully',
            song: req.body,
            file: {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading song" });
    }
});

module.exports = router;
