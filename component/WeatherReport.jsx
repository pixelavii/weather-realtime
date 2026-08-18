import React from "react";
import Sunrise from "./Sunrise";
import Afternoon from "./Afternoon";
import Sunset from "./Sunset";
import Night from "./Night";
import Raining from "./Raining";
import Cloudy from "./Cloudy";
import Snow from "./Snow";
import Fogmist from "./Fogmist";

function getWeatherComponent(weather) {
  const condition = weather.current.condition.text.toLowerCase();
  const conditionCode = weather.current.condition.code;

  const now = new Date();
  const timeInMinutes = now.getHours() * 60 + now.getMinutes();

  const NIGHT_START = 19 * 60; // 7:00 PM
  const SUNSET_START = 16 * 60; // 4:00 PM
  const MORNING_END = 11 * 60; // 11:00 AM

  const rainCodes = [
    1063, 1180, 1183, 1186, 1189, 1240, 1243, 1246, 1087, 1273, 1276, 1279,
    1282, 1150, 1153, 1168, 1171,
  ];
  const snowCodes = [
    1066, 1210, 1213, 1216, 1219, 1222, 1225, 1069, 1204, 1207, 1249, 1252,
    1237, 1261, 1264,
  ];
  const cloudyCodes = [1003, 1006, 1009];
  const fogMist = [1030, 1033, 1036, 1039, 1042, 1135, 1147];
  const sunnyCodes = [
    1000, 1030, 1033, 1036, 1039, 1042, 1135, 1147, 1012, 1015, 1018, 1021,
    1024, 1027, 1045, 1048,
  ];

  const isRaining = rainCodes.includes(conditionCode);
  const isSnowing = snowCodes.includes(conditionCode);
  const isCloudy = cloudyCodes.includes(conditionCode);
  const isSunny = sunnyCodes.includes(conditionCode);
  const isFogMist = fogMist.includes(conditionCode);

  // 1. Night overrides everything except maybe rain/snow, your call
  if (timeInMinutes >= NIGHT_START) {
    return <Night weather={weather} />;
  }

  // 2. Rain and snow take priority during the day
  if (isRaining) return <Raining weather={weather} />;
  if (isSnowing) return <Snow weather={weather} />;

  // 3. Cloudy during the day
  if (isCloudy) return <Cloudy weather={weather} />;

  // 4. Sunny — time-based rendering
  if (isSunny) {
    if (timeInMinutes < MORNING_END) return <Sunrise weather={weather} />;
    if (timeInMinutes >= SUNSET_START) return <Sunset weather={weather} />;
    return <Afternoon weather={weather} />;
  }

  if (isFogMist) return <Fogmist weather={weather} />;

  // 5. Fallback
  return <Cloudy weather={weather} />;
}

export default function WeatherDisplay({ weather }) {
  if (!weather || !weather.location || !weather.current) {
    return null;
  }
  return getWeatherComponent(weather);
}
