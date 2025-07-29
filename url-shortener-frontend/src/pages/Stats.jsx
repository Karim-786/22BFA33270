import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

function Stats() {
  const shortcodes = ['abcd1']; 
  const [allStats, setAllStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const data = [];

      for (let code of shortcodes) {
        try {
          const res = await axios.get(`http://localhost:5000/shorturls/${code}`);
          data.push({ ...res.data, shortcode: code });
        } catch {
          console.log('Error fetching stats', code);
        }
      }

      setAllStats(data);
    };

    fetchStats();
  }, [shortcodes]); 

  return (
    <Box p={4}>
      <Typography variant="h4">Analytics</Typography>
      {allStats.map((item, i) => (
        <Box key={i} mt={2}>
          <Typography><strong>{item.shortcode}</strong> → {item.originalUrl}</Typography>
          <Typography>Clicks: {item.totalClicks}</Typography>
          <Typography>Expires: {new Date(item.expiresAt).toLocaleString()}</Typography>
          <ul>
            {item.clicks.map((c, j) => (
              <li key={j}>{new Date(c.timestamp).toLocaleString()} from {c.referrer} ({c.location})</li>
            ))}
          </ul>
        </Box>
      ))}
    </Box>
  );
}

export default Stats;
