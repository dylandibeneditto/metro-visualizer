"use client";

import MapIcon from "@/public/map";
import "./global.css";
import "./page.css";

import {
  fetchTrainArrivals,
  fetchStationArrivalEstimates,
} from "./api/getData";

import { useEffect, useState } from "react";

export default function Home() {
  const [trainData, setTrainData] = useState([]);
  const [arrivalEstimates, setArrivalEstimates] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
      async function loadTrainData() {
          try {
              // Step 1: Fetch the train data
              const trains = await fetchTrainArrivals();
              setTrainData(trains);

              // Step 2: Extract unique destination station codes
              const stationCodes = new Set(); // Set to ensure unique codes
              console.log(trains)
              trains.TrainPositions.forEach(train => {
                  const destinationCode = train.DestinationStationCode;
                  if (destinationCode) {
                      stationCodes.add(destinationCode);
                  }
              });

              // Step 3: Fetch the arrival estimates for each unique station code
              const estimates = {};
              for (let stationCode of stationCodes) {
                  const stationData = await fetchStationArrivalEstimates(stationCode);
                  if (stationData) {
                    console.log(stationData)
                      estimates[stationCode] = stationData;
                  }
              }

              // Step 4: Set the arrival estimates data in the state
              setArrivalEstimates(estimates);
          } catch (err) {
              console.error('Error loading train data:', err);
              setError('Could not load train data');
          }
      }

      loadTrainData();
  }, []);

  if (error) {
      return <p>{error}</p>;
  }

  if (!trainData.length || !Object.keys(arrivalEstimates).length) {
      return <p>Loading...</p>;
  }

  console.log(arrivalEstimates);

  return (
    <div className="day">
      <canvas id="map"></canvas>
      <ul>
        {trainData.TrainPositions.map((train) => {
          const destinationCode = train.DestinationStationCode;
          const stationPredictions = arrivalEstimates[destinationCode] || [];

          return (
            <li key={train.TrainId}>
              <h2>
                Train {train.TrainNumber} ({train.LineCode} Line)
              </h2>
              <p>Destination: {destinationCode || "Unknown"}</p>
              <p>Service Type: {train.ServiceType}</p>
              <h3>Predictions for {destinationCode} Station:</h3>
              {stationPredictions.length > 0 ? (
                <ul>
                  {stationPredictions.map((prediction, index) => (
                    <li key={index}>
                      {prediction.TrainId}: {prediction.Min} mins
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No predictions available</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
