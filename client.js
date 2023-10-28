const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("inventoryRecord.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const inventoryPackage = grpcObject.inventory;

const text = process.argv[2];

const client = new inventoryPackage.InventoryService(
  // "http://3.88.251.218:3100:80",

  "http://ec2-3-88-251-218.compute-1.amazonaws.com/:80",
  // "http://grpc-kxsb.onrender.com/",
  // "localhost:50000",
  grpc.credentials.createInsecure()
);

client.searchByID(
  {
    id: "IN0024",
  },
  (err, response) => {
    if (err) {
      console.log("Inventory " + err.details);
    } else {
      console.log("Inventory has been read " + JSON.stringify(response));
    }
  }
);

// client.search({ key: "name", value: "Item " }, (err, response) => {
//   if (err) {
//     console.log("Inventory " + err.details);
//   } else {
//     console.log("Inventory has been read " + JSON.stringify(response));
//   }
// });

// client.searchByRange(
//   { key: "unitPrice", valueStart: "50", valueEnd: "60.00" },
//   (err, response) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Inventory has been read " + JSON.stringify(response));
//     }
//   }
// );

// client.getDistribution(
//   { key: "unitPrice", percentile: 40.0 },
//   (err, response) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Percentile response " + JSON.stringify(response));
//     }
//   }
// );

// client.update(
//   {
//     key: "name",
//     value: "Item 24",
//     updateKey: "quantityInStock",
//     updateValue: "25",
//   },
//   (err, response) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Update response : ", JSON.stringify(response));
//     }
//   }
// );
