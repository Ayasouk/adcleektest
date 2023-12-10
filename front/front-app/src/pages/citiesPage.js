import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./citiesPage.module.css";
import { getIconByCode, getClasseByIcon } from "../utils/weatherUtils";
import 'bootstrap-icons/font/bootstrap-icons.css';

const CitiesList = () => {
    const [cities, setCities] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCity, setSelectedCity] = useState("");

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
        setSelectedCity(city);
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
                    <thead className={styles.head}>
                        <tr>
                            <th className={styles.line}>Code Insee</th>
                            <th className={styles.line}>City</th>
                            <th className={styles.line}>Population</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        
                        {cities.map((city, index) => {
                             const bgColor = { backgroundColor: index % 2 !== 0 ? '#f2f2f2' : 'transparent' };
                            return <tr key={city.insee}  onClick={()=> handleCityClick(city)} >
                                    <td style={bgColor} className={styles.line}>{city.insee}</td>
                                    <td style={bgColor} className={`${styles.line} ${selectedCity.insee==city.insee?"fw-bold":""}`}>{city.name}</td>
                                    <td style={bgColor} className={styles.line}>{city.population}</td>
                            </tr>
                        
                        })}
                        
                    </tbody>
                </table>
            </div>

            <div className="col-md-6">
                <div className="row">
                    {forecasts.length >0 && forecasts.slice(0,4).map((forecast,index) =>{
                        console.log(forecast);
                        const iconClasse = getClasseByIcon[getIconByCode(forecast.details.weather)];
                        const statClasse = {fontWeight: "bold"};

                        return <div className="col-md-6 p-3" key={index}>
                            
                            <div className="card">
                                <div className="card-body">
                                    <i className={`${iconClasse} ${styles.bi}`}>
                                    </i>
                                    <div className="pt-2">
                                        <h6>Probabilité de pluie</h6>
                                        <p className={`${styles.stat} py-3 fs-5`}>{forecast.details.probarain}%</p>
                                    </div>
                                    <div className="d-flex flex-row justify-content-evenly">
                                        <div>
                                            <p className={styles["stat-title"]}>Min</p>
                                            <p className={`${styles.stat} fs-7`}>{forecast.details.tmin}°C</p>
                                        </div>
                                        <div>
                                            <p className={styles["stat-title"]}>Max</p>
                                            <p className={`${styles.stat} fs-7`}>{forecast.details.tmax}°C</p>
                                        </div>
                                    </div>
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