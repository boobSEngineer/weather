import {createSlice, createAsyncThunk, PayloadAction, AnyAction} from "@reduxjs/toolkit";
import axios, {AxiosError} from "axios";
import {WEATHER_API_KEY, LONGITUDE, LATITUDE} from "../../Secret";

type WeatherItem = {
    dt: number,
    weather: {
        main: string,
        description: string,
        icon: string
    }[],
    main: {
        feels_like: number,
        humidity: number,
        temp_max: number,
    },
    wind: {
        speed: number,
        deg: number,
    }
};


type WeatherForecastResponse = {
    list: WeatherItem[],
    city: {
        name: string,
    }
}

/*-------------------------------------------*/

type MyWeatherForecastItem = {
    time: Date,
    description: string,
    wind: number,
    wind_deg: number,
    icon: string,
    tempMax: number,
    feelLike: number,
}

type MyWeatherDescription = {
    name: string,
    humidity: number
} & MyWeatherForecastItem


type WeatherState = {
    weatherDescription: MyWeatherDescription | null,
    weatherForecast: {
        allForecast: MyWeatherForecastItem[]
        allDayWithMaxTemForecast: MyWeatherForecastItem[]
        selectedDayOnlyHourForecast: MyWeatherForecastItem[]
    },
    time: {
        daySelected: number,
        dayCurrent: number
    }
    pagination: number,
    flagChange: boolean,
    status: string,
    error: string | null,
};

let initialState: WeatherState = {
    weatherDescription: null,
    weatherForecast: {
        allForecast: [],
        allDayWithMaxTemForecast: [],
        selectedDayOnlyHourForecast: []
    },
    pagination: 0,
    time: {
        daySelected: new Date().getDate(),
        dayCurrent: new Date().getDate()
    },
    flagChange: false,
    status: '',
    error: null,
};

export const getForecastThunkCreate = createAsyncThunk<WeatherForecastResponse, undefined, { rejectValue: string }>('weather/getForecastThunkCreate', async (_, {rejectWithValue}) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${WEATHER_API_KEY}`)
        return response.data;
    } catch (e) {
        const err = e as AxiosError;
        return rejectWithValue(err.message);
    }
})

const WeatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        setDateChosen: (state, action) => {
            state.time.daySelected = action.payload.date;
            state.flagChange = action.payload.flag;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getForecastThunkCreate.pending, (state, action) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(getForecastThunkCreate.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.weatherForecast.allDayWithMaxTemForecast = [];

                state.weatherForecast.allForecast = action.payload.list.map(c => ({
                    time: new Date(c.dt * 1000),
                    description: arrayReduce(c.weather, '', e => e.description),
                    wind: Math.round(c.wind.speed),
                    wind_deg: c.wind.deg,
                    icon: arrayReduce(c.weather, '', e => e.icon),
                    tempMax: Math.round(c.main.temp_max - 273.15),
                    feelLike: Math.round(c.main.temp_max - 273.15),
                }))


                let dateNow = new Date().getDate(); // current
                let array_output: MyWeatherForecastItem[][] = [];
                let j = 0;
                for (let i of state.weatherForecast.allForecast) {
                    if (i.time.getDate() === dateNow) {
                        if (array_output[j] === undefined) {
                            array_output[j] = []
                            array_output[j].push(i);

                        } else {
                            array_output[j].push(i);
                        }
                    } else {
                        j = array_output.length;
                        dateNow++;
                        array_output[j] = [];
                        array_output[j].push(i);
                        if (i.time.getDate() !== dateNow) {
                            dateNow = i.time.getDate();
                        }
                    }
                }
                if (state.weatherForecast.allForecast.length > 0) {
                    state.weatherForecast.selectedDayOnlyHourForecast = state.weatherForecast.allForecast.filter(c => {
                        if (state.time.dayCurrent === c.time.getDate()) return true;
                        else if (state.time.daySelected + 1 === c.time.getDate()) return true;
                    })
                    console.log(array_output)
                    for (let x of array_output) {
                        let max_number = x[0].tempMax;
                        for (let y of x) {
                            if (max_number < y.tempMax) {
                                max_number = y.tempMax;
                            }
                        }
                        state.weatherForecast.allDayWithMaxTemForecast.push(x.find(c => c.tempMax === max_number) as MyWeatherForecastItem);
                    }

                    let firstForecastArray = state.weatherForecast.allForecast.filter(c => {
                        if (state.time.dayCurrent === c.time.getDate()) return true;
                        // else if (state.daySelected + AdaptiveGrid === c.time.getDate()) return true; error
                    })

                    if (state.flagChange === true) {

                        let dayChosen = state.weatherForecast.allDayWithMaxTemForecast.find(r => {
                            if (r.time.getDate() === state.time.daySelected) {
                                return true;
                            }
                        })
                        if (dayChosen !== undefined && state.weatherDescription !== null) {
                            state.weatherDescription = {...state.weatherDescription, ...dayChosen}
                        }


                        if (dayChosen !== undefined) {
                            state.pagination = state.weatherForecast.allDayWithMaxTemForecast.indexOf(dayChosen);
                            if (state.pagination !== -1) {
                                state.pagination = inputForecastWithDay(state.pagination, firstForecastArray.length, state.weatherForecast.allDayWithMaxTemForecast.length - 1);

                            }
                        }

                    } else {
                        let day = state.weatherForecast.selectedDayOnlyHourForecast[0];
                        if (day !== undefined) {
                            state.weatherDescription = {
                                name: action.payload.city.name,
                                humidity: action.payload.list[0].main.humidity,
                                time: day.time,
                                description: day.description,
                                wind: Math.round(day.wind),
                                wind_deg: day.wind_deg,
                                icon: day.icon,
                                tempMax: day.tempMax,
                                feelLike: day.feelLike,
                            }

                        } else {
                            state.weatherDescription = null;
                        }
                    }

                    if (state.pagination !== undefined) {
                        state.weatherForecast.selectedDayOnlyHourForecast = [];
                        while (state.weatherForecast.selectedDayOnlyHourForecast.length < 8) {
                            if (state.weatherForecast.allForecast[state.pagination] !== undefined) {
                                state.weatherForecast.selectedDayOnlyHourForecast.push(state.weatherForecast.allForecast[state.pagination])
                                state.pagination++
                            } else {
                                break
                            }
                        }
                    }

                }


            })
            .addMatcher(isError, (state, action: PayloadAction<string>) => {
                state.status = 'rejected';
                state.error = action.payload;
            })

    },
})

export const {setDateChosen} = WeatherSlice.actions;

export default WeatherSlice.reducer;

const isError = (action: AnyAction) => {
    return action.type.endsWith('rejected');
}

const arrayReduce = <T, U>(array: T[], defaultValue: U, transform: (value: T) => U): U => {
    return array.reduce((s, c) => transform(c), defaultValue);
}

const inputForecastWithDay = (variant: number, numberFirstForecast: number, lastNumberArray: number): number => {
    switch (variant) {
        case 0 : {
            return 0
        }
        case 1 : {
            return numberFirstForecast
        }

        case lastNumberArray : {
            return (lastNumberArray - 1) * 8
        }
    }

    return (variant - 1) * 8 + numberFirstForecast
}



