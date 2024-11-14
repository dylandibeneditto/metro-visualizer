"use client";

import "./global.css";
import "./page.css";
import { useEffect, useRef, useState } from "react";
import {
  fetchStationArrivalEstimates,
  fetchTrainArrivals,
} from "./api/getData";

export default function Home() {
  const canvasRef = useRef(null);
  const [trainData, setTrainData] = useState([]);
  const [animatedTrains, setAnimatedTrains] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTrainData() {
      try {
        const trains = await fetchStationArrivalEstimates("All");
        setTrainData(trains || []);
      } catch (err) {
        console.error("Error loading train data:", err);
        setError("Could not load train data");
      }
    }

    const intervalId = setInterval(loadTrainData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const stationLocation = {
    RD: {
      "Shady Grv": 0.013,
      Rockville: 0.0445,
      Twinbrook: 0.0755,
      "North Bethesda": 0.106,
      "Grosvenor-Strathmore": 0.1365,
      "Medical Center": 0.1675,
      Bethesda: 0.199,
      "Friendship Heights": 0.229,
      "Tenleytown-AU": 0.251,
      "Van Ness-UDC": 0.271,
      "Cleveland Park": 0.293,
      "Woodley Park": 0.315,
      "Dupont Circle": 0.335,
      "Farragut North": 0.36,
      "Metro Center": 0.465,
      "Gallery Place": 0.5275,
      "Judiciary Sq": 0.564,
      "Union Station": 0.615,
      "NoMa-Gallaudet U": 0.642,
      "Rhode Island Ave": 0.668,
      "Brookland-CUA": 0.693,
      "Fort Totten": 0.7695,
      Takoma: 0.855,
      "Silver Spring": 0.915,
      "Forest Glen": 0.94,
      Wheaton: 0.965,
      Glenmont: 0.99,
    },
  };

  useEffect(() => {
    const newTrains = trainData.map((train) => {
      const progress = stationLocation["RD"][train.LocationName] || 0;
      return { ...train, progress };
    });
    setAnimatedTrains(newTrains);
    console.log(newTrains);
  }, [trainData]);

  const linePaths = {
    RD: null, // Will be populated later
    BL: null,
    GR: null,
    YL: null,
    OR: null,
    SV: null,
  };

  useEffect(() => {
    // Assign SVG paths to the linePaths object
    linePaths.RD = document.querySelector("#RedLinePath");
    linePaths.BL = document.querySelector("#BlueLinePath");
    linePaths.GR = document.querySelector("#GreenLinePath");
    linePaths.YL = document.querySelector("#YellowLinePath");
    linePaths.OR = document.querySelector("#OrangeLinePath");
    linePaths.SV = document.querySelector("#SilverLinePath");

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Loop over each line and station in stationLocation
      /*Object.entries(stationLocation).forEach(([lineCode, stations]) => {
        const path = linePaths[lineCode];
        if (path) {
          const pathLength = path.getTotalLength();

          // Loop over each station and draw it on the path
          Object.entries(stations).forEach(([stationName, stationPosition]) => {
            const position = path.getPointAtLength(
              stationPosition * pathLength
            );
            drawTrain(
              ctx,
              position.x,
              (position.y - 1334) * 0.902 + 1334,
              lineCode
            );

            // For debugging, you could add station names or markers
            ctx.fillStyle = "black";
            ctx.font = "12px Arial";
            ctx.fillText(
              stationName,
              position.x + 5,
              (position.y - 1334) * 0.902 + 1334 + 5
            );
          });
        }
      });*/

      // Loop through trains and animate them
      animatedTrains.forEach((train) => {
        const path = linePaths[train.Line];
        if (path) {
          const pathLength = path.getTotalLength();
          const position = path.getPointAtLength(train.progress * pathLength);
          drawTrain(
            ctx,
            position.x,
            (position.y - 1334) * 0.902 + 1334,
            train.Line
          );
        }
        train.position += .001
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, [animatedTrains]);

  function drawTrain(ctx, x, y, lineCode) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = getColorForLine(lineCode);
    ctx.fill();
  }

  function getColorForLine(lineCode) {
    switch (lineCode) {
      case "RD":
        return "red";
      case "BL":
        return "blue";
      case "GR":
        return "green";
      case "YL":
        return "yellow";
      case "OR":
        return "orange";
      case "SV":
        return "silver";
      default:
        return "gray";
    }
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="day">
      <canvas ref={canvasRef} width={2963} height={2669} id="map"></canvas>
      <svg
        className="metro-map"
        alt="Metro Map"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2963 2669"
      >
        <path
          id="OrangeLinePath"
          fill="none"
          opacity="0.6"
          d="M298 1304.5H999.5C1021.59 1304.5 1039.5 1286.59 1039.5 1264.5V1155C1039.5 1088.73 1093.23 1035 1159.5 1035H1547.5C1613.77 1035 1667.5 1088.73 1667.5 1155V1395.5C1667.5 1417.59 1685.41 1435.5 1707.5 1435.5H2102.51C2113.37 1435.5 2123.76 1431.08 2131.3 1423.27L2179.11 1373.7C2201.72 1350.25 2232.9 1337 2265.48 1337H2456.43C2467.04 1337 2477.21 1332.79 2484.72 1325.28L2776 1034"
          stroke="#EAB378"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          id="RedLinePath"
          fill="none"
          opacity="0.6"
          d="M619.5 152.5L1196.79 728.32C1204.29 735.8 1214.45 740 1225.04 740H1261.16C1271.63 740 1281.69 744.109 1289.17 751.445L1475.51 934.239C1483.18 941.762 1487.5 952.052 1487.5 962.794V1165C1487.5 1187.09 1505.41 1205 1527.5 1205H2062.5C2084.59 1205 2102.5 1187.09 2102.5 1165V858.069C2102.5 847.46 2098.29 837.286 2090.78 829.784L1716.22 455.216C1708.71 447.714 1704.5 437.54 1704.5 426.931V10.5"
          stroke="#EE828C"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          id="SilverLinePath"
          fill="none"
          opacity="0.6"
          d="M13 710.5L609.679 1311.99C624.612 1327.04 644.91 1335.55 666.113 1335.65L995.139 1337.14C1039.46 1337.34 1075.5 1301.46 1075.5 1257.14V1148C1075.5 1103.82 1111.32 1068 1155.5 1068H1551.5C1595.68 1068 1631.5 1103.82 1631.5 1148V1389C1631.5 1433.18 1667.32 1469 1711.5 1469H2098.86C2120.08 1469 2140.43 1460.57 2155.43 1445.57L2205.57 1395.43C2220.57 1380.43 2240.92 1372 2262.14 1372H2953"
          stroke="#6B6B6B"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          id="BlueLinePath"
          fill="none"
          opacity="0.6"
          d="M1004 2584.5V2442C1004 2397.82 1039.82 2362 1084 2362H1507C1529.09 2362 1547 2344.09 1547 2322V2093.5C1547 2071.41 1529.09 2053.5 1507 2053.5H1458.5C1414.32 2053.5 1378.5 2017.68 1378.5 1973.5V1740.56C1378.5 1729.66 1374.05 1719.23 1366.19 1711.69L1122.31 1477.81C1114.45 1470.27 1110 1459.84 1110 1448.94V1145C1110 1122.91 1127.91 1105 1150 1105H1557C1579.09 1105 1597 1122.91 1597 1145V1386C1597 1452.27 1650.73 1506 1717 1506H2098.11C2130.05 1506 2160.66 1493.27 2183.18 1470.64L2233.77 1419.79C2241.28 1412.24 2251.48 1408 2262.13 1408H2953"
          stroke="#8DABEA"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          id="YellowLinePath"
          fill="none"
          opacity="0.6"
          d="M1584.5 2586.5V2097.5C1584.5 2053.32 1548.68 2017.5 1504.5 2017.5H1453C1430.91 2017.5 1413 1999.59 1413 1977.5V1817.57C1413 1806.96 1417.21 1796.79 1424.72 1789.28L1543.07 1670.93C1558.07 1655.93 1578.42 1647.5 1599.64 1647.5H1783.5C1805.59 1647.5 1823.5 1629.59 1823.5 1607.5V1049.5"
          stroke="#F3E54A"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <path
          id="GreenLinePath"
          fill="none"
          opacity="0.6"
          d="M2546.5 2029L2384.28 1866.78C2368.66 1851.16 2343.34 1851.16 2327.72 1866.78L2309.67 1884.83C2293.9 1900.6 2268.28 1900.43 2252.72 1884.45L2138.55 1767.19C2123.49 1751.72 2102.82 1743 2081.23 1743H1900C1877.91 1743 1860 1725.09 1860 1703V962C1860 917.817 1824.18 882 1780 882H1742.5C1720.41 882 1702.5 864.091 1702.5 842V798.5C1702.5 776.409 1720.41 758.5 1742.5 758.5H1847.86C1869.08 758.5 1889.43 750.071 1904.43 735.069L2269.5 370"
          stroke="#ABD9AE"
          strokeWidth="20"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
