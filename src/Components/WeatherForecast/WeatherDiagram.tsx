import React, {useEffect, useState} from "react";
import w from "../../Style/Weather.module.css";
import {useAppSelector} from "../../hook";
import {Temperature} from "./Temperature";
import {Wind} from "./Wind";


const diagramRange = (array: number[]): [number, number] => {
    let min = array.reduce((s, c) => {
        return Math.min(s, c);
    }, 0);
    let max = array.reduce((s, c) => {
        return Math.max(s, c);
    }, 0);
    return [min, max];
};

const WeatherDiagram: React.FC = () => {
    const [format, setFormat] = useState('temperature')
    const allForecast = useAppSelector(state => state.weather.weatherForecast.allForecast);
    const selectedDayForecast = useAppSelector(state => state.weather.weatherForecast.selectedDayOnlyHourForecast);

    const arrayNumberMinMax = (): [number, number] => {
        let temps = allForecast.map(c => c.tempMax);
        return diagramRange(temps);
    }


    return (
        <div className={w.content}>
            <div className={w.format}>
                <p onClick={() => setFormat('temperature')}>Temperature</p>
                <p style={{'color': 'black'}}>|</p>
                <p onClick={() => setFormat('wind')}>Wind</p>
            </div>

            <div className={w.box_diagram}>
                {format == 'temperature' &&
                <div className={w.diagram}>
                    {selectedDayForecast.length > 0 && selectedDayForecast.map((c, i) => {
                        return <Temperature key={c.time.getTime()} {...c} arrayMinMaxRange={arrayNumberMinMax()}
                                            prevTemp={selectedDayForecast[i - 1]?.tempMax}/>
                    })}
                </div>

                }
                {format == 'wind' &&
                <div className={w.diagram}>
                    {
                        selectedDayForecast.length > 0 && selectedDayForecast.map(c => {
                            return <Wind key={c.time.getTime()} {...c}/>
                        })
                    }
                </div>
                }
            </div>

        </div>
    )
};

export {WeatherDiagram};
