import React from "react";
import w from "../../Style/Weather.module.css";
import t from "../../Style/Weather.module.css";
import arrow from "../../Utilities/Icons/arrow1.png";

interface IWind {
    time: Date,
    wind: number,
    wind_deg: number,
}

const Wind: React.FC<IWind> = (props) => {
    let {time, wind, wind_deg} = props
    return (
        <div style={{padding: '4px 10px'}} className={t.flex_item_temp}>
            <div className={w.wind_item}>
                <p>{wind} m/sec</p>
            </div>
            <div className={w.wind_item_img}>
                <img style={{'transform': `rotate(${wind_deg}deg)`}} src={arrow}/>
            </div>
            <div className={w.wind_item_time}>
                <p>{time.getHours() + ':00'}</p>
            </div>
        </div>

    )
};

export {Wind};
