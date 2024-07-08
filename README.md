# Air Quality API

This is a NestJS application that provides an API to fetch air quality data based on geographic coordinates. The application integrates with a third-party air quality data provider.

## Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Services and Interactions](#services-and-interactions)
- [Testing](#testing)

## Installation

To install and set up the project, follow these steps:

1. **Clone the repository:**
    ```sh
    git clone https://github.com/jimadness/air-quality-api.git
    cd air-quality-api
    ```

2. **Install dependencies:**
    ```sh
    yarn install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory of the project and add the following environment variables:

    ```sh
    PORT=3000
    MONGODB_URI=mongodb+srv://api:<password>@cluster0.inmzjdm.mongodb.net/air-quality?retryWrites=true&w=majority&appName=Cluster0
    AIR_QUALITY_API_URL=https://api.airvisual.com/v2/nearest_city?lat={latitude}&lon={longitude}&key={apikey}
    API_KEY=your-api-key
    API_KEY_TOKEN={apikey}
    LONGITUDE_TOKEN={longitude}
    LATITUDE_TOKEN={latitude}
    ```

## Running the Application

You can run the application in development mode using:

```sh
npm run start:dev
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Get Air Quality Data

- **Endpoint:** `GET /air-quality`
- **Query Parameters:**
    - `latitude` (number): The latitude of the location.
    - `longitude` (number): The longitude of the location.
- **Response:**
    - `200 OK`: Returns the air quality data for the given coordinates.
    - `500 Internal Server Error`: If there is an error fetching the data.

**Example Request:**

```sh
curl -X GET "http://localhost:3000/air-quality?latitude=40.7128&longitude=-74.0060"
```

**Example Response:**

```json
{
  "Result": {
    "Pollution": {
      "ts": "2024-07-07T23:00:00.000Z",
      "aqius": 50,
      "mainus": "p2",
      "aqicn": 30,
      "maincn": "p1"
    }
  }
}
```

## Environment Variables

Ensure you have the following environment variables set in your `.env` file:

- `PORT`: The port on which the server will run.
- `MONGO_URI`: The connection string to the MongoDB cluster.
- `AIR_QUALITY_API_URL`: The base URL of the air quality API with placeholders for latitude, longitude, and API key.
- `API_KEY`: The API key for the air quality data provider.
- `API_KEY_TOKEN`: The placeholder token for the API key in the URL.
- `LONGITUDE_TOKEN`: The placeholder token for the longitude in the URL.
- `LATITUDE_TOKEN`: The placeholder token for the latitude in the URL.

## Services and Interactions

### AirQualityProviderService

The `AirQualityProviderService` is responsible for interacting with the third-party air quality data provider. It constructs the complete provider URL using the provided coordinates and environment variables, makes the HTTP request to the provider, and returns the data.

- **Methods:**
    - `getAirQuality(coordinates: Coordinates): Promise<AirQualityAPIResponse>`: Fetches air quality data from the provider for the given coordinates.
    - `getCompleteProviderURL(coordinates: Coordinates): string`: Constructs the complete URL for the provider API request.

### AirQualityService

The `AirQualityService` uses the `AirQualityProviderService` to get air quality data and transform it into the required format for the application.

- **Methods:**
    - `getAirQualityForCoordinates(coordinates: Coordinates): Promise<AirQuality>`: Fetches and transforms air quality data for the given coordinates.
    - `getAirQualityFromProviderResponse(providerResponse: AirQualityAPIResponse): AirQuality`: Transforms the provider response into the application's air quality format.

### AirQualityController

The `AirQualityController` handles incoming HTTP requests related to air quality data. It uses the `AirQualityService` to fetch and return the data.

- **Methods:**
    - `getAirQuality(@Query() coordinates: GetAirQualityDto): Promise<AirQuality>`: Endpoint to get air quality data for the given coordinates.

### Interaction Flow

1. **Controller**: Receives the request with coordinates and calls the `AirQualityService`.
2. **Service**: Calls the `AirQualityProviderService` to fetch raw data from the third-party provider.
3. **Provider Service**: Constructs the provider URL, makes the HTTP request, and returns the raw data.
4. **Service**: Transforms the raw data into the required format and returns it to the controller.
5. **Controller**: Sends the transformed data back as the HTTP response.

## Testing

### Unit Tests

Run the unit tests using:

```sh
npm run test
```

### End-to-End Tests

Run the end-to-end tests using:

```sh
npm run test:e2e
```

### Test Coverage

Check the test coverage using:

```sh
npm run test:cov
```
