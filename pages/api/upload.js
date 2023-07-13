import { v2 as cloudinary } from 'cloudinary'
import { IncomingForm } from 'formidable'

cloudinary.config({
  cloud_name: 'dhbrlikjn',
  api_key: '482427242623733',
  api_secret: 'aQGDEZgQc68N8rAuysngFODuxyo'
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
    cloudinary.uploader.upload(file.path, {folder: "app"},  function(error, result) {
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

