const { EC2Client, DescribeInstancesCommand } = require("@aws-sdk/client-ec2");
require('dotenv').config();


const ec2Client = new EC2Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

//Getting the InstanceId by the ip that was send from the user.
const getInstanceIdFromIP = async (ip) => {
  const cmd = new DescribeInstancesCommand({
    Filters: [
      { Name: "private-ip-address", Values: [ip] }
    ]
  });

  try {
    const res = await ec2Client.send(cmd);
    const instance = res.Reservations?.[0]?.Instances?.[0];
    return instance?.InstanceId;
  } catch (err) {
    console.error("Failed to get instance from IP:", err);
    return null;
  }
};

module.exports = getInstanceIdFromIP;
