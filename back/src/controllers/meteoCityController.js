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
        let data = await db.get(`select * from forecast where forecast.insee=${id}`);
        const forecasts = [];
        
        if(!data) { // si les prévisions ne sont pas dans la bdd, on cherche dans l'api meteo
         
            const dataforecast = await axios.get(`https://api.meteo-concept.com/api/forecast/daily?token=5b2bc27d56993a96b4bc5b5cb6824d2127755db5052d3d24265a1a47c3fe1b37&insee=${id}`)
            console.log("FORECAST : ", dataforecast);
            const formattedDate = new Date(dataforecast.data.update).toISOString().split('T')[0];
            const formattedDetails = JSON.stringify(dataforecast.data.forecast);
            // Escape single quotes by replacing each single quote with two single quotes
            const sqlCompliantJson = formattedDetails.replace(/"/g, "'");

            const query = `insert into forecast (date, insee, details) VALUES \
            (${formattedDate}, ${id}, \"${sqlCompliantJson}\")`;
            await db.run(query);

            /*await db.run('BEGIN TRANSACTION;');
            
            try{
                const query = `insert into forecast ( date, insee, details) VALUES ( ?, ?, ?)`;
                const forecasts = dataforecast.data.forecast; // Assuming this is the correct path
                const updateDate = dataforecast.data.update || new Date().toISOString();
                const formattedDate = new Date(updateDate).toISOString().split('T')[0];

                console.log("DATE : ", formattedDate, " ", id, " ", forecasts);
                await db.run(query, [formattedDate, id, forecasts]);
                await db.run('COMMIT;');
                
            } catch(error) {
                console.log("Transaction Error: ", error);
                await db.run('ROLLBACK;');
            }*/
            data = await db.get(`select * from forecast where forecast.insee=${id}`);
            if(!data){
                data= dataforecast.data;
            }
        }

        res.status(200).json({
            status: "success",
            data: data,
        });

    } catch(error) {
        console.log("ERROR : ", error);
        res.status(500).send('Internal Server Error');
    }
 }

 exports.getPrevisionByCity = getPrevisionByCity;