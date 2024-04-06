let fieldData = {
  bookColor: {
    type: "color",
    value: "#000000",
    label: "Book color",
    group: "Books",
  },
  selectedShelf: {
    type: "dropdown",
    value: "A",
    label: "Selected shelf",
    group: "Shelfs",
    options: {
      A: "Shelf A",
      B: "Shelf B",
      C: "Shelf C",
      D: "Shelf D",
      E: "Shelf E",
    }
  },
  addBook: {
    type: "button",
    value: "addBook",
    label: "Add book",
    group: "Books",
  },
  removeBook: {
    type: "button",
    value: "removeBook",
    label: "Remove book",
    group: "Books",
  },
  addShelf: {
    type: "button",
    value: "addShelf",
    label: "Add shelf",
    group: "Shelfs",
  },
  removeShelf: {
    type: "button",
    value: "removeShelf",
    label: "Remove shelf",
    group: "Shelfs",
  },
};
