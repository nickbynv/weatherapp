import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { useState } from "react"
import { IWeatherResponse } from "../interfaces/weather"

export const useFetchWeatherQuery = (
    params: { [key: string]: any }

): UseQueryResult<IWeatherResponse> => {
    const [refetchInterval, setRefetchInterval] = useState(60000)

    return useQuery(
        ['fetchWeather', params], async () => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${params.search}&APPID=bf0439d384c941926a56e872951ec8be`)
                return await response.json()
            } catch (error) {
                return error
            }
        },
        {
            staleTime: 300000,
            keepPreviousData: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchInterval,
            refetchIntervalInBackground: false,
            onError: () => setRefetchInterval(0)
        }
    )
}