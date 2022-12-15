import React from "react";
import w from "../../Style/Weather.module.css";
import {useAppSelector} from "../../hook";
import {Day} from "./Day";

const ListDay: React.FC = () => {
    const allDayForecast = useAppSelector(state => state.weather.weatherForecast.allDayWithMaxTemForecast);

    return (
        <div  className={w.button}>
            {
                allDayForecast.length > 0 && allDayForecast.map(c => {
                    return <Day key={c.time.valueOf()} {...c} />
                })
            }
        </div>
    )
}

export {ListDay};
