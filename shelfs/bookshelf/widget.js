let mainObj = {};
let button = document.querySelector(".addShelf");
button.addEventListener("click", () => {
  console.log("click");
  addShelf(mainObj);
});

let addBookk = document.querySelector(".addBook");
addBookk.addEventListener("click", () => {
  console.log("click");
  addBook();
});
// type apiData = {
//   maxShelfs: number;
//   shelfs: Array<Shelf>;
//   books: Array<Book>;
// };

// type Shelf = {
//   id: number;
//   theme: string;
//   isFull: boolean;
//   amount: number;
//   maxAmount: number;
//   link: string;
// };

// type Book = {
//   id: number;
//   topColor?: string;
//   bottomColor?: string;
//   middleColor?: string;
//   firstSeparatorColor?: string;
//   secondSeparatorColor?: string;
//   type: string;
//   shelfId: number;
//   decoration?: string;
//   pageMarker: boolean;
//   link: string (maybe directly the svg);
// };

let defaultApiData = {
  maxShelfs: 0,
  shelfs: [],
  books: [],
};

let widgetApiData = {
  maxShelfs: 0,
  shelfs: [],
  books: [],
};

window.addEventListener("onWidgetLoad", async function (obj) {
  // let api = await getApiData(obj);
  // init(obj, api, true);
});

const allowedEvents = ["addShelf", "removeShelf", "addBook", "removeBook"];

window.addEventListener("onEventReceived", function (obj) {
  console.log(obj);
  // possible events: addShelf, removeShelf, addBook, removeBook
  // when we receive an event to add a book, we check if the current shelf is full
  // if it is, we automatically add a new shelf and then add the book to it
  // if it isn't, we just add the book to the current shelf
  const { event } = obj.detail;

  console.log(event.value, event.field);

  if (!allowedEvents.includes(event.value)) return;

  if (event.field === "addShelf") {
    addShelf();
  }

  if (event.field === "removeShelf") {
    removeShelf(obj);
  }

  if (event.field == "addBook") {
    addBook(obj);
  }

  if (event.field === "removeBook") {
    removeBook(obj);
  }

  // not sure if the books are random or the user can specify which book to add
});

const getApiData = async (obj) => {
  // let data = await SE_API.store.get("beniartsTulipanGoalWidgetPreviousGained");
  // if (data === null) {
  //   widgetApiData = defaultApiData;
  // } else {
  //   widgetApiData = data;
  // }
  // if (obj.detail.fieldData.goalFullType === "session") {
  //   widgetApiData = defaultApiData;
  // }
  widgetApiData = defaultApiData;
  return widgetApiData;
};

const items = {
  main: document.getElementById("main"),
  shelfContainer: document.getElementById("shelfContainer"),
  shelfs: document.querySelectorAll(".shelf"),
  books: document.querySelectorAll(".book"),
};

function init(obj, apiData, initial = false) {
  apiData.shelfs.map((shelf) => {
    // for each shelf we create a new image in the widget
    // each image is inside a div which contains the same id as the shelf
    const shelfDiv = document.createElement("div");
    shelfDiv.id = shelf.id;
    items.shelfContainer?.appendChild(shelfDiv);
  });

  apiData.books.map((book) => {
    // for each book we create a new image in the widget
    // each book has a sheldId, same as the shelf it belongs to
    // so we get the shelf div and append the book image to it
    // and then we position the book image inside the shelf div
    const bookDiv = document.createElement("div");
    bookDiv.id = book.id;
    bookDiv.classList.add("book");
    items.shelfs[book.shelfId].appendChild(bookDiv);
  });
}

function updateApiData(amountToUpdate) {
  // SE_API.store.set("beniartsTulipanGoalWidgetPreviousGained", widgetApiData);
}

function clearApiData() {
  // SE_API.store.set("beniartsTulipanGoalWidgetPreviousGained", defaultApiData);
  window.location.reload();
}

const availableShelfs = ["https://i.postimg.cc/W115Zsb3/balda-abajo1.png"];

