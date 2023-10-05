const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("inventoryRecord.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const inventoryPackage = grpcObject.inventory;

const server = new grpc.Server();

let inventoryList = [
  {
    inventoryID: "IN0001",
    Name: "Item 1",
    Description: "Desc 1",
    unitPrice: "$51.00",
    quantityInStock: "25",
    inventoryValue: "$1,275.00",
    reorderLevel: "29",
    reorderTimeinDays: "13",
    quantityInReorder: "50",
    Discontinued: "false",
  },
  {
    inventoryID: "IN0002",
    Name: "Item 1",
    Description: "Desc 2",
    unitPrice: "$93.00",
    quantityInStock: "132",
    inventoryValue: "$12,276.00",
    reorderLevel: "231",
    reorderTimeinDays: "4",
    quantityInReorder: "50",
    Discontinued: "false",
  },
  {
    inventoryID: "IN0003",
    Name: "Item 3",
    Description: "Desc 3",
    unitPrice: "$57.00",
    quantityInStock: "151",
    inventoryValue: "$8,607.00",
    reorderLevel: "114",
    reorderTimeinDays: "11",
    quantityInReorder: "150",
    Discontinued: "false",
  },
  {
    inventoryID: "IN0004",
    Name: "Item 4",
    Description: "Desc 4",
    unitPrice: "$19.00",
    quantityInStock: "186",
    inventoryValue: "$3,534.00",
    reorderLevel: "158",
    reorderTimeinDays: "6",
    quantityInReorder: "50",
    Discontinued: "false",
  },
  {
    inventoryID: "IN0005",
    Name: "Item 5",
    Description: "Desc 5",
    unitPrice: "$75.00",
    quantityInStock: "62",
    inventoryValue: "$4,650.00",
    reorderLevel: "39",
    reorderTimeinDays: "12",
    quantityInReorder: "50",
    Discontinued: "false",
  },
  {
    inventoryID: "IN0006",
    Name: "Item 6",
    Description: "Desc 6",
    unitPrice: "$11.00",
    quantityInStock: "5",
    inventoryValue: "$55.00",
    reorderLevel: "9",
    reorderTimeinDays: "13",
    quantityInReorder: "150",
    Discontinued: "false",
  },
  {
    inventoryID: "IN0007",
    Name: "Item 7",
    Description: "Desc 7",
    unitPrice: "$56.00",
    quantityInStock: "58",
    inventoryValue: "$3,428.00",
    reorderLevel: "109",
    reorderTimeinDays: "7",
    quantityInReorder: "100",
    Discontinued: "false",
  },
  {
    inventoryID: "IN0008",
    Name: "Item 8",
    Description: "Desc 8",
    unitPrice: "$38.00",
    quantityInStock: "101",
    inventoryValue: "$3,838.00",
    reorderLevel: "162",
    reorderTimeinDays: "3",
    quantityInReorder: "100",
    Discontinued: "false",
  },
  {
    inventoryID: "IN0009",
    Name: "Item 9",
    Description: "Desc 9",
    unitPrice: "$59.00",
    quantityInStock: "122",
    inventoryValue: "	$7,198.00",
    reorderLevel: "82",
    reorderTimeinDays: "3",
    quantityInReorder: "150",
    Discontinued: "false",
  },
  {
    inventoryID: "IN00010",
    Name: "Item 10",
    Description: "Desc 10",
    unitPrice: "$50.00,",
    quantityInStock: "175",
    inventoryValue: "$8,750.00",
    reorderLevel: "283",
    reorderTimeinDays: "8",
    quantityInReorder: "	150",
    Discontinued: "false",
  },
];

server.addService(inventoryPackage.InventoryService.service, {
  searchByID: searchByID,
  // allBooks: allBooks,
  // createBook: createBook,
  // readBook: readBook,
  // updateBook: updateBook,
  // deleteBook: deleteBook,
});

function createBook(call, callback) {
  const book = call.request;
  book.id = books.length + 1;
  inventoryList.push(book);
  callback(null, { inventoryList });
}

function searchByID(call, callback) {
  // const inventory = inventoryList.find((n) => n.inventoryID == "IN0001");
  const inventory = inventoryList.find((n) => n.inventoryID == call.request.id);

  if (inventory) {
    callback(null, inventory);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Not found",
    });
  }
}

function updateBook(call, callback) {
  const existingBook = inventoryList.find((n) => n.id == call.request.id);
  if (existingBook) {
    existingBook.title = call.request.title;
    existingBook.author = call.request.author;
    existingBook.content = call.request.content;
    callback(null, existingBook);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Not found",
    });
  }
}

function deleteBook(call, callback) {
  const existingBookIndex = books.findIndex((n) => n.id == call.request.id);
  if (existingBookIndex != -1) {
    books.splice(existingBookIndex, 1);
    callback(null, {});
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Book not found",
    });
  }
}

function allBooks(call, callback) {
  callback(null, { books });
}

server.bindAsync(
  "127.0.0.1:50000",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    server.start();
    console.log(`listening on port ${port}`);
  }
);
