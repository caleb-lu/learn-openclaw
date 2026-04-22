---
name: weather
version: 1.0.0
description: Get current weather and forecasts for any location
triggers:
  - pattern: "(weather|forecast|temperature) in {location}"
    parameters:
      location: string
---

# Weather Skill

Fetches weather data and provides forecasts.

## Usage
- "weather in Tokyo"
- "What's the forecast for London?"
- "temperature in New York"

## Implementation
When triggered, this skill:
1. Extracts the location from the trigger pattern
2. Calls the weather API
3. Formats the response with current conditions and forecast
