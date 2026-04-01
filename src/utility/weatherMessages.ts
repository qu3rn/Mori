/**
 * Weather condition → message string mapping.
 *
 * Three exclusive conditions are derived from the Open-Meteo API response.
 * All messages are hardcoded — no external string reaches the DOM.
 */

export type WeatherCondition = 'clear' | 'cloudy' | 'rain'

export const WEATHER_MESSAGES: Record<WeatherCondition, string> = {
  clear:  "Today feels almost Californian — enjoy the visit.",
  cloudy: "Maybe it's not perfect, but at least it's not raining.",
  rain:   "Well, at least the website is pretty.",
}

/**
 * Maps a WMO 4677 weather code and current precipitation to a three-state condition.
 *
 * WMO code reference used here:
 *   0        → clear sky
 *   1–3      → mainly clear / partly cloudy / overcast
 *   45, 48   → fog / depositing rime fog
 *   51–67    → drizzle / rain
 *   71–77    → snow
 *   80–82    → rain showers
 *   85, 86   → snow showers
 *   95–99    → thunderstorm
 */
export function resolveCondition(weatherCode: number, precipitation: number): WeatherCondition {
  // Precipitation actively falling overrides weatherCode classification
  if (precipitation > 0) return 'rain'
  if (weatherCode === 0) return 'clear'
  if (weatherCode <= 3) return 'cloudy'
  // 45, 48: fog; 51+: any form of precipitation
  if (weatherCode >= 45) return 'rain'
  return 'cloudy'
}
