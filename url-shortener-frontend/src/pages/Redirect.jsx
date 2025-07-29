// src/pages/RedirectPage.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RedirectPage() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToOriginal = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/shorturls/${shortcode}`);
        const { originalUrl, expiresAt } = res.data;

        const now = new Date();
        const expiry = new Date(expiresAt);

        if (now > expiry) {
          alert('This link has expired.');
          navigate('/');
        } else {
          // Optional: Wait a bit before redirect
          window.location.href = originalUrl;
        }
      } catch {
        alert('Short URL not found or backend error.');
        navigate('/');
      }
    };

    redirectToOriginal();
  }, [shortcode, navigate]);

  return <p>Redirecting to your link...</p>;
}

export default RedirectPage;
