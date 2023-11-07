const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("inventoryRecord.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const inventoryPackage = grpcObject.inventory;

const fs = require("fs");

const text = process.argv[2];

const client = new inventoryPackage.InventoryService(
  // "localhost:50051",
  "grpc-assignment.azurewebsites.net",
  grpc.credentials.createFromSecureContext()
  // grpc.credentials.createInsecure()
);

let responseTimesFirst = [];
let responseTimesSecond = [];
let responseTimesThird = [];
let responseTimesFourth = [];
let responseTimesFifth = [];

const makesearchByIDRequest = (responseTimesFirst) => {
  let startTime = process.hrtime();
  let ID = `IN00${Math.floor(Math.random() * (25 - 1) + 1)}`;

  client.searchByID(
    {
      id: ID,
    },
    (err, response) => {
      if (err) {
        console.log("Inventory " + err.details);
      } else {
        console.log(`Inventory has been read for` + JSON.stringify(response));
      }
    }
  );

  let endTime = process.hrtime(startTime);
  const delay = endTime[0] + endTime[1] / 1e6;

  responseTimesFirst.push(delay);
};

const makesearchRequest = (responseTimesSecond) => {
  let startTime = process.hrtime();

  client.search({ key: "name", value: "Item 1" }, (err, response) => {
    if (err) {
      console.log("Inventory " + err.details);
    } else {
      console.log("Inventory has been read " + JSON.stringify(response));
    }
  });

  let endTime = process.hrtime(startTime);
  const delay = endTime[0] + endTime[1] / 1e6;

  responseTimesSecond.push(delay);
};

const makesearchByRangeRequest = (responseTimesThird) => {
  let startTime = process.hrtime();

  client.searchByRange(
    { key: "unitPrice", valueStart: "50", valueEnd: "60.00" },
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Inventory has been read " + JSON.stringify(response));
      }
    }
  );

  let endTime = process.hrtime(startTime);
  const delay = endTime[0] + endTime[1] / 1e6;

  responseTimesThird.push(delay);
};

const makeDistributionRequest = (responseTimesFourth) => {
  let startTime = process.hrtime();

  client.getDistribution(
    { key: "unitPrice", percentile: 40.0 },
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Percentile response " + JSON.stringify(response));
      }
    }
  );

  let endTime = process.hrtime(startTime);
  const delay = endTime[0] + endTime[1] / 1e6;

  responseTimesFourth.push(delay);
};

const makeUpdateRequest = (responseTimesFifth) => {
  let startTime = process.hrtime();

  client.update(
    {
      key: "name",
      value: "Item 24",
      updateKey: "quantityInStock",
      updateValue: "25",
    },
    (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Update response : ", JSON.stringify(response));
      }
    }
  );

  let endTime = process.hrtime(startTime);
  const delay = endTime[0] + endTime[1] / 1e6;

  responseTimesFifth.push(delay);
};

for (let i = 0; i < 1; i++) {
  makesearchByIDRequest(responseTimesFirst);
  makesearchRequest(responseTimesSecond);
  makesearchByRangeRequest(responseTimesThird);
  makeDistributionRequest(responseTimesFourth);
  makeUpdateRequest(responseTimesFifth);
}

const stats = (responseTimes) => {
  let mean =
    responseTimes.reduce((acc, val) => acc + val, 0) / responseTimes.length;
  let std = Math.sqrt(
    responseTimes
      .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
      .reduce((acc, val) => acc + val, 0) /
      (responseTimes.length - 1)
  );
  console.log(responseTimes);
  console.log("mean : ", mean, "STD : ", std);
};

const writeStream = fs.createWriteStream("data.csv");

writeStream.write(responseTimesFirst.join('","'));

stats(responseTimesFirst);
writeStream.write(responseTimesSecond.join('","'));

stats(responseTimesSecond);
writeStream.write(responseTimesThird.join('","'));

stats(responseTimesThird);
writeStream.write(responseTimesFourth.join('","'));

stats(responseTimesFourth);
writeStream.write(responseTimesFifth.join('","'));
stats(responseTimesFifth);
