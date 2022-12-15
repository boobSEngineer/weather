import React from "react";
import t from "../../Style/Weather.module.css";

interface ITemperature {
    time: Date;
    tempMax: number;
    prevTemp: number | null;
    arrayMinMaxRange: [number,number]; //min,max
}


const Temperature: React.FC<ITemperature> = (props) => {
    let {time, tempMax,prevTemp, arrayMinMaxRange} = props;

    arrayMinMaxRange[0] -= 1;
    arrayMinMaxRange[1] += 4;

    let norm = (x: number| null): number => {
        if (x != null) {
            return ((x - arrayMinMaxRange[0])/(arrayMinMaxRange[1]-arrayMinMaxRange[0]));
        }else {
            return norm(tempMax);
        }
    }

    return (
        <div className={t.flex_item_temp}>
            <svg className={t.svg_diagram} viewBox='0 0 150 150' preserveAspectRatio='none'>
                <path  fill="#89aaa4"
                      d={`M 0,${(1 - norm(prevTemp)) * 150} L 150, ${(1 - norm(tempMax)) * 150} 150, 150 0,150 z`}/>
                <path   stroke="#678983" strokeWidth="3"
                       d={`M 0,${(1 - norm(prevTemp)) * 150} L 150, ${(1 - norm(tempMax)) * 150} z`}/>
                {/*<path fill="transparent"  stroke="red" strokeWidth="3"*/}
                {/*        d={`M 0,0 L 150,0 150,150 0,150 0,0 z`}/>*/}
            </svg>
            <div className={t.item_time}>
                <span>{time.getHours() + ':00'}</span>
            </div>
            <div style={{'position': 'absolute', 'top': `${(0.7 - norm(tempMax)) * 80}px`, 'left': '50px'}} className={t.item_temp}>
                <p>{tempMax}°</p>
            </div>
        </div>

    )
};

export {Temperature};

