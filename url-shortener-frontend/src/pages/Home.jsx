import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Alert
} from '@mui/material';

function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const [validity, setValidity] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!inputUrl.startsWith('http')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    const body = {
      url: inputUrl,
      ...(validity && { validity: parseInt(validity) }),
      ...(shortcode && { shortcode })
    };

    try {
      const res = await axios.post('http://localhost:5000/shorturls', body);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shorten the URL.');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 5,
        px: 3,
        py: 4,
        boxShadow: 3,
        borderRadius: '20px',
        backgroundColor: '#f9f9f9'
      }}
    >
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
        🔗 URL Shortener
      </Typography>

      <Typography variant="subtitle1" gutterBottom align="center">
        Enter your long URL and optionally provide validity and shortcode
      </Typography>

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Original URL"
              placeholder="https://example.com/..."
              fullWidth
              required
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Validity (mins)"
              placeholder="e.g., 45"
              fullWidth
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Preferred Shortcode"
              placeholder="e.g., mylink123"
              fullWidth
              value={shortcode}
              onChange={(e) => setShortcode(e.target.value)}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ py: 1.5, borderRadius: '10px' }}
            >
              🔧 Shorten URL
            </Button>
          </Grid>
        </Grid>
      </form>

      {result && (
        <Card sx={{ mt: 4, backgroundColor: '#e0f7fa', borderRadius: '16px' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ✅ Shortened Successfully!
            </Typography>
            <Typography variant="body1">
              <strong>Short Link:</strong>{' '}
              <a href={result.shortLink} target="_blank" rel="noopener noreferrer">
                {result.shortLink}
              </a>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Expires at:</strong>{' '}
              {new Date(result.expiry).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default Home;
