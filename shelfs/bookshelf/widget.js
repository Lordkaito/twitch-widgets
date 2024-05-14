let mainObj = {};
let totalBooks = 0;
// let fieldData = {};
let button = document.querySelector('.addShelf');
button.addEventListener('click', () => {
  const shelfs = document.querySelectorAll('.shelf');
  addShelf(mainObj);
});

let addBookk = document.querySelector('.addBook');
addBookk.addEventListener('click', () => {
  addBook();
});

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

window.addEventListener('onWidgetLoad', async function (obj) {
  // let api = await getApiData(obj);
  // init(obj, api, true);
  console.log('obj on widget load', obj);
  init(obj);
  fieldData = obj.detail.fieldData;
  // renderInitialBooks(widgetApiData);
});

const allowedEvents = ['addShelf', 'removeShelf', 'addBook', 'removeBook'];

window.addEventListener('onEventReceived', function (obj) {
  console.log('obj', obj);
  if (obj.detail.event.value === 'reset') {
    console.log('clearing');
    clearApiData();
    return;
  }
  const shelfs = document.querySelectorAll('.shelf');
  // possible events: addShelf, removeShelf, addBook, removeBook
  // when we receive an event to add a book, we check if the current shelf is full
  // if it is, we automatically add a new shelf and then add the book to it
  // if it isn't, we just add the book to the current shelf
  const { event } = obj.detail;

  if (!allowedEvents.includes(event.field)) return;

  if (event.field === 'addShelf') {
    addShelf(1, true);
  }

  if (event.field === 'removeShelf') {
    removeShelf(obj);
  }

  if (event.field == 'addBook') {
    addBook(obj, fieldData, true);
  }

  if (event.field === 'removeBook') {
    removeBook(obj);
  }

  // not sure if the books are random or the user can specify which book to add
});

const getApiData = async (obj) => {
  let data = await SE_API.store.get('pruebadeapi');
  if (data === null) {
    widgetApiData = defaultApiData;
  } else {
    widgetApiData = data;
  }
  if (obj.detail.fieldData.goalFullType === 'session') {
    widgetApiData = defaultApiData;
  }
  // widgetApiData = defaultApiData;
  return widgetApiData;
};

const items = {
  main: document.getElementById('main'),
  shelfContainer: document.getElementById('shelfContainer'),
  shelfs: document.querySelectorAll('.shelf'),
  books: document.querySelectorAll('.book'),
};

async function init(obj) {
  console.log('obtaining api data');
  const apiData = await getApiData(obj);
  console.log('apiData obtained');
  console.log(apiData);
  apiData.shelfs.map((shelf) => {
    addShelf(1, false);
  });

  apiData.books.map((book) => {
    addBook(obj, fieldData, false, book.link);
  });
}

function clearApiData() {
  SE_API.store.set('pruebadeapi', defaultApiData);
  window.location.reload();
}

const availableShelfs = {
  1: {
    top: 'https://i.ibb.co/wchZ7nc/balda-arriba1.png',
    bottom: 'https://i.ibb.co/xCqtTLZ/balda-abajo1.png',
  },
  2: {
    top: 'https://i.ibb.co/w0WdynV/balda-arriba2.png',
    bottom: 'https://i.ibb.co/r0FwjHH/balda-abajo2.png',
  },
  3: {
    top: 'https://i.ibb.co/RyLK0ty/balda-arriba3.png',
    bottom: 'https://i.ibb.co/b2GcbKK/balda-abajo3.png',
  },
  4: {
    top: 'https://i.ibb.co/Ydxgkb4/balda-arriba4.png',
    bottom: 'https://i.ibb.co/GkSMB3F/balda-abajo4.png',
  },
};
// "https://i.ibb.co/xCqtTLZ/balda-abajo1.png",
// "https://i.ibb.co/r0FwjHH/balda-abajo2.png",
// "https://i.ibb.co/b2GcbKK/balda-abajo3.png",
// "https://i.ibb.co/GkSMB3F/balda-abajo4.png",
// "https://i.ibb.co/60jmB5Y/balda-abajo5.png",
// "https://i.ibb.co/wchZ7nc/balda-arriba1.png",
// "https://i.ibb.co/w0WdynV/balda-arriba2.png",
// "https://i.ibb.co/RyLK0ty/balda-arriba3.png",
// "https://i.ibb.co/Ydxgkb4/balda-arriba4.png",
// "https://i.ibb.co/ZHStcRd/balda-arriba5.png",

function getPreviousShelf() {
  const shelfs = document.querySelectorAll('.shelf');
}

