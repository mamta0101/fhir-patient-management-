const router = require('express').Router();
const {imageUploadController}=require('../controllers/uploadImage')

router.post('/upload-image',imageUploadController.uploadImg)

module.exports=router;