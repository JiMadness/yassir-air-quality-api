# Air Quality API

This is a NestJS application that provides an API to fetch air quality data based on geographic coordinates. The application integrates with a third-party air quality data provider.

## Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Services](#services)
- [Controllers](#controllers)
- [Environment Variables](#environment-variables)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/jimadness/yassir-air-quality-api.git
   ```
2. Navigate to the project directory:
   ```sh
   cd yassir-air-quality-api
   ```
3. Install dependencies:
   ```sh
   yarn install
   ```

## Running the Application

1. Start the MongoDB server.
2. Set the required environment variables (see [Environment Variables](#environment-variables)).
3. Run the application:
   ```sh
   npm run start
   ```

## Testing

To run the unit and e2e tests:
```sh
npm test
```

## Services

### AirQualityService

This service fetches air quality data for given coordinates from a third-party API.

#### Methods

- `getAirQualityForCoordinates(coordinates: Coordinates): Promise<AirQuality>`

  Fetches the air quality data for the specified coordinates.

### ParisAirQualityJobService

This service runs a scheduled job to fetch and store air quality data for Paris.

#### Methods

- `putAirQualityForParis()`

  Fetches the latest air quality data for Paris and stores it in the database.

- `calculatePollutionAverage(aqius: number, aqicn: number): number`

  Calculates the average of two pollution indexes.

### ParisAirQualityService

This service retrieves historical air quality data for Paris from the database.

#### Methods

- `getDateTimeWhenMostPolluted(): Promise<{ ts: string }>`

  Returns the timestamp when the air quality in Paris was the most polluted.

## Controllers

### AirQualityController

This controller provides endpoints to retrieve air quality data.

#### Endpoints

- `GET /air-quality`

  Fetches the air quality data for the specified coordinates.

  **Query Parameters:**
    - `latitude` (number): The latitude of the location.
    - `longitude` (number): The longitude of the location.

  **Response:**
    - `200 OK` - Returns the air quality data.

- `GET /air-quality/paris/most-polluted/ts`

  Fetches the timestamp when the air quality in Paris was the most polluted.

  **Response:**
    - `200 OK` - Returns the timestamp.

## Environment Variables

The following environment variables need to be set:

- `MONGO_URI`: The MongoDB connection string.
- `AIR_QUALITY_API_URL`: The base URL for the air quality API.
- `API_KEY`: The API key for the air quality API.
- `API_KEY_TOKEN`: The token placeholder for the API key in the URL.
- `LONGITUDE_TOKEN`: The token placeholder for the longitude in the URL.
- `LATITUDE_TOKEN`: The token placeholder for the latitude in the URL.
