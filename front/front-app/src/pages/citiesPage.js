import { useState, useEffect } from "react";
import './citiesPage.css';
import axios from "axios";

const CitiesList = () => {
    const [cities, setCities] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect( () => {
        const fetchData = async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get("http://localhost:4000/api/v1/meteoCity");
                setCities(response.data.data); // Assurez-vous que le format des données est correct
                console.log(response.data.data);
    
                //const responseForecasts = await axios.get('http://localhost:4000/api/forecasts');
                //setForecasts(responseForecasts.data);
            } catch (error) {
                setError("Erreur lors de la récupération des villes");
                console.error(error);
            }
            setIsLoading(false);
        }
       fetchData();
    }, [])


    const handleCityClick = async (city) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/api/v1/forecastCity/${city.insee}`);
            setForecasts(response.data.data); // Adjust according to your data structure
        } catch (error) {
            setError("Erreur lors de la récupération des prévisions météorologiques");
            console.error(error);
        }
        setIsLoading(false);
    };

    return (<div className="container-fluid idcity">
        <div className="row">
            <div className="col-md-6">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Code Insee</th>
                            <th>City</th>
                            <th>Population</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cities.map((city, index) => {
                            {/*className={index % 2 !== 0 ? 'odd-city' : ''}*/}
                            return <tr key={city.insee}  onClick={()=> handleCityClick(city)} className="odd-city" >
                                <td>{city.insee}</td>
                                <td>{city.name}</td>
                                <td>{city.population}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>

            <div className="col-md-6">
                <div className="row">
                    {forecasts.length >0 && forecasts.slice(0,4).map((forecast,index) =>{
                        console.log(forecast);
                        return <div className="col-md-6" key={index}>
                            <div className="card">
                                <div className="card-body text-center">
                                    <div className="weather-icon">
                                    </div>
                                    <h6>Probabilité de pluie: {forecast.details.probarain}%</h6>
                                    <p>Min: {forecast.details.tmin}°C</p>
                                    <p>Max: {forecast.details.tmax}°C</p>
                                </div>
                            </div>
                        </div>
                    })}

                </div>
                </div>
        </div>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
            
        </div>)
}

export default CitiesList;