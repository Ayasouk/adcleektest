const express = require('express');

const router = express.Router()

const {getCities, getPrevisionByCity} = require('../controllers/meteoCityController');

router.route("/meteoCity").get(getCities);
router.route("/forecastCity/:id").get(getPrevisionByCity)

module.exports = router;