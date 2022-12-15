import React, {useEffect} from "react";
import {useAppSelector} from "../../hook";
import w from "../../Style/Weather.module.css";

const WeatherDescription: React.FC = () => {
    const weatherDescription = useAppSelector(state => state.weather.weatherDescription);


    return (
        <div className={w.top}>
                <div className={w.top_flex_value}>
                    <div className={w.flex_item_icon_value}>
                        {weatherDescription? <img src={`http://openweathermap.org/img/wn/${weatherDescription.icon}@2x.png`}/> : 'fff'}
                        <p className={w.main_value}>{weatherDescription?.feelLike ?? 'fff'}</p>
                        <div className={w.unit}>
                            <p>°F</p><p>|</p><p>°C</p>
                        </div>
                    </div>
                    <div className={w.flex_item_description}>
                        <h2>{weatherDescription?.name ?? "aaa"}</h2>
                        <p>{weatherDescription?.time.toLocaleDateString('en-us', { weekday:"long", month:"short",day:"numeric"})  ?? "aaa"}</p>
                        <p>{weatherDescription?.description ?? "aaa"}</p>
                    </div>
                </div>

                <div className={w.flex_item_properties}>
                    <p>Humidity: {weatherDescription !== null? weatherDescription.humidity + '%' : "dddd"}</p>
                    <p>Wind: {weatherDescription !== null? weatherDescription.wind + 'm/sec' : "dddd"} </p>
                </div>
                <div className={w.flex_item}></div>
        </div>
    )
};

export {WeatherDescription};
