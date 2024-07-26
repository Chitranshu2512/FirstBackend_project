import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    const uploadOnCloudinary = async(localFilePath) => {
        try {

            if(!localFilePath) return null
    
            // upload file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: 'auto',
            })

         
            // console the response
            console.log("File is uploaded on Cloudinary", response.url)
            return response
        } 

        catch (error) {
            console.log("file could not be uploaded: ", error)
            fs.unlinkSync(localFilePath)       // it remove the locally saved temp file on our backend server as the upload on cloudinary operation got failed.

            return null
        }
    }


export {uploadOnCloudinary}