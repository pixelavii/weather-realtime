import React from 'react'

export default function Home ({ weather }) {
  console.log('This is the data: ', weather)
  return (
    <div>
      <h1>Here will be the Video</h1>
      {/* <video autoPlay loop muted playsInline width='100%' className='h-screen'>
        <source src='/videoplayback.mp4' type='video/mp4' />
      </video> */}
    </div>
  )
}

export async function getStaticProps () {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?q=22.7196,75.8577`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          key: process.env.API_KEY
        }
      }
    )
    const weather = await res.json()
    return {
      props: {
        weather: weather || []
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Build-time fetch failed, using empty fallback:', error)
    return {
      props: {
        weather: []
      },
      revalidate: 60 // retry sooner since we have no data
    }
  }
}
