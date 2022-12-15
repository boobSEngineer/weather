import React, {useEffect} from "react";
import {useAppSelector, useAppDispatch} from "../hook";
import {getForecastThunkCreate} from "../Redux/Slice/weather-slice";
import w from "../Style/Weather.module.css";
import {WeatherDescription} from "./WeatherDescription/WeatherDescription";
import {WeatherDiagram} from "./WeatherForecast/WeatherDiagram";
import {ListDay} from "./WeatherListDays/ListDay";

const Weather: React.FC = () => {
    const dispatch = useAppDispatch();
    const daySelected = useAppSelector(state => state.weather.time.daySelected);

    useEffect(() => {
        dispatch(getForecastThunkCreate())
    }, [daySelected]);

    return (
        <div className={w.wrapper}>

            <div className={w.box_weather} >
                <WeatherDescription/>
                <WeatherDiagram/>
                <ListDay/>
            </div>
        </div>
    )
};

export {Weather};

// <div>
//     <p>name of city: {weather.name}</p>
//     <p>weather today: {weather.weather.reduce((s, c) => c.main + ' ' + c.description, '')}</p>
// </div>
