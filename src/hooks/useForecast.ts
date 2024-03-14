import { ChangeEvent, useState, useEffect } from "react"
import { optionType, forecastType } from "../types"

const useForecast = () => {
    const [term, setTerm] = useState<string>('')
    const [city, setCity] = useState<optionType | null>(null)
    const [options, setOptions] = useState<[]>([])
    const [forecast, setForecast] = useState<forecastType | null>(null)

    const getSearchOptions = (value: string) => {
        //API call
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${value.trim()}&limit=5&appid=${process.env.REACT_APP_API_KEY}`)
        .then (response => response.json())
        .then ((data) => setOptions(data))
    }

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        setTerm(value) 

        if(value === '') return
        getSearchOptions(value)
    }

    const getForecast = (city: optionType) => {
        //API call
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`)
        .then (response => response.json())
        .then ((data) => {

        const forecastData = {
            ...data.city,
            list: data.list.slice(0, 16)
        }
        setForecast(forecastData)
    }).catch(e => console.log(e))
}

    const onSubmit =() => {
        if(!city) return
        getForecast(city)
    }

    const onOptionSelect = (option: optionType) => {
        setCity(option)
    }

    //Listening event
    useEffect(() => {
        if(city){
        setTerm(city.name)
        setOptions([])
        }
    }, [city])

    return {
        term, 
        options, 
        forecast, 
        onInputChange, 
        onSubmit, 
        onOptionSelect,
    }
}

export default useForecast