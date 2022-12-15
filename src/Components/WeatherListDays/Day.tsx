import React from "react";
import d from "../../Style/Weather.module.css";
import {useAppDispatch} from "../../hook";
import {setDateChosen} from "../../Redux/Slice/weather-slice";

interface IDay {
    time: Date;
    tempMax: number;
    feelLike: number;
    icon: string;
}

const Day: React.FC<IDay> = (props) => {
    let {time, tempMax, feelLike, icon} = props;
    const dispatch = useAppDispatch();


    return (
        <div onClick={()=>{dispatch(setDateChosen({date: time.getDate(), flag: true}))}} className={d.box_day}>
            <p>{time.getDate()}</p>
            <div className={d.box_img}>
                <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`}/>
            </div>
            <div className={d.flex_item_temp_x}>
                <p>{tempMax}°</p>
                <p>{feelLike}°</p>
            </div>
        </div>
    )
}

export {Day};
