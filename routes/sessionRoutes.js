const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {uploadFile, getConverstaions, sendQuery} = require('../controllers/sessionController')
const authentication = require('../middlewares/authentication')

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './uploads')
    },
    filename : (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});
const upload = multer({storage})

router.post('/upload', authentication, upload.single('mypdf'), uploadFile)
router.get('/conversation/history', authentication, getConverstaions)
router.post('/ai/send', authentication, sendQuery);



module.exports = router;