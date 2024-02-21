let mainObj = {};
let totalBooks = 0;
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

// function updateApiData(amountToUpdate) {
//   // SE_API.store.set("beniartsTulipanGoalWidgetPreviousGained", widgetApiData);
// }

function clearApiData() {
  // SE_API.store.set("beniartsTulipanGoalWidgetPreviousGained", defaultApiData);
  window.location.reload();
}

const availableShelfs = [
  "https://i.postimg.cc/W115Zsb3/balda-abajo1.png",
  "https://i.postimg.cc/85M4G5wy/balda-abajo2.png",
  "https://i.postimg.cc/gjKKwTC8/balda-abajo3.png",
  "https://i.postimg.cc/W1YX6xh7/balda-abajo4.png",
  "https://i.postimg.cc/jjGcBN6w/balda-abajo5.png",
  "https://i.postimg.cc/J08qzL2R/balda-arriba1.png",
  "https://i.postimg.cc/bN3Tp4Hj/balda-arriba2.png",
  "https://i.postimg.cc/SKXVZV9b/balda-arriba3.png",
  "https://i.postimg.cc/3rj1bkkN/balda-arriba4.png",
  "https://i.postimg.cc/wT62K9NV/balda-arriba5.png",
];

function addShelf() {
  console.log(widgetApiData);
  try {
    const selectedShelf =
      availableShelfs[Math.floor(Math.random() * availableShelfs.length)];
    const bigShelf = document.createElement("div");
    bigShelf.classList.add("bigShelf");
    bigShelf.id = items.shelfContainer.childNodes.length + 1;
    const booksContainer = document.createElement("div");
    booksContainer.classList.add("booksContainer");
    const shelfImg = document.createElement("img");
    shelfImg.id = items.shelfContainer.childNodes.length + 1;
    shelfImg.classList.add("shelf");
    shelfImg.src = selectedShelf;
    bigShelf.appendChild(shelfImg);
    bigShelf.appendChild(booksContainer);
    items.shelfContainer?.appendChild(bigShelf);

    const shelf = {
      id: shelfImg.id,
      theme: "A",
      isFull: isShelfFull(bigShelf),
      amount: 0,
      maxAmount: 0,
      link: selectedShelf,
    };
    updateApiData({ operation: "addShelf", type: "shelfs", shelf: shelf });
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
}

function removeShelf(ev) {
  console.log("shelf removed");
}

// const book = document.createElement("svg");
// book.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="22px" height="120px" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">
// <g><path style="opacity:0.987" fill="#7c8a63" d="M 0.5,-0.5 C 7.16667,-0.5 13.8333,-0.5 20.5,-0.5C 20.5,0.166667 20.8333,0.5 21.5,0.5C 21.5,6.16667 21.5,11.8333 21.5,17.5C 14.1667,17.5 6.83333,17.5 -0.5,17.5C -0.5,11.8333 -0.5,6.16667 -0.5,0.5C 0.166667,0.5 0.5,0.166667 0.5,-0.5 Z"/></g>
// <g><path style="opacity:1" fill="#9ca789" d="M -0.5,17.5 C 6.83333,17.5 14.1667,17.5 21.5,17.5C 21.5,20.1667 21.5,22.8333 21.5,25.5C 14.1667,25.5 6.83333,25.5 -0.5,25.5C -0.5,22.8333 -0.5,20.1667 -0.5,17.5 Z"/></g>
// <g><path style="opacity:0.991" fill="#7c8a63" d="M -0.5,25.5 C 6.83333,25.5 14.1667,25.5 21.5,25.5C 21.5,47.8333 21.5,70.1667 21.5,92.5C 14.1667,92.5 6.83333,92.5 -0.5,92.5C -0.5,70.1667 -0.5,47.8333 -0.5,25.5 Z"/></g>
// <g><path style="opacity:1" fill="#9ba687" d="M -0.5,92.5 C 6.83333,92.5 14.1667,92.5 21.5,92.5C 21.5,95.5 21.5,98.5 21.5,101.5C 14.1667,101.5 6.83333,101.5 -0.5,101.5C -0.5,98.5 -0.5,95.5 -0.5,92.5 Z"/></g>
// <g><path style="opacity:0.987" fill="#7b8962" d="M -0.5,101.5 C 6.83333,101.5 14.1667,101.5 21.5,101.5C 21.5,106.833 21.5,112.167 21.5,117.5C 20.2905,117.932 19.2905,118.599 18.5,119.5C 13.1667,119.5 7.83333,119.5 2.5,119.5C 1.70951,118.599 0.709515,117.932 -0.5,117.5C -0.5,112.167 -0.5,106.833 -0.5,101.5 Z"/></g>
// </svg>`;

function isShelfFull(shelf) {
  return shelf.querySelector(".booksContainer").childNodes.length === 12;
}

let shelfToFill;
function addBook() {
  let shelfs = items.shelfContainer.querySelectorAll(".bigShelf");
  if (shelfs.length === 0) {
    addShelf();
    shelfs = items.shelfContainer.querySelectorAll(".bigShelf");
  }
  for (let i = 0; i < shelfs.length; i++) {
    const shelf = shelfs[i];
    // 12 is the max amount of books a shelf can have for now
    if (shelf.querySelector(".booksContainer").childNodes.length < 12) {
      shelfToFill = shelf;
      break; // Sal del bucle tan pronto como encuentres el primer nodo que cumple la condición
    }
  }
  try {
    if (isShelfFull(shelfToFill)) {
      console.log(shelfToFill);
      addShelf();
      shelfs = items.shelfContainer.querySelectorAll(".bigShelf");
      shelfToFill = shelfs[shelfs.length - 1];
    }
    const book = document.createElement("svg");
    book.innerHTML = `<svg id=${++totalBooks} xmlns="http://www.w3.org/2000/svg" version="1.1" width="22px" height="120px" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g><path style="opacity:0.987" fill="#7c8a63" d="M 0.5,-0.5 C 7.16667,-0.5 13.8333,-0.5 20.5,-0.5C 20.5,0.166667 20.8333,0.5 21.5,0.5C 21.5,6.16667 21.5,11.8333 21.5,17.5C 14.1667,17.5 6.83333,17.5 -0.5,17.5C -0.5,11.8333 -0.5,6.16667 -0.5,0.5C 0.166667,0.5 0.5,0.166667 0.5,-0.5 Z"/></g>
    <g><path style="opacity:1" fill="#9ca789" d="M -0.5,17.5 C 6.83333,17.5 14.1667,17.5 21.5,17.5C 21.5,20.1667 21.5,22.8333 21.5,25.5C 14.1667,25.5 6.83333,25.5 -0.5,25.5C -0.5,22.8333 -0.5,20.1667 -0.5,17.5 Z"/></g>
    <g><path style="opacity:0.991" fill="#7c8a63" d="M -0.5,25.5 C 6.83333,25.5 14.1667,25.5 21.5,25.5C 21.5,47.8333 21.5,70.1667 21.5,92.5C 14.1667,92.5 6.83333,92.5 -0.5,92.5C -0.5,70.1667 -0.5,47.8333 -0.5,25.5 Z"/></g>
    <g><path style="opacity:1" fill="#9ba687" d="M -0.5,92.5 C 6.83333,92.5 14.1667,92.5 21.5,92.5C 21.5,95.5 21.5,98.5 21.5,101.5C 14.1667,101.5 6.83333,101.5 -0.5,101.5C -0.5,98.5 -0.5,95.5 -0.5,92.5 Z"/></g>
    <g><path style="opacity:0.987" fill="#7b8962" d="M -0.5,101.5 C 6.83333,101.5 14.1667,101.5 21.5,101.5C 21.5,106.833 21.5,112.167 21.5,117.5C 20.2905,117.932 19.2905,118.599 18.5,119.5C 13.1667,119.5 7.83333,119.5 2.5,119.5C 1.70951,118.599 0.709515,117.932 -0.5,117.5C -0.5,112.167 -0.5,106.833 -0.5,101.5 Z"/></g>
    </svg>`;
    // book.id = shelfToFill.querySelector(".booksContainer").childNodes.length;
    shelfToFill.querySelector(".booksContainer").innerHTML += book.innerHTML;

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
    const bookToSave = {
      id: totalBooks,
      topColor: "red",
      bottomColor: "blue",
      middleColor: "green",
      firstSeparatorColor: "yellow",
      secondSeparatorColor: "orange",
      type: "A",
      shelfId: shelfToFill.id,
      decoration: "none",
      pageMarker: true,
      link: book.innerHTML,
    };
    updateApiData({ operation: "addBook", type: "books", book: bookToSave });
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
  console.log(widgetApiData);
  try {
    if (obj.operation === "addShelf") {
      widgetApiData.shelfs.push(obj.shelf);
    }
    if (obj.operation === "addBook") {
      widgetApiData.books.push(obj.book);
      widgetApiData.shelfs.map((shelf) => {
        if (shelf.id === obj.book.shelfId) {
          shelf.amount += 1;
          shelf.isFull = shelf.amount === 12 ? true : false;
        }
      });
    }
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
  // SE_API.store.set("beniartsTulipanGoalWidgetPreviousGained", widgetApiData);
}

function initGoal() {
  // this function will be in charge of the initial widget creation
  // and also everytime the widget is reloaded
  // we will get the data from the api and then create the widget manually here to avoid issues (or maybe not)
  // we will have to take every shelf, create one shelf image for each shelf saved in the api
  // using the link for the image that the shelf has
  // then we will use the book info to generate the same books that the user had last time
  // this means displaying them in the same order (using the book id), in the same shelf (using the shelf id)
}