function addShelf() {
  try {
    const selectedShelf =
      availableShelfs[Math.floor(Math.random() * availableShelfs.length)];
    const shelfDiv = document.createElement("div");
    shelfDiv.classList.add("bigShelf");
    const booksContainer = document.createElement("div");
    booksContainer.classList.add("booksContainer");
    const shelfImg = document.createElement("img");
    shelfImg.id = items.shelfContainer.childNodes.length + 1;
    shelfImg.classList.add("shelf");
    shelfImg.src = selectedShelf;
    shelfDiv.appendChild(shelfImg);
    shelfDiv.appendChild(booksContainer);
    items.shelfContainer?.appendChild(shelfDiv);

    const shelf = {
      id: shelfImg.id,
      theme: "A",
      isFull: false,
      amount: 0,
      maxAmount: 0,
      link: selectedShelf,
    };
    updateApiData({ operation: "add", type: "shelfs", shelf: shelf });
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
}

function removeShelf(ev) {
  console.log("shelf removed");
}

const book = document.createElement("svg");
book.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="22px" height="120px" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">
<g><path style="opacity:0.987" fill="#7c8a63" d="M 0.5,-0.5 C 7.16667,-0.5 13.8333,-0.5 20.5,-0.5C 20.5,0.166667 20.8333,0.5 21.5,0.5C 21.5,6.16667 21.5,11.8333 21.5,17.5C 14.1667,17.5 6.83333,17.5 -0.5,17.5C -0.5,11.8333 -0.5,6.16667 -0.5,0.5C 0.166667,0.5 0.5,0.166667 0.5,-0.5 Z"/></g>
<g><path style="opacity:1" fill="#9ca789" d="M -0.5,17.5 C 6.83333,17.5 14.1667,17.5 21.5,17.5C 21.5,20.1667 21.5,22.8333 21.5,25.5C 14.1667,25.5 6.83333,25.5 -0.5,25.5C -0.5,22.8333 -0.5,20.1667 -0.5,17.5 Z"/></g>
<g><path style="opacity:0.991" fill="#7c8a63" d="M -0.5,25.5 C 6.83333,25.5 14.1667,25.5 21.5,25.5C 21.5,47.8333 21.5,70.1667 21.5,92.5C 14.1667,92.5 6.83333,92.5 -0.5,92.5C -0.5,70.1667 -0.5,47.8333 -0.5,25.5 Z"/></g>
<g><path style="opacity:1" fill="#9ba687" d="M -0.5,92.5 C 6.83333,92.5 14.1667,92.5 21.5,92.5C 21.5,95.5 21.5,98.5 21.5,101.5C 14.1667,101.5 6.83333,101.5 -0.5,101.5C -0.5,98.5 -0.5,95.5 -0.5,92.5 Z"/></g>
<g><path style="opacity:0.987" fill="#7b8962" d="M -0.5,101.5 C 6.83333,101.5 14.1667,101.5 21.5,101.5C 21.5,106.833 21.5,112.167 21.5,117.5C 20.2905,117.932 19.2905,118.599 18.5,119.5C 13.1667,119.5 7.83333,119.5 2.5,119.5C 1.70951,118.599 0.709515,117.932 -0.5,117.5C -0.5,112.167 -0.5,106.833 -0.5,101.5 Z"/></g>
</svg>`;

function addBook() {
  try {
    const bigShelf = items.shelfContainer.querySelector(".bigShelf").querySelector(".booksContainer").innerHTML += book.innerHTML;
    console.log(bigShelf)
    // items.shelfContainer[0].appendChild(book);
  } catch (error) {
    console.log(error);
    return false;
  }
  console.log("book added");
  return true;
}

function removeBook(ev) {
  console.log("book removed");
}

function updateApiData(obj) {
  try {
    if (obj.operation === "add") {
      widgetApiData[obj.type].push(obj.shelf);
    }
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
  // SE_API.store.set("beniartsTulipanGoalWidgetPreviousGained", widgetApiData);
}
