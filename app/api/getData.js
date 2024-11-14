export async function fetchTrainArrivals() {
    try {
        const response = await fetch('https://api.wmata.com/TrainPositions/TrainPositions?contentType=json', {
            method: 'GET',
            headers: {
                'api_key': '04a7469a0ade4e6aaf5de8e60375c7ae'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (err) {
        console.error('Error fetching train data:', err);
        return null;
    }
}

export async function fetchStationArrivalEstimates(stationCode) {
    try {
        // Make the request to WMATA's StationPrediction endpoint, inserting the station code in the URL
        const response = await fetch(`https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${stationCode}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'api_key': '04a7469a0ade4e6aaf5de8e60375c7ae'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data.Trains; // Assuming "Trains" contains the array of arrival estimates
    } catch (err) {
        console.error('Error fetching station arrival estimates:', err);
        return null;
    }
}