import { v2 as cloudinary } from 'cloudinary'
import { IncomingForm } from 'formidable'

cloudinary.config({
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret'
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = await new Promise((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err)
        resolve({ fields, files })
      })
    })

    const file = data.files.file
    cloudinary.uploader.upload(file.path, function(error, result) {
      if (error) {
        res.status(500).json({ error: 'Upload failed' })
      } else {
        res.status(200).json({ message: 'Upload successful', url: result.url })
      }
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

