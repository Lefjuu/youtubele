import dotenv from 'dotenv'
dotenv.config()
import cloudinary from '../utils/cloudinary.cjs'

const uploadImage = async (req, res) => {
    try {
        const fileStr = req.body.data
        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {

            upload_preset: 'dev_setups'
        })
        res.json(uploadedResponse.public_id)
    } catch (error) {
        console.log(error);
    }
}

const uploadVideo = async (req, res) => {
    try {
        const fileStr = req.body.data
        console.log('uploaduje');
        const uploadedResponse = await cloudinary.uploader
            .upload(fileStr,
                {
                    resource_type: "video",
                    upload_preset: 'dev_setups',

                    // public_id: `youtube/${fileStr}`,
                    chunk_size: 6000000,
                    eager: [
                        { width: 300, height: 300, crop: "pad", audio_codec: "none" },
                        { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }],
                    eager_async: true,
                    // eager_notification_url: "https://mysite.example.com/notify_endpoint"
                })
        // console.log(uploadedResponse.public_id);
        res.json(uploadedResponse.public_id)


    } catch (error) {
        console.log(error);
    }
}

const getFile = async (req, res) => {
    const { resources } = await cloudinary.search

        .expression('folder:youtube')
        // .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();

    const publicIds = resources.map(file => file);
    // const publicIds = resources
    res.send(publicIds);
}



export { uploadImage, getFile, uploadVideo }