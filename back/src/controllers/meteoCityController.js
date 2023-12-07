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
        /*const data = await db.get(`select * from city join forecast on city.insee=forecast.insee where city.insee=${id}`);
        const forecasts = [];

        if(!data) { // si les prévisions ne sont pas dans la bdd, on cherche dans l'api meteo
        
            const dataforecast = await axios.get(`https://api.meteo-concept.com/api/forecast/daily?token=${process.env.API_METEO}&insee=${id}`)
            console.log(dataforecast);
            console.log(dataforecast.data.forecast[0])
            const dateup = dataforecast.data.update;
            const details = dataforecast.data.forecast;

            for (const forecast of dataforecast.data.forecast) {
                const details = JSON.stringify(forecast);
                const query = `insert into forecast (date, insee, details) VALUES (?, ?, ?)`;
                const formattedDate = dateup.split('T')[0];
                await db.run(query, [formattedDate, id, details]);
            }

            const data = await db.get(`select * from city join forecast on city.insee=forecast.insee where city.insee=${id}`);

        }
        
        for (let i = 0; i < 4; i++) {
            let nextDate = new Date();
            nextDate.setDate(currentDate.getDate() + i);
            let dateString = `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}-${nextDate.getDate()}`;

            const forecast = await db.get(`SELECT * FROM forecast WHERE insee=${id} AND date='${dateString}'`);
            console.log("forecast : ", forecast);
            if (forecast) {
                forecasts.push({
                    date: dateString,
                    details: JSON.parse(forecast.details)
                });
            }
        }
*/

        res.status(200).json({
            status: "success1",
            data: response.data,
        });

    } catch(error) {
        console.log(error);
    }
 }

 exports.getPrevisionByCity = getPrevisionByCity;