function addShelf(shelfOption, updateApi) {
  shelfOption = 1;
  try {
    const lastBigShelf = document.querySelectorAll('.bigShelf');
    const lastShelf = lastBigShelf[lastBigShelf.length - 1];
    const shelfImg = document.createElement('img');
    let selectedShelf;

    if (
      lastShelf &&
      lastShelf.querySelector('.shelf').classList.contains('top')
    ) {
      selectedShelf = availableShelfs[shelfOption].bottom;
      const bigShelf = document.createElement('div');
      bigShelf.classList.add('bigShelf');
      bigShelf.id = items.shelfContainer.childNodes.length + 1;
      const booksContainer = document.createElement('div');
      booksContainer.classList.add('booksContainer');
      shelfImg.id = items.shelfContainer.childNodes.length + 1;
      shelfImg.classList.add('shelf');
      shelfImg.src = selectedShelf;
      shelfImg.classList.add('bottom');
      bigShelf.appendChild(shelfImg);
      bigShelf.appendChild(booksContainer);
      items.shelfContainer?.appendChild(bigShelf);
    } else {
      selectedShelf = availableShelfs[shelfOption].top;
      const bigShelf = document.createElement('div');
      bigShelf.classList.add('bigShelf');
      bigShelf.id = items.shelfContainer.childNodes.length + 1;
      const booksContainer = document.createElement('div');
      booksContainer.classList.add('booksContainer');
      shelfImg.id = items.shelfContainer.childNodes.length + 1;
      shelfImg.classList.add('shelf');
      shelfImg.src = selectedShelf;
      shelfImg.classList.add('top');
      bigShelf.appendChild(shelfImg);
      bigShelf.appendChild(booksContainer);
      items.shelfContainer?.appendChild(bigShelf);
    }

    if (updateApi) {
      const shelf = {
        id: shelfImg.id,
        theme: 'A',
        amount: 0,
        link: selectedShelf,
      };
      updateApiData({ operation: 'addShelf', type: 'shelfs', shelf: shelf });
    }
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
}

function removeShelf() {
  const shelfs = document.querySelectorAll('.shelf');
  const lastShelf = shelfs[shelfs.length - 1];
  if (lastShelf) {
    lastShelf.remove();
    updateApiData({
      operation: 'removeShelf',
      type: 'shelfs',
      shelfId: lastShelf.id,
    });
  }
  console.log('shelf removed');
}

function isShelfFull(shelf) {
  if (
    shelf
      .querySelector('.booksContainer')
      .querySelector('.horizontal-container') != null
  ) {
    return (
      shelf.querySelector('.booksContainer').childNodes.length +
        shelf
          .querySelector('.booksContainer')
          .querySelector('.horizontal-container').childNodes.length ===
      13
    );
  } else {
    return shelf.querySelector('.booksContainer').childNodes.length === 12;
  }
}

function twelveOrLessBooks(shelf) {
  const mainShelf = shelf.querySelector('.booksContainer');
  const horizontalShelf = shelf
    .querySelector('.booksContainer')
    .querySelector('.horizontal-container');
  return (
    mainShelf.childNodes.length + (horizontalShelf?.childNodes.length ?? 0) <=
    12
  );
}

function customOrder(totalLength, book, positionSpan, horizontal, vertical) {
      console.log("Total Length: "+ totalLength);
      if(totalLength > positionSpan - 1 && totalLength <= positionSpan + 4) {
        book.innerHTML += horizontal[Math.floor(Math.random() * 4)];
      } else {
        book.innerHTML += vertical[Math.floor(Math.random() * 8)];
      }
}

let appendToNewDiv = false;
function appendToSpan(totalLength, shelfToFill, book, link, startPosition) {
  let newDiv;
  if (totalLength === startPosition) {
    appendToNewDiv = true;
    newDiv = document.createElement('span');
    newDiv.classList.add('horizontal-container');
    shelfToFill.querySelector('.booksContainer').appendChild(newDiv);
  }

  if (totalLength >= startPosition + 5) {
    appendToNewDiv = false;
  }

  if (appendToNewDiv) {
    shelfToFill
      .querySelector('.booksContainer')
      .querySelector('.horizontal-container').innerHTML +=
      link ?? book.innerHTML;
  } else {
    shelfToFill.querySelector('.booksContainer').innerHTML +=
      link ?? book.innerHTML;
  }
}

let shelfToFill;
function addBook(
  obj,
  fieldData = {
    bookColor: '#000000',
    firstSeparatorColor: 'red',
    secondSeparatorColor: 'blue',
    decoration: 'none',
    pageMarker: false,
  },
  updateApi,
  link = null,
) {
  const bookId = ++totalBooks;
  const availableBooks = [
    `<svg xmlns="http://www.w3.org/2000/svg" class="book" id="book-${bookId}" version="1.1" width="22px" height="120px" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path style="opacity:0.987" fill="${fieldData.bookColor}" d="M 0.5,-0.5 C 7.16667,-0.5 13.8333,-0.5 20.5,-0.5C 20.5,0.166667 20.8333,0.5 21.5,0.5C 21.5,6.16667 21.5,11.8333 21.5,17.5C 14.1667,17.5 6.83333,17.5 -0.5,17.5C -0.5,11.8333 -0.5,6.16667 -0.5,0.5C 0.166667,0.5 0.5,0.166667 0.5,-0.5 Z" /></g><g><path style="opacity:1" fill="${fieldData.firstSeparatorColor}" d="M -0.5,17.5 C 6.83333,17.5 14.1667,17.5 21.5,17.5C 21.5,20.1667 21.5,22.8333 21.5,25.5C 14.1667,25.5 6.83333,25.5 -0.5,25.5C -0.5,22.8333 -0.5,20.1667 -0.5,17.5 Z" /></g><g><path style="opacity:0.991" fill="${fieldData.bookColor}" d="M -0.5,25.5 C 6.83333,25.5 14.1667,25.5 21.5,25.5C 21.5,47.8333 21.5,70.1667 21.5,92.5C 14.1667,92.5 6.83333,92.5 -0.5,92.5C -0.5,70.1667 -0.5,47.8333 -0.5,25.5 Z" /></g><g><path style="opacity:1" fill="${fieldData.secondSeparatorColor}" d="M -0.5,92.5 C 6.83333,92.5 14.1667,92.5 21.5,92.5C 21.5,95.5 21.5,98.5 21.5,101.5C 14.1667,101.5 6.83333,101.5 -0.5,101.5C -0.5,98.5 -0.5,95.5 -0.5,92.5 Z" /></g><g><path style="opacity:0.987" fill="${fieldData.bookColor}" d="M -0.5,101.5 C 6.83333,101.5 14.1667,101.5 21.5,101.5C 21.5,106.833 21.5,112.167 21.5,117.5C 20.2905,117.932 19.2905,118.599 18.5,119.5C 13.1667,119.5 7.83333,119.5 2.5,119.5C 1.70951,118.599 0.709515,117.932 -0.5,117.5C -0.5,112.167 -0.5,106.833 -0.5,101.5 Z" /></g></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" class="book" id="book-${bookId}" version="1.1" width="61px" height="121px" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
      <path style="opacity:0.868" fill="${fieldData.bookColor}" d="M 18.5,-0.5 C 18.8333,-0.5 19.1667,-0.5 19.5,-0.5C 22.9708,4.21433 25.3041,9.54766 26.5,15.5C 25.3947,17.2231 23.7281,18.2231 21.5,18.5C 19.6203,18.2291 18.287,18.8958 17.5,20.5C 16.1266,20.3433 14.7932,20.51 13.5,21C 10.5883,22.232 7.92158,23.732 5.5,25.5C 3.5,21.1667 1.5,16.8333 -0.5,12.5C -0.5,11.8333 -0.5,11.1667 -0.5,10.5C 0.374833,8.43191 1.5415,6.43191 3,4.5C 3.33333,4.83333 3.66667,5.16667 4,5.5C 6.4622,4.35023 8.79554,3.01689 11,1.5C 12.6667,1.5 14.3333,1.5 16,1.5C 16.9947,0.934056 17.828,0.267389 18.5,-0.5 Z"/>
    </g>
    <g>
      <path style="opacity:0.966" fill="${fieldData.firstSeparatorColor}" d="M 26.5,15.5 C 27.9538,16.5203 28.2871,17.687 27.5,19C 28.8613,20.5843 29.528,22.4176 29.5,24.5C 28.1667,25.1667 26.8333,25.8333 25.5,26.5C 22.6027,27.129 19.936,28.129 17.5,29.5C 14.0567,30.0592 11.0567,31.3926 8.5,33.5C 6.98023,31.1098 5.98023,28.4432 5.5,25.5C 7.92158,23.732 10.5883,22.232 13.5,21C 14.7932,20.51 16.1266,20.3433 17.5,20.5C 19.153,20.3404 20.4863,19.6737 21.5,18.5C 23.7281,18.2231 25.3947,17.2231 26.5,15.5 Z"/>
    </g>
    <g>
      <path style="opacity:1" fill="${fieldData.firstSeparatorColor}" d="M 21.5,18.5 C 20.4863,19.6737 19.153,20.3404 17.5,20.5C 18.287,18.8958 19.6203,18.2291 21.5,18.5 Z"/>
    </g>
    <g>
      <path style="opacity:0.909" fill="${fieldData.bookColor}" d="M 29.5,24.5 C 37.5564,45.2037 44.8897,65.8704 51.5,86.5C 50.3406,88.2503 48.674,89.2503 46.5,89.5C 41.071,90.7468 36.071,92.7468 31.5,95.5C 30.8333,95.5 30.5,95.8333 30.5,96.5C 27.4742,87.9304 24.1409,79.4304 20.5,71C 20.8333,70.6667 21.1667,70.3333 21.5,70C 19.9831,67.7955 18.6498,65.4622 17.5,63C 17.5,61.6667 17.5,60.3333 17.5,59C 15.5776,57.54 14.9109,55.8733 15.5,54C 12.4784,47.4359 10.145,40.6026 8.5,33.5C 11.9466,32.917 14.9466,31.5837 17.5,29.5C 20.716,29.6545 23.3826,28.6545 25.5,26.5C 26.8333,25.8333 28.1667,25.1667 29.5,24.5 Z"/>
    </g>
    <g>
      <path style="opacity:1" fill="${fieldData.bookColor}" d="M 25.5,26.5 C 23.3826,28.6545 20.716,29.6545 17.5,29.5C 19.936,28.129 22.6027,27.129 25.5,26.5 Z"/>
    </g>
    <g>
      <path style="opacity:1" fill="${fieldData.secondSeparatorColor}" d="M 17.5,29.5 C 14.9466,31.5837 11.9466,32.917 8.5,33.5C 11.0567,31.3926 14.0567,30.0592 17.5,29.5 Z"/>
    </g>
    <g>
      <path style="opacity:0.96" fill="${fieldData.secondSeparatorColor}" d="M 51.5,86.5 C 53.2671,88.7916 54.2671,91.4582 54.5,94.5C 48.2433,97.9848 41.5766,100.818 34.5,103C 33.7476,103.671 33.4142,104.504 33.5,105.5C 32.2655,102.67 31.2655,99.6702 30.5,96.5C 30.5,95.8333 30.8333,95.5 31.5,95.5C 36.929,94.2532 41.929,92.2532 46.5,89.5C 48.674,89.2503 50.3406,88.2503 51.5,86.5 Z"/>
    </g>
    <g>
      <path style="opacity:1" fill="${fieldData.secondSeparatorColor}" d="M 46.5,89.5 C 41.929,92.2532 36.929,94.2532 31.5,95.5C 36.071,92.7468 41.071,90.7468 46.5,89.5 Z"/>
    </g>
    <g>
      <path style="opacity:0.886" fill="${fieldData.bookColor}" d="M 54.5,94.5 C 55.731,99.1953 57.731,103.529 60.5,107.5C 60.5,108.5 60.5,109.5 60.5,110.5C 59.7811,112.091 58.7811,113.591 57.5,115C 52.9435,116.419 48.2769,118.253 43.5,120.5C 42.5,120.5 41.5,120.5 40.5,120.5C 40.6106,118.352 39.944,118.019 38.5,119.5C 36.8316,114.831 35.1649,110.164 33.5,105.5C 33.4142,104.504 33.7476,103.671 34.5,103C 41.5766,100.818 48.2433,97.9848 54.5,94.5 Z"/>
    </g>
    </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" class="book" id="book-${bookId}" version="1.1" width="31px" height="120px"
    style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
      <path style="opacity:0.977" fill="${fieldData.bookColor}"
        d="M 0.5,-0.5 C 10.1667,-0.5 19.8333,-0.5 29.5,-0.5C 29.5,0.166667 29.8333,0.5 30.5,0.5C 30.5,5.83333 30.5,11.1667 30.5,16.5C 20.1667,16.5 9.83333,16.5 -0.5,16.5C -0.5,11.5 -0.5,6.5 -0.5,1.5C 0.338246,1.15829 0.67158,0.491622 0.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:0.984" fill="${fieldData.firstSeparatorColor}"
        d="M -0.5,16.5 C 9.83333,16.5 20.1667,16.5 30.5,16.5C 30.5,18.1667 30.5,19.8333 30.5,21.5C 20.1667,21.5 9.83333,21.5 -0.5,21.5C -0.5,19.8333 -0.5,18.1667 -0.5,16.5 Z" />
    </g>
    <g>
      <path style="opacity:0.984" fill="${fieldData.bookColor}"
        d="M -0.5,21.5 C 9.83333,21.5 20.1667,21.5 30.5,21.5C 30.5,46.5 30.5,71.5 30.5,96.5C 20.1667,96.5 9.83333,96.5 -0.5,96.5C -0.5,71.5 -0.5,46.5 -0.5,21.5 Z" />
    </g>
    <g>
      <path style="opacity:0.984" fill="${fieldData.secondSeparatorColor}"
        d="M -0.5,96.5 C 9.83333,96.5 20.1667,96.5 30.5,96.5C 30.5,97.8333 30.5,99.1667 30.5,100.5C 20.1667,100.5 9.83333,100.5 -0.5,100.5C -0.5,99.1667 -0.5,97.8333 -0.5,96.5 Z" />
    </g>
    <g>
      <path style="opacity:0.978" fill="${fieldData.bookColor}"
        d="M -0.5,100.5 C 9.83333,100.5 20.1667,100.5 30.5,100.5C 30.5,106.167 30.5,111.833 30.5,117.5C 29.6618,117.842 29.3284,118.508 29.5,119.5C 20.1667,119.5 10.8333,119.5 1.5,119.5C 1.57298,117.973 0.906316,116.973 -0.5,116.5C -0.5,111.167 -0.5,105.833 -0.5,100.5 Z" />
    </g>
  </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" class="book" id="book-${bookId}" version="1.1" width="31px" height="120px"
    style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
      <path style="opacity:0.981" fill="${fieldData.bookColor}"
        d="M 0.5,-0.5 C 10.5,-0.5 20.5,-0.5 30.5,-0.5C 30.5,3.5 30.5,7.5 30.5,11.5C 20.1667,11.5 9.83333,11.5 -0.5,11.5C -0.5,7.83333 -0.5,4.16667 -0.5,0.5C 0.166667,0.5 0.5,0.166667 0.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:0.984" fill="${fieldData.firstSeparatorColor}"
        d="M -0.5,11.5 C 9.83333,11.5 20.1667,11.5 30.5,11.5C 30.5,14.5 30.5,17.5 30.5,20.5C 20.1667,20.5 9.83333,20.5 -0.5,20.5C -0.5,17.5 -0.5,14.5 -0.5,11.5 Z" />
    </g>
    <g>
      <path style="opacity:0.983" fill="${fieldData.bookColor}"
        d="M -0.5,20.5 C 9.83333,20.5 20.1667,20.5 30.5,20.5C 30.5,45.5 30.5,70.5 30.5,95.5C 20.1667,95.5 9.83333,95.5 -0.5,95.5C -0.5,70.5 -0.5,45.5 -0.5,20.5 Z" />
    </g>
    <g>
      <path style="opacity:0.984" fill="${fieldData.secondSeparatorColor}"
        d="M -0.5,95.5 C 9.83333,95.5 20.1667,95.5 30.5,95.5C 30.5,98.5 30.5,101.5 30.5,104.5C 20.1667,104.5 9.83333,104.5 -0.5,104.5C -0.5,101.5 -0.5,98.5 -0.5,95.5 Z" />
    </g>
    <g>
      <path style="opacity:0.888" fill="${fieldData.bookColor}"
        d="M -0.5,104.5 C 9.83333,104.5 20.1667,104.5 30.5,104.5C 30.5,108.5 30.5,112.5 30.5,116.5C 29.0937,116.973 28.427,117.973 28.5,119.5C 19.8333,119.5 11.1667,119.5 2.5,119.5C 2.18982,117.856 1.18982,116.856 -0.5,116.5C -0.5,112.5 -0.5,108.5 -0.5,104.5 Z" />
    </g>
  </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" class="book" id="book-${bookId}" version="1.1" width="31px" height="120px"
    style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
      <path style="opacity:0.977" fill="${fieldData.bookColor}"
        d="M 0.5,-0.5 C 10.1667,-0.5 19.8333,-0.5 29.5,-0.5C 29.5,0.166667 29.8333,0.5 30.5,0.5C 30.5,5.83333 30.5,11.1667 30.5,16.5C 20.1667,16.5 9.83333,16.5 -0.5,16.5C -0.5,11.5 -0.5,6.5 -0.5,1.5C 0.338246,1.15829 0.67158,0.491622 0.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:0.984" fill="${fieldData.firstSeparatorColor}"
        d="M -0.5,16.5 C 9.83333,16.5 20.1667,16.5 30.5,16.5C 30.5,18.1667 30.5,19.8333 30.5,21.5C 20.1667,21.5 9.83333,21.5 -0.5,21.5C -0.5,19.8333 -0.5,18.1667 -0.5,16.5 Z" />
    </g>
    <g>
      <path style="opacity:0.984" fill="${fieldData.bookColor}"
        d="M -0.5,21.5 C 9.83333,21.5 20.1667,21.5 30.5,21.5C 30.5,46.5 30.5,71.5 30.5,96.5C 20.1667,96.5 9.83333,96.5 -0.5,96.5C -0.5,71.5 -0.5,46.5 -0.5,21.5 Z" />
    </g>
    <g>
      <path style="opacity:0.983" fill="${fieldData.secondSeparatorColor}"
        d="M -0.5,96.5 C 9.83333,96.5 20.1667,96.5 30.5,96.5C 30.5,97.8333 30.5,99.1667 30.5,100.5C 20.1667,100.5 9.83333,100.5 -0.5,100.5C -0.5,99.1667 -0.5,97.8333 -0.5,96.5 Z" />
    </g>
    <g>
      <path style="opacity:0.975" fill="${fieldData.bookColor}"
        d="M -0.5,100.5 C 9.83333,100.5 20.1667,100.5 30.5,100.5C 30.5,106.167 30.5,111.833 30.5,117.5C 29.6618,117.842 29.3284,118.508 29.5,119.5C 20.1667,119.5 10.8333,119.5 1.5,119.5C 1.57298,117.973 0.906316,116.973 -0.5,116.5C -0.5,111.167 -0.5,105.833 -0.5,100.5 Z" />
    </g>
  </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" class="book" id="book-${bookId}" version="1.1" width="31px" height="120px"
    style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
      <path style="opacity:0.977" fill="${fieldData.bookColor}"
        d="M 0.5,-0.5 C 10.1667,-0.5 19.8333,-0.5 29.5,-0.5C 29.5,0.166667 29.8333,0.5 30.5,0.5C 30.5,5.83333 30.5,11.1667 30.5,16.5C 20.1667,16.5 9.83333,16.5 -0.5,16.5C -0.5,11.5 -0.5,6.5 -0.5,1.5C 0.338246,1.15829 0.67158,0.491622 0.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:0.983" fill="${fieldData.firstSeparatorColor}"
        d="M -0.5,16.5 C 9.83333,16.5 20.1667,16.5 30.5,16.5C 30.5,18.1667 30.5,19.8333 30.5,21.5C 20.1667,21.5 9.83333,21.5 -0.5,21.5C -0.5,19.8333 -0.5,18.1667 -0.5,16.5 Z" />
    </g>
    <g>
      <path style="opacity:0.984" fill="${fieldData.bookColor}"
        d="M -0.5,21.5 C 9.83333,21.5 20.1667,21.5 30.5,21.5C 30.5,46.5 30.5,71.5 30.5,96.5C 20.1667,96.5 9.83333,96.5 -0.5,96.5C -0.5,71.5 -0.5,46.5 -0.5,21.5 Z" />
    </g>
    <g>
      <path style="opacity:0.983" fill="${fieldData.secondSeparatorColor}"
        d="M -0.5,96.5 C 9.83333,96.5 20.1667,96.5 30.5,96.5C 30.5,97.8333 30.5,99.1667 30.5,100.5C 20.1667,100.5 9.83333,100.5 -0.5,100.5C -0.5,99.1667 -0.5,97.8333 -0.5,96.5 Z" />
    </g>
    <g>
      <path style="opacity:0.978" fill="${fieldData.bookColor}"
        d="M -0.5,100.5 C 9.83333,100.5 20.1667,100.5 30.5,100.5C 30.5,106.167 30.5,111.833 30.5,117.5C 29.6618,117.842 29.3284,118.508 29.5,119.5C 20.1667,119.5 10.8333,119.5 1.5,119.5C 1.57298,117.973 0.906316,116.973 -0.5,116.5C -0.5,111.167 -0.5,105.833 -0.5,100.5 Z" />
    </g>
  </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" class="book" id="book-${bookId}" version="1.1" width="120px" height="22px"
    style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
      <path style="opacity:0.987" fill="${fieldData.bookColor}"
        d="M 0.5,-0.5 C 6.16667,-0.5 11.8333,-0.5 17.5,-0.5C 17.5,6.83333 17.5,14.1667 17.5,21.5C 11.8333,21.5 6.16667,21.5 0.5,21.5C 0.5,20.8333 0.166667,20.5 -0.5,20.5C -0.5,13.8333 -0.5,7.16667 -0.5,0.5C 0.166667,0.5 0.5,0.166667 0.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:0.991" fill="${fieldData.bookColor}"
        d="M 25.5,-0.5 C 47.8333,-0.5 70.1667,-0.5 92.5,-0.5C 92.5,6.83333 92.5,14.1667 92.5,21.5C 70.1667,21.5 47.8333,21.5 25.5,21.5C 25.5,14.1667 25.5,6.83333 25.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:0.987" fill="${fieldData.bookColor}"
        d="M 101.5,-0.5 C 106.833,-0.5 112.167,-0.5 117.5,-0.5C 117.932,0.709515 118.599,1.70951 119.5,2.5C 119.5,7.83333 119.5,13.1667 119.5,18.5C 118.599,19.2905 117.932,20.2905 117.5,21.5C 112.167,21.5 106.833,21.5 101.5,21.5C 101.5,14.1667 101.5,6.83333 101.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:1" fill="${fieldData.firstSeparatorColor}"
        d="M 17.5,-0.5 C 20.1667,-0.5 22.8333,-0.5 25.5,-0.5C 25.5,6.83333 25.5,14.1667 25.5,21.5C 22.8333,21.5 20.1667,21.5 17.5,21.5C 17.5,14.1667 17.5,6.83333 17.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:1" fill="${fieldData.secondSeparatorColor}"
        d="M 92.5,-0.5 C 95.5,-0.5 98.5,-0.5 101.5,-0.5C 101.5,6.83333 101.5,14.1667 101.5,21.5C 98.5,21.5 95.5,21.5 92.5,21.5C 92.5,14.1667 92.5,6.83333 92.5,-0.5 Z" />
    </g>
  </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" class="book" id="book-${bookId}" version="1.1" width="115px" height="39px"
    style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
      <path style="opacity:0.984" fill="${fieldData.bookColor}"
        d="M 11.5,-0.5 C 45.5,-0.5 79.5,-0.5 113.5,-0.5C 113.5,0.166667 113.833,0.5 114.5,0.5C 114.5,2.5 114.5,4.5 114.5,6.5C 113.292,7.23411 111.959,7.56745 110.5,7.5C 78.8316,7.33335 47.1649,7.50002 15.5,8C 8.57706,11.7413 6.74373,17.2413 10,24.5C 11.5429,26.3783 13.3762,27.8783 15.5,29C 47.1649,29.5 78.8316,29.6666 110.5,29.5C 112.062,29.7329 113.395,30.3995 114.5,31.5C 114.5,33.1667 114.5,34.8333 114.5,36.5C 113.662,36.8417 113.328,37.5084 113.5,38.5C 79.8333,38.5 46.1667,38.5 12.5,38.5C 10.2314,37.0242 7.89805,35.5242 5.5,34C 3.24806,31.2639 1.24806,28.4305 -0.5,25.5C -0.5,21.1667 -0.5,16.8333 -0.5,12.5C 1.90887,6.67055 5.90887,2.33722 11.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:0.993" fill="#ffe6de"
        d="M 110.5,7.5 C 110.5,14.8333 110.5,22.1667 110.5,29.5C 78.8316,29.6666 47.1649,29.5 15.5,29C 13.3762,27.8783 11.5429,26.3783 10,24.5C 6.74373,17.2413 8.57706,11.7413 15.5,8C 47.1649,7.50002 78.8316,7.33335 110.5,7.5 Z" />
    </g>
  </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" class="book" id="book-${bookId}" version="1.1" width="120px" height="31px"
    style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
      <path style="opacity:0.951" fill="${fieldData.bookColor}"
        d="M 1.5,-0.5 C 6.83333,-0.5 12.1667,-0.5 17.5,-0.5C 17.5,9.83333 17.5,20.1667 17.5,30.5C 12.1667,30.5 6.83333,30.5 1.5,30.5C 1.06795,29.2905 0.40128,28.2905 -0.5,27.5C -0.5,19.1667 -0.5,10.8333 -0.5,2.5C 0.40128,1.70951 1.06795,0.709515 1.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:1" fill="${fieldData.firstSeparatorColor}"
        d="M 17.5,-0.5 C 19.1667,-0.5 20.8333,-0.5 22.5,-0.5C 22.5,9.83333 22.5,20.1667 22.5,30.5C 20.8333,30.5 19.1667,30.5 17.5,30.5C 17.5,20.1667 17.5,9.83333 17.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:0.996" fill="${fieldData.bookColor}"
        d="M 22.5,-0.5 C 47.5,-0.5 72.5,-0.5 97.5,-0.5C 97.5,9.83333 97.5,20.1667 97.5,30.5C 72.5,30.5 47.5,30.5 22.5,30.5C 22.5,20.1667 22.5,9.83333 22.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:1" fill="${fieldData.secondSeparatorColor}"
        d="M 97.5,-0.5 C 98.8333,-0.5 100.167,-0.5 101.5,-0.5C 101.5,9.83333 101.5,20.1667 101.5,30.5C 100.167,30.5 98.8333,30.5 97.5,30.5C 97.5,20.1667 97.5,9.83333 97.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:0.987" fill="${fieldData.bookColor}"
        d="M 101.5,-0.5 C 107.167,-0.5 112.833,-0.5 118.5,-0.5C 118.5,0.166667 118.833,0.5 119.5,0.5C 119.5,10.1667 119.5,19.8333 119.5,29.5C 118.833,29.5 118.5,29.8333 118.5,30.5C 112.833,30.5 107.167,30.5 101.5,30.5C 101.5,20.1667 101.5,9.83333 101.5,-0.5 Z" />
    </g>
  </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" class="book" id="book-${bookId}" version="1.1" width="120px" height="31px"
    style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
      <path style="opacity:0.983" fill="${fieldData.bookColor}"
        d="M 0.5,-0.5 C 4.5,-0.5 8.5,-0.5 12.5,-0.5C 12.5,9.83333 12.5,20.1667 12.5,30.5C 8.5,30.5 4.5,30.5 0.5,30.5C 0.5,29.8333 0.166667,29.5 -0.5,29.5C -0.5,19.8333 -0.5,10.1667 -0.5,0.5C 0.166667,0.5 0.5,0.166667 0.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:1" fill="${fieldData.firstSeparatorColor}"
        d="M 12.5,-0.5 C 15.5,-0.5 18.5,-0.5 21.5,-0.5C 21.5,9.83333 21.5,20.1667 21.5,30.5C 18.5,30.5 15.5,30.5 12.5,30.5C 12.5,20.1667 12.5,9.83333 12.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:0.994" fill="${fieldData.bookColor}"
        d="M 21.5,-0.5 C 46.5,-0.5 71.5,-0.5 96.5,-0.5C 96.5,9.83333 96.5,20.1667 96.5,30.5C 71.5,30.5 46.5,30.5 21.5,30.5C 21.5,20.1667 21.5,9.83333 21.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:1" fill="${fieldData.firstSeparatorColor}"
        d="M 96.5,-0.5 C 99.5,-0.5 102.5,-0.5 105.5,-0.5C 105.5,9.83333 105.5,20.1667 105.5,30.5C 102.5,30.5 99.5,30.5 96.5,30.5C 96.5,20.1667 96.5,9.83333 96.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:0.937" fill="${fieldData.bookColor}"
        d="M 105.5,-0.5 C 109.5,-0.5 113.5,-0.5 117.5,-0.5C 117.932,0.709515 118.599,1.70951 119.5,2.5C 119.5,10.8333 119.5,19.1667 119.5,27.5C 118.599,28.2905 117.932,29.2905 117.5,30.5C 113.5,30.5 109.5,30.5 105.5,30.5C 105.5,20.1667 105.5,9.83333 105.5,-0.5 Z" />
    </g>
  </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" class="book" id="book-${bookId}" version="1.1" width="31px" height="120px"
    style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
      <path style="opacity:0.981" fill="${fieldData.bookColor}"
        d="M 0.5,-0.5 C 10.5,-0.5 20.5,-0.5 30.5,-0.5C 30.5,3.5 30.5,7.5 30.5,11.5C 20.1667,11.5 9.83333,11.5 -0.5,11.5C -0.5,7.83333 -0.5,4.16667 -0.5,0.5C 0.166667,0.5 0.5,0.166667 0.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:0.984" fill="${fieldData.firstSeparatorColor}"
        d="M -0.5,11.5 C 9.83333,11.5 20.1667,11.5 30.5,11.5C 30.5,14.5 30.5,17.5 30.5,20.5C 20.1667,20.5 9.83333,20.5 -0.5,20.5C -0.5,17.5 -0.5,14.5 -0.5,11.5 Z" />
    </g>
    <g>
      <path style="opacity:0.983" fill="${fieldData.bookColor}"
        d="M -0.5,20.5 C 9.83333,20.5 20.1667,20.5 30.5,20.5C 30.5,45.5 30.5,70.5 30.5,95.5C 20.1667,95.5 9.83333,95.5 -0.5,95.5C -0.5,70.5 -0.5,45.5 -0.5,20.5 Z" />
    </g>
    <g>
      <path style="opacity:0.984" fill="${fieldData.firstSeparatorColor}"
        d="M -0.5,95.5 C 9.83333,95.5 20.1667,95.5 30.5,95.5C 30.5,98.5 30.5,101.5 30.5,104.5C 20.1667,104.5 9.83333,104.5 -0.5,104.5C -0.5,101.5 -0.5,98.5 -0.5,95.5 Z" />
    </g>
    <g>
      <path style="opacity:0.888" fill="${fieldData.bookColor}"
        d="M -0.5,104.5 C 9.83333,104.5 20.1667,104.5 30.5,104.5C 30.5,108.5 30.5,112.5 30.5,116.5C 29.0937,116.973 28.427,117.973 28.5,119.5C 19.8333,119.5 11.1667,119.5 2.5,119.5C 2.18982,117.856 1.18982,116.856 -0.5,116.5C -0.5,112.5 -0.5,108.5 -0.5,104.5 Z" />
    </g>
  </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" class="book" id="book-${bookId}" version="1.1" width="31px" height="120px"
    style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
      <path style="opacity:0.981" fill="${fieldData.bookColor}"
        d="M 0.5,-0.5 C 10.5,-0.5 20.5,-0.5 30.5,-0.5C 30.5,3.5 30.5,7.5 30.5,11.5C 20.1667,11.5 9.83333,11.5 -0.5,11.5C -0.5,7.83333 -0.5,4.16667 -0.5,0.5C 0.166667,0.5 0.5,0.166667 0.5,-0.5 Z" />
    </g>
    <g>
      <path style="opacity:0.984" fill="${fieldData.firstSeparatorColor}"
        d="M -0.5,11.5 C 9.83333,11.5 20.1667,11.5 30.5,11.5C 30.5,14.5 30.5,17.5 30.5,20.5C 20.1667,20.5 9.83333,20.5 -0.5,20.5C -0.5,17.5 -0.5,14.5 -0.5,11.5 Z" />
    </g>
    <g>
      <path style="opacity:0.983" fill="${fieldData.bookColor}"
        d="M -0.5,20.5 C 9.83333,20.5 20.1667,20.5 30.5,20.5C 30.5,45.5 30.5,70.5 30.5,95.5C 20.1667,95.5 9.83333,95.5 -0.5,95.5C -0.5,70.5 -0.5,45.5 -0.5,20.5 Z" />
    </g>
    <g>
      <path style="opacity:0.984" fill="${fieldData.firstSeparatorColor}"
        d="M -0.5,95.5 C 9.83333,95.5 20.1667,95.5 30.5,95.5C 30.5,98.5 30.5,101.5 30.5,104.5C 20.1667,104.5 9.83333,104.5 -0.5,104.5C -0.5,101.5 -0.5,98.5 -0.5,95.5 Z" />
    </g>
    <g>
      <path style="opacity:0.895" fill="${fieldData.bookColor}"
        d="M -0.5,104.5 C 9.83333,104.5 20.1667,104.5 30.5,104.5C 30.5,108.5 30.5,112.5 30.5,116.5C 29.0937,116.973 28.427,117.973 28.5,119.5C 19.8333,119.5 11.1667,119.5 2.5,119.5C 2.18982,117.856 1.18982,116.856 -0.5,116.5C -0.5,112.5 -0.5,108.5 -0.5,104.5 Z" />
    </g>
  </svg>`,
  ];
  let shelfs = items.shelfContainer.querySelectorAll('.bigShelf');
  if (shelfs.length === 0) {
    addShelf();
    shelfs = items.shelfContainer.querySelectorAll('.bigShelf');
  }
  for (let i = 0; i < shelfs.length; i++) {
    const shelf = shelfs[i];
    // 12 is the max amount of books a shelf can have for now
    if (!isShelfFull(shelf)) {
      shelfToFill = shelf;
      break; // Sal del bucle tan pronto como encuentres el primer nodo que cumple la condición
    }
  }
  try {
    if (isShelfFull(shelfToFill)) {
      addShelf();
      shelfs = items.shelfContainer.querySelectorAll('.bigShelf');
      shelfToFill = shelfs[shelfs.length - 1];
    }
    let currentLength =
      shelfToFill.querySelector('.booksContainer').childNodes.length;
    let newDivCurrentLength =
      shelfToFill
        .querySelector('.booksContainer')
        .querySelector('.horizontal-container')?.childNodes.length ?? 0;

    let totalLength = currentLength + newDivCurrentLength;
    const book = document.createElement('svg');
    if (parseInt(shelfToFill.id) % 2 === 1) {
      const bookToAdd = totalLength >= 8 ? totalLength - 1 : totalLength;
      book.innerHTML = availableBooks[bookToAdd];
      appendToSpan(totalLength, shelfToFill, book, link, 6);
    } else {
      let horizontal = [],
          vertical = [];
      for(let i = 0; i < availableBooks.length; i++){
        if(i < 10 && i > 5) {
          horizontal.push(availableBooks[i]);
        } else {
          vertical. push(availableBooks[i]);
        }
      }
      customOrder(totalLength,  book, 3, horizontal, vertical);
      appendToSpan(totalLength, shelfToFill, book, link, 3)
    }
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
    if (updateApi) {
      const bookToSave = {
        id: bookId,
        bookColor: fieldData.bookColor,
        firstSeparatorColor: fieldData.firstSeparatorColor,
        secondSeparatorColor: fieldData.secondSeparatorColor,
        shelfId: Number(shelfToFill.id),
        decoration: fieldData.decoration,
        pageMarker: fieldData.pageMarker,
        link: book.innerHTML,
      };
      updateApiData({ operation: 'addBook', type: 'books', book: bookToSave });
    }
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}

function removeBook() {
  const books = document.querySelectorAll('.book');
  const book = books[books.length - 1];
  if (book) {
    console.log(book.parentElement.parentElement.id);
    updateApiData({
      operation: 'removeBook',
      type: 'books',
      shelfId: book.parentElement.parentElement.id,
      bookId: totalBooks,
    });
    books[books.length - 1].remove();
  }
  console.log('book removed');
}

function updateApiData(obj) {
  console.log('updating data');
  try {
    if (obj.operation === 'addShelf') {
      widgetApiData.shelfs.push(obj.shelf);
    }
    if (obj.operation === 'addBook') {
      widgetApiData.books.push(obj.book);
      widgetApiData.shelfs.map((shelf) => {
        if (shelf.id === obj.book.shelfId) {
          shelf.amount += 1;
          shelf.isFull = shelf.amount === 12 ? true : false;
        }
      });
    }
    if (obj.operation === 'removeBook') {
      widgetApiData.books = widgetApiData.books.filter(
        (book) => book.id !== obj.bookId,
      );
      widgetApiData.shelfs.map((shelf) => {
        if (shelf.id === obj.shelfId) {
          shelf.amount -= 1;
          shelf.isFull = shelf.amount === 12 ? true : false;
        }
      });
    }
    if (obj.operation === 'removeShelf') {
      widgetApiData.shelfs = widgetApiData.shelfs.filter(
        (shelf) => shelf.id !== obj.shelfId,
      );
    }
    console.log(widgetApiData);
    SE_API.store.set('pruebadeapi', widgetApiData);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}

// function init(obj) {
//   const apiData = getApiData(obj)
//   console.log("initializing widget");
//   // this function will be in charge of the initial widget creation
//   // and also everytime the widget is reloaded
//   // we will get the data from the api and then create the widget manually here to avoid issues (or maybe not)
//   // we will have to take every shelf, create one shelf image for each shelf saved in the api
//   // using the link for the image that the shelf has
//   // then we will use the book info to generate the same books that the user had last time
//   // this means displaying them in the same order (using the book id), in the same shelf (using the shelf id)
// }
