const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { nanoid } = require('nanoid');
const { logEvent } = require('./logger');

const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());

let urlDB = {}; 

app.post('/shorturls', (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  let code = shortcode || nanoid(6);
  if (urlDB[code]) {
    return res.status(409).json({ error: 'Shortcode already exists' });
  }

  const now = new Date();
  const expiry = new Date(now.getTime() + validity * 60000);

  urlDB[code] = {
    originalUrl: url,
    createdAt: now.toISOString(),
    expiresAt: expiry.toISOString(),
    clicks: [],
  };

  logEvent('CREATE', 'Short URL created', { url, code });

  res.status(201).json({
    shortLink: `http://localhost:${PORT}/${code}`,
    expiry: expiry.toISOString(),
  });
});

app.get('/shorturls/:code', (req, res) => {
  const code = req.params.code;
  const data = urlDB[code];

  if (!data) return res.status(404).json({ error: 'Short URL not found' });

  res.json({
    originalUrl: data.originalUrl,
    createdAt: data.createdAt,
    expiresAt: data.expiresAt,
    totalClicks: data.clicks.length,
    clicks: data.clicks,
  });
});

app.get('/:code', (req, res) => {
  const code = req.params.code;
  const data = urlDB[code];

  if (!data) return res.status(404).send('Short URL not found');

  const now = new Date();
  const expiry = new Date(data.expiresAt);

  if (now > expiry) return res.status(410).send('Short URL expired');

  const clickInfo = {
    timestamp: now.toISOString(),
    referrer: req.get('Referer') || 'Direct',
    location: 'India', 
  };

  data.clicks.push(clickInfo);
  logEvent('CLICK', 'Short URL clicked', { code, ...clickInfo });

  res.redirect(data.originalUrl);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
