require('dotenv').config();
const express = require('express');
const axios = require('axios');


const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.all('/*', (req, res) => {
  const [, serviceName] = req.path.split('/');
  const serviceUrl = process.env[serviceName];

  if (serviceUrl) {
    const axiosConfig = {
      method: req.method,
      url: `${serviceUrl}${req.originalUrl}`,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body })
    }

    axios(axiosConfig)
      .then(response => {
        res.json(response.data);
      })
      .catch(e => {
          if (e.response) {
            const { status, data } = e.response;
            return res.status(status).json(data);
          }
          return res.status(500).json({ error: e.message });
      })
  } else {
    res.status(502).json({ error: 'Cannot process request' });
  }
})

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
