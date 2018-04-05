const express = require('express');
const axios = require('axios');

const router = express.Router();

router.route('/history')
  .get(async (req, res) => {
    const response = await axios.get(`https://api.coindesk.com/v1/bpi/historical/close.json`, { params: req.query });
    res.send(response.data.bpi);
  });

module.exports = router;