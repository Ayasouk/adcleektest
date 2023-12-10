const { default: axios } = require('axios');
const db = require('../database');

const getCities = async (req, res) => {
    try{
        const data = await db.all('select * from city');

        res.status(200).json({
            status: "success",
            data: data,
        });
    } catch(error) {
        console.log(error);
    }
 }

 exports.getCities = getCities;

 const getPrevisionByCity = async (req, res) => {
    try{
        const id = req.params.id;
        console.log("ID : ",id)

        const response = await axios.get(`https://candidat.adcleek.it/cities/${id}/forecast`);
        console.log(response.data);
        const data = await db.get(`select * from forecast where forecast.insee=${id}`);
        const forecasts = [];

        if(!data) { // si les prévisions ne sont pas dans la bdd, on cherche dans l'api meteo
        
            const dataforecast = await axios.get(`https://api.meteo-concept.com/api/forecast/daily?token=${process.env.API_METEO}&insee=${id}`)
            console.log("FORECAST : ", dataforecast);

            const details = JSON.stringify(dataforecast.details);
            const query = `insert into forecast (date, insee, details) VALUES (?, ?, ?)`;
            const formattedDate = dateup.split('T')[0];
            await db.run(query, [dataforecast.date, id, details]);

            data=dataforecast;
        }

        res.status(200).json({
            status: "success",
            data: data,
        });

    } catch(error) {
        console.log(error);
    }
 }

 exports.getPrevisionByCity = getPrevisionByCity;