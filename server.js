const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("inventoryRecord.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const inventoryPackage = grpcObject.inventory;
const server = new grpc.Server();
const csv = require("csv-parser");
const fs = require("fs");
const InventoryRecord = require("./models/InventoryRecord");
const inventoryList = [];

fs.createReadStream("InventoryList.csv")
  .pipe(csv({ headers: false }))
  .on("data", (data) => {
    inventoryList.push(
      new InventoryRecord(
        data[0],
        data[1],
        data[2],
        data[3],
        data[4],
        data[5],
        data[6],
        data[7],
        data[8],
        data[9]
      )
    );
  })
  .on("end", () => {
    console.log("Finished reading CSV");
  });

server.addService(inventoryPackage.InventoryService.service, {
  searchByID: searchByID,
  search: search,
  searchByRange: searchByRange,
  getDistribution: getDistribution,
  update: update,
});

function searchByID(call, callback) {
  const inventory = inventoryList.find((n) => n.inventoryId == call.request.id);
  if (inventory !== undefined) {
    callback(null, inventory);
  } else {
    callback(null, {
      // code: grpc.status.NOT_FOUND,
      // details: "Not found",
    });
  }
}
function search(call, callback) {
  const inventory = inventoryList.find(
    (n) =>
      n.hasOwnProperty(call.request.key) &&
      n[call.request.key] === call.request.value
  );
  if (inventory !== undefined) {
    callback(null, inventory);
  } else {
    callback(null, {
      // code: grpc.status.NOT_FOUND,
      // details: "Not found",
    });
  }
}
function searchByRange(call, callback) {
  const inventories = inventoryList.filter(
    (n) =>
      n.hasOwnProperty(call.request.key) &&
      n[call.request.key] >= call.request.valueStart &&
      n[call.request.key] <= call.request.valueEnd
  );

  if (inventories) {
    callback(null, { inventories });
  } else {
    callback({
      // code: grpc.status.NOT_FOUND,
      // details: "Not found",
    });
  }
}
function getDistribution(call, callback) {
  let arr = inventoryList.map(
    (el) => el.hasOwnProperty(call.request.key) && el[call.request.key]
  );
  let filteredArr = arr.filter((el) => el < call.request.percentile);

  let percentile = (filteredArr.length / arr.length) * 100;

  if (percentile) {
    callback(null, { percentile });
  } else {
    callback({
      // code: grpc.status.INVALID_ARGUMENT,
      // details: "No result",
    });
  }
}
function update(call, callback) {
  let inventory = inventoryList.find(
    (el) =>
      el.hasOwnProperty(call.request.key) &&
      el[call.request.key] === call.request.value
  );

  if (inventory !== undefined) {
    inventory[call.request.updateKey] = call.request.updateValue;
    callback(null, { updated: true });
  } else {
    callback({
      // code: grpc.status.NOT_FOUND,
      // details: "Not Found",
      // updated: false,
    });
  }
}

const port = parseInt(process.env.PORT) || 50051;

server.bindAsync(
  "127.0.0.1:" + port,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    server.start();
    console.log(`listening on port ${port}`);
  }
);
