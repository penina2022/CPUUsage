import React, {useState} from "react";
import CpuUsageChart from "./CpuUsageChart";

function App() {
  const [ipAddress, setIpAddress] = useState("");
  const [startTime, setStratTime] = useState("");
  const [period, setPeriod] = useState("");
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState("");

  //A function that fetches the cpu usage (from the server.js)
  const cpuUsage = async () => {
    try{
      const response = await fetch(
        `http://localhost:4000/cpuUsage?instanceId=${ipAddress}&startTime=${startTime}&period=${period}`
      );
      const result = await response.json();
      //if the result wasn`t completed, the cpu usage wasn`t found. 
      if(result.StatusCode !== 'Complete') {
        setFetchError("NO CPU data found.");
        setData(null);
      } else {
        setFetchError("");
        setData(result);
      }
    } catch (err) {
      setFetchError("Failed to fetch CPU data.");
      console.error(err);
    }
  };


  return (
    <div className="App">
      <h1>Aws Instace CPU Usage.</h1>

      <div>
      <label>IP Address:</label>
        <input
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
        />
      </div>

      <div>
      <label>Start Time:</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStratTime(e.target.value)}
        />
      </div>

      <div>
      <label>Period:</label>
        <input
          type="number"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        />
      </div>

      <button onClick={cpuUsage}>Load</button>

      {fetchError && <p>{fetchError}</p>}

      {data && (
        <div>
          <CpuUsageChart timestamps={data.Timestamps} values={data.Values} />

        </div>
      )}
    </div>
  );
}

export default App;
