const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("inventoryRecord.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const inventoryPackage = grpcObject.inventory;

const text = process.argv[2];

const client = new inventoryPackage.InventoryService(
  "localhost:50000",
  grpc.credentials.createInsecure()
);

// client.createBook(
//   {
//     title: "title 3",
//     author: "Herod 3",
//     content: "Content 3",
//   },
//   (err, response) => {
//     console.log("Book has been created " + JSON.stringify(response));
//   }
// );

client.searchByID(
  {
    id: "IN0003",
  },
  (err, response) => {
    console.log("Book has been read " + JSON.stringify(response));
  }
);

// client.updateBook(
//   {
//     id: 2,
//     title: "title 3",
//     author: "Herod 3",
//     content: "Content 3",
//   },
//   (err, response) => {
//     console.log("Book has been updated " + JSON.stringify(response));
//   }
// );

// client.deleteBook(
//   {
//     id: 2,
//   },
//   (err, response) => {
//     console.log("Book has been deleted " + JSON.stringify(response));
//   }
// );

// client.allBooks(null, (err, response) => {
//   console.log("Read all books from database " + JSON.stringify(response));
// });
