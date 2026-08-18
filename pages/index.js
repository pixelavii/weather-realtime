import React from 'react'
import { useState, useEffect } from 'react'
import WeatherDisplay from '@/component/WeatherReport'
import Loading from '@/component/Loading'
import Head from 'next/head'

export default function Home () {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords
        try {
          const res = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?q=${latitude},${longitude}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                key: process.env.NEXT_PUBLIC_API_KEY
              }
            }
          )
          const data = await res.json()
          setWeather(data)
        } catch (err) {
          setError('Failed to fetch weather')
        }
      },
      err => {
        setError('Location access denied: ' + err.message)
      }
    )
  }, [])
  return (
    <>
      <Head>
        <title>Weather Real Time App</title>
      </Head>
      <main>
        {error && <p>{error}</p>}
        {!weather && !error && <Loading />}
        {weather && <WeatherDisplay weather={weather} />}
      </main>
    </>
  )
}
