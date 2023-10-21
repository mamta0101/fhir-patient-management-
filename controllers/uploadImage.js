const cloudinary = require('cloudinary').v2;

// Configure Cloudinary #this is an free account
cloudinary.config({
    cloud_name: 'dn9eqw2bp',
    api_key: '157474951337471',
    api_secret: 'jmanglEuitl8o3SC-yWP3se8hEI'
});


const imageUploadController = {
    uploadImg: async (req, res) => {
        try {
            console.log(req.files)
            if (!req.files || !req.files.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const imagePath = req.files.file.tempFilePath;
            console.log(imagePath)

            const result = await cloudinary.uploader.upload(imagePath, { folder: 'newFolder' });
            res.json({ imageUrl: result.secure_url });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to upload image' });
        }
    },

    
};

module.exports = { imageUploadController }