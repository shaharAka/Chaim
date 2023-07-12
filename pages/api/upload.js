export default function handler(req, res) {
  if (req.method === 'POST') {
    // Handle file upload

    // This is just a stub for now. In reality, you would probably
    // upload the file to a storage service, like Google Cloud Storage or AWS S3.

    console.log('File received!');
    res.status(200).json({ message: 'File received!' });
  } else {
    // If it's not a POST request, return 405 - Method Not Allowed
    res.status(405).json({ message: 'Method not allowed' });
  }
}
