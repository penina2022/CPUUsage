const express = require('express');
const app = express();
const {
  CloudWatchClient,
  GetMetricDataCommand,
} = require("@aws-sdk/client-cloudwatch");
const getInstanceIdFromIP = require('./getInstanceId');
const cors = require('cors');
app.use(cors());

app.use(express.static('public'));

// AWS credentials

const cloudwatchClient = new CloudWatchClient({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

//Get metrics using the input from the user.
const getCPUUtilization = async ({ instanceId, startTime, period }) => {
  // The parameters for GetMetricDataCommand.
  const params = {
    StartTime: new Date(startTime),
    EndTime: new Date(),
    MetricDataQueries: [
        {
          Id: "cpuUsage",
          MetricStat: {
            Metric: {
              Namespace: "AWS/EC2",
              MetricName: "CPUUtilization",
              Dimensions: [
                {
                  Name: "InstanceId",
                  Value: instanceId, // i-04a68bbbcac63d5cb
                },
              ],
            },
            Period: period,
            Stat: "Average",
            Unit: "Percent",
          },
          ReturnData: true,
        },
      ],
  };

  try {
    //Gets the data.
    const command = new GetMetricDataCommand(params);
    const response = await cloudwatchClient.send(command);
    //Gets onlt the info we are looking for.
    const result = response.MetricDataResults?.[0];
 
    return result;
  } catch (err) {
    console.error("Error fetching metric data:", err);
  }
};

//Gets the information from the user and sends it to getCPUUtilization for the cpu usage info.
app.get('/cpuUsage', async (req, res) => {
  const { instanceId, startTime, period } = req.query;

  if (!instanceId || !startTime || !period) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  try {
    //Geting the correct InctanceId for the getCPUUtilization.
    const correctInstanceId= await getInstanceIdFromIP(`${instanceId}`);
    const metrics = await getCPUUtilization({ instanceId: correctInstanceId, startTime, period });
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(4000, () => console.log("Server running on port 4000"));
