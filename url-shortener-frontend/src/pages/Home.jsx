import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

function Home() {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const addRow = () => {
    if (urls.length < 5) {
      setUrls([...urls, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const submitUrls = async () => {
    const allResults = [];

    for (let i = 0; i < urls.length; i++) {
      const { url, validity, shortcode } = urls[i];
      if (!url.startsWith('http')) {
        alert('URL must start with http or https');
        continue;
      }

      try {
        const res = await axios.post('http://localhost:5000/shorturls', {
          url,
          validity: parseInt(validity),
          shortcode,
        });

        allResults.push(res.data);
      } catch (e) {
        alert(`Error on URL ${i + 1}: ` + e.response?.data?.error || 'Error');
      }
    }

    setResults(allResults);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>

      {urls.map((row, i) => (
        <Box key={i} display="flex" gap={2} mb={2}>
          <TextField
            label="Long URL"
            value={row.url}
            fullWidth
            onChange={(e) => handleChange(i, 'url', e.target.value)}
          />
          <TextField
            label="Validity (minutes)"
            type="number"
            value={row.validity}
            onChange={(e) => handleChange(i, 'validity', e.target.value)}
          />
          <TextField
            label="Custom Shortcode"
            value={row.shortcode}
            onChange={(e) => handleChange(i, 'shortcode', e.target.value)}
          />
        </Box>
      ))}

      <Button onClick={addRow}>+ Add</Button>
      <Button variant="contained" sx={{ ml: 2 }} onClick={submitUrls}>Shorten</Button>

      <Box mt={4}>
        {results.map((r, i) => (
          <Box key={i}>
            <a href={r.shortLink} target="_blank">{r.shortLink}</a> <br />
            Expires: {new Date(r.expiry).toLocaleString()}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Home;
