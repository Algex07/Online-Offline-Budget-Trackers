window.indexedDB = window.indexedDB || window.mozIndexedDB ||
  window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction ||
  window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange ||
  window.msIDBKeyRange
if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

let db;
let request = window.indexedDB.open("budget", 1);

request.onerror = function (e) {
  console.log("error: ");
};

request.onsuccess = function (e) {
  db = request.result;
  console.log("success: " + db);
};
request.onupgradeneeded = function (event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore("budget", { autoIncrement: true });

  for (var i in budgetData) {
    objectStore.add(budgetData[i]);
  }
}


function checkDatabase() {
  const transaction = db.transaction(["budget"], "readwrite");
  const store = transaction.objectStore("budget");
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        }
      })
        .then(response => response.json())
        .then(() => {
          if (res.lenght !== 0){
          const transaction = db.transaction(['budget'], 'readwrite');
          const store = transaction.objectStore('budget')

          store.clear();
          console.log("store data cleared")
          }
        })
    }
  };
}
function add() {
  var request = db.transaction(["budget"], "readwrite")
    .objectStore("budget")
  const store = request.objectStore("budget");
  store.add(data)


};



window.addEventListener('online', checkDatabase);



