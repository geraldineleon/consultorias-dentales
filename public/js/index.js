//apartado del indexedDb

const indexedDb = window.indexedDB;
const form = document.getElementById("form");

if (indexedDb && form) {
  let db;
  const request = indexedDb.open("listConsultas", 1);

  request.onsuccess = () => {
    db = request.result;
    console.log("Base de datos abiera", db);
    readData();
  };
  request.onupgradeneeded = () => {
    db = request.result;
    console.log("Base de datos creada", db);

    const objectStore = db.createObjectStore("consultas", {
      keyPath: "correo",
    });
  };

  request.onerror = (error) => {
    console.log("Error: ", error);
  };

  const addData = (data) => {
    const transaction = db.transaction(["consultas"], "readwrite");
    const objectStore = transaction.objectStore("consultas");
    const request = objectStore.add(data);
  };
  const readData = () => {
    const transaction = db.transaction(["consultas"], "readonly");
    const objectStore = transaction.objectStore("consultas");
    const request = objectStore.openCursor();

    request.onsuccess = (e) => {
      console.log(e.target);
      const cursor = e.target.result;
      if (cursor) {
        console.log(cursor.value);
        cursor.continue();
      } else {
        console.log("No more data");
      }
    };
  };

  window.addEventListener("offline", () => {
    console.log("Sin conexion");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        nombre: e.target.nombre.value,
        edad: e.target.edad.value,
        alergias: e.target.alergias.value,
        correo: e.target.correo.value,
        telefono: e.target.telefono.value,
        doctor: e.target.doctor.value,
        antecedente: e.target.antecedente.value,
        tipo: e.target.tipo.value,
        dia: e.target.dia.value,
        hora: e.target.hora.value,
      };
      console.log(data);
      addData(data);
    });
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const consulta = {
      nombre: e.target.nombre.value,
      edad: e.target.edad.value,
      alergias: e.target.alergias.value,
      correo: e.target.correo.value,
      telefono: e.target.telefono.value,
      doctor: e.target.doctor.value,
      antecedente: e.target.antecedente.value,
      tipo: e.target.tipo.value,
      dia: e.target.dia.value,
      hora: e.target.hora.value,
    };
    let consultaObjeto = JSON.stringify(consulta);
    fetch("/api/consulta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: consultaObjeto,
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  });
}

//apartado del service worker

let newServiceWorker;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/consultorias-dentales" })
      .then((registerEvent) => {
        registerEvent.addEventListener("updatefound", () => {
          newServiceWorker = registerEvent.installing;

          newServiceWorker.addEventListener("statechange", () => {
            /* if (newServiveWorker.state === 'installed') {

            } */

            switch (newServiceWorker.state) {
              case "installed":
                showSnackbarUpdate();
                break;
            }
          });
        });
      });
  });
}

function showSnackbarUpdate() {
  // Get the snackbar DIV
  let x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";
}

let launchUpdate = document.getElementById("launchUpdate");
launchUpdate.addEventListener("click", () => {
  newServiceWorker.postMessage({
    action: "skipWaiting",
  });
  window.reload();
});
