let mainObj = {};
type apiData = {
  maxShelfs: number;
  shelfs: Array<Shelf>;
  books: Array<Book>;
};

type Shelf = {
  id: number;
  color: string;
  isFull: boolean;
  amount: number;
  maxAmount: number;
};

type Book = {
  id: number;
  topColor?: string;
  bottomColor?: string;
  middleColor?: string;
  firstSeparatorColor?: string;
  secondSeparatorColor?: string;
  type: string;
  shelfId: number;
  decoration?: string;
  pageMarker: boolean;
};

let defaultApiData: apiData = {
  maxShelfs: 0,
  shelfs: [],
  books: [],
};

let widgetApiData: apiData = {
  maxShelfs: 0,
  shelfs: [],
  books: [],
};

window.addEventListener("onWidgetLoad", async function (obj) {
  let api = await getApiData(obj);
  init(obj, api, true);
});

window.addEventListener("onEventReceived", function (obj) {
  // possible events: addShelf, removeShelf, addBook, removeBook
  // when we receive an event to add a book, we check if the current shelf is full
  // if it is, we automatically add a new shelf and then add the book to it
  // if it isn't, we just add the book to the current shelf

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
