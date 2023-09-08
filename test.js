const fecha = document.querySelector("#fecha");
const marca = document.querySelector("#marca");
const proj = document.querySelector("#proj");
const piezas = document.querySelector("#piezas");
const link = document.querySelector("#link");
const lista = document.querySelector("#taskSecc");
const ButtonSend = document.querySelector("#icon");

let listArr = JSON.parse(localStorage.getItem("todo")) || [];

const fechaNav = new Date();
fecha.innerHTML = fechaNav.toLocaleDateString("es-MX", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

// Login Verif
document.addEventListener("DOMContentLoaded", () => {
    // Verificar el estado de inicio de sesión
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
        // El usuario no ha iniciado sesión, redirigir al inicio de sesión
        window.location.href = "login.html";
    }
     // Agrega un evento click al botón de enviar tareas por correo
     const sendTasksButton = document.getElementById("sendTasksButton");
     sendTasksButton.addEventListener("click", () => {
         enviarTareasPorCorreo();
     });


     // Función para enviar las tareas por correo electrónico
function enviarTareasPorCorreo() {
    // Obtén el nombre del usuario y el área del almacenamiento local
    const username = localStorage.getItem("username");
    const selectedArea = localStorage.getItem("selectedArea");

    // Obtén las tareas no eliminadas de la lista
    const tareas = listArr.filter(task => !task.eliminado);

    // Obtén el mes actual
    const fechaActual = new Date();
    const mesActual = fechaActual.toLocaleDateString("es-MX", {
        month: "long"
    });

    // Formatea el contenido del correo con las tareas y el mes actual
    let contenidoCorreo = `Nombre de Usuario: ${username}\nÁrea: ${selectedArea}\n\nEntregables del mes de ${mesActual}:\n`;

    tareas.forEach((task, index) => {
        contenidoCorreo += `\nTarea ${index + 1}:\n`;
        contenidoCorreo += `Marca: ${task.Marca}\n`;
        contenidoCorreo += `Proyecto/Task: ${task.Proj}\n`;
        contenidoCorreo += `Piezas: ${task.Piezas} pzas\n`;
        contenidoCorreo += `Link BC: ${task.link}\n\n`;
    });

    // Crear un elemento de correo electrónico
    const mailToLink = `mailto:rodrigo.gianechini@valtech.com?subject=Entregables de ${username}&body=${encodeURIComponent(
        contenidoCorreo
    )}`;

    // Abre el cliente de correo predeterminado para enviar el correo
    window.location.href = mailToLink;
}

    // Obtener el nombre de usuario y área del almacenamiento local
    const username = localStorage.getItem("username");
    const selectedArea = localStorage.getItem("selectedArea");

    // Actualizar el saludo de usuario en la página principal
    const userGreeting = document.getElementById("userGreeting");
    if (userGreeting) {
        userGreeting.textContent = `Hola, ${username}`;
    }

});


//Eliminar todo
const eliminarTodoButton = document.getElementById("eliminarTodo");

eliminarTodoButton.addEventListener("click", () => {
  // Elimina todos los tasks de manera visual
  lista.innerHTML = "";

  // Elimina todos los tasks del local storage
  listArr = [];
  localStorage.removeItem("todo");
});



function guardoListaEnLocalstorage() {
  const storageData = { tasks: listArr };
  localStorage.setItem("todo", JSON.stringify(storageData));
}

function AddTask(task) {
  const taskId = `task-${Date.now()}-${Math.random()}`;
  task.id = taskId; // Asignar un ID único a la tarea
  const elemento = `<div class=" row align-items-center justify-content-evenly" id="row3" data-task-id="${taskId}">
    <div class="" id="marcaExp">${task.Marca}</div>
    <div class="text-wrap" id="projExp">${task.Proj}</div>
    <div class="" id="piezasExp">${task.Piezas} pzas</div>
    <a class="" id="linkBC" href="${task.link}">
      <img class="" id="iconBC" src="./icon/basecamp_3.png" alt="">
    </a>
    <div class="" id="cambiosExp">Cambios</div>
    <img class="" id="edit" src="./icon/pen.svg"></img>
    <img class="" data="eliminado" id="delete" src="./icon/circle-minus-solid.svg"></img>
  </div>`;

  lista.insertAdjacentHTML("afterbegin", elemento);
  mostrarCambios(task); // Mostrar el contador de cambios al agregar la tarea
}



function cargarLista() {
  lista.innerHTML = "";
  listArr.forEach(function (task) {
    if (!task.eliminado) {
      AddTask(task);
      mostrarCambios(task); // Agrega esta línea para mostrar los cambios
    }
  });
}

function mostrarCambios(task) {
  const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
  const cambiosElement = taskElement.querySelector("#cambiosExp");

  if (task.cambios > 0) {
    cambiosElement.textContent = `Cambios ${task.cambios}`;
  } else {
    cambiosElement.textContent = "Cambios";
  }
}


function tareaElim(element) {
  const taskElement = element.closest(".row");
  const taskId = Array.from(lista.children).indexOf(taskElement);
  taskElement.remove();
  listArr[taskId].eliminado = true;

  listArr = listArr.filter(task => !task.eliminado);
  localStorage.setItem("todo", JSON.stringify(listArr));
}

ButtonSend.addEventListener("click", () => {
  const marcaVal = marca.value;
  const projVal = proj.value;
  const piezasVal = piezas.value;
  const linkVal = link.value;

  if (marcaVal && projVal && piezasVal && linkVal) {
    const task = {
      Marca: marcaVal,
      Proj: projVal,
      Piezas: piezasVal,
      link: linkVal,
      eliminado: false,
    };

    listArr.push(task);
    AddTask(task);
    guardoListaEnLocalstorage();

    marca.value = "";
    proj.value = "";
    piezas.value = "";
    link.value = "";
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    const marcaVal = marca.value;
    const projVal = proj.value;
    const piezasVal = piezas.value;
    const linkVal = link.value;

    if (marcaVal && projVal && piezasVal && linkVal) {
      const task = {
        Marca: marcaVal,
        Proj: projVal,
        Piezas: piezasVal,
        link: linkVal,
        eliminado: false,
      };
      listArr.push(task);
      AddTask(task);
      guardoListaEnLocalstorage();

      marca.value = "";
      proj.value = "";
      piezas.value = "";
      link.value = "";
    }
  }
});

lista.addEventListener("click", function (event) {
  const element = event.target;
  const elementData = element.attributes.data.value;

  if (elementData === "eliminado") {
    tareaElim(element);
  }
  guardoListaEnLocalstorage();
});


// Editar
// Modificar la función editMode para aceptar un taskId
function editMode(taskId) {
  const task = listArr.find(task => task.id === taskId);

  if (task) {
    const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
    const marcaElement = taskElement.querySelector("#marcaExp");
    const projElement = taskElement.querySelector("#projExp");
    const piezasElement = taskElement.querySelector("#piezasExp");
    const linkElement = taskElement.querySelector("#linkBC");
    taskElement.classList.add('edit-mode');
    const originalMarcaValue = marcaElement.textContent;
    const originalProjValue = projElement.textContent;
    const originalPiezasValue = piezasElement.textContent.split(" ")[0];
    const originalLinkValue = linkElement.getAttribute("href");

    // Agregar botón "Guardar"
    const saveButton = document.createElement("button");
    saveButton.id = "saveEdit";
    saveButton.textContent = "Guardar";
    saveButton.classList.add("small-button"); // Agrega la clase creada
    taskElement.appendChild(saveButton);

    marcaElement.innerHTML = `<input type="text" class="edit-field" value="${originalMarcaValue}" />`;
    projElement.innerHTML = `<input type="text" class="edit-field" value="${originalProjValue}" />`;
    piezasElement.innerHTML = `<input type="number" class="edit-field" value="${originalPiezasValue}" /> pzas`;
    linkElement.innerHTML = `<input type="text" class="edit-field" value="${originalLinkValue}" />`;

    // Manejar clic en el botón "Guardar"
    saveButton.addEventListener("click", () => {
      const editedMarca = marcaElement.querySelector(".edit-field").value;
      const editedProj = projElement.querySelector(".edit-field").value;
      const editedPiezas = piezasElement.querySelector(".edit-field").value;
      const editedLink = linkElement.querySelector(".edit-field").value;

      // Aplicar los cambios a la tarea
      task.Marca = editedMarca;
      task.Proj = editedProj;
      task.Piezas = editedPiezas;
      task.link = editedLink;

      // Guardar cambios y actualizar vista
      guardoListaEnLocalstorage();
      cargarLista();

      // Restaurar vista original y eliminar el botón "Guardar"
      marcaElement.innerHTML = editedMarca;
      projElement.innerHTML = editedProj;
      piezasElement.innerHTML = `${editedPiezas} pzas`;
      linkElement.innerHTML = `<a class="" id="linkBC" href="${editedLink}">
        <img class="" id="iconBC" src="./icon/basecamp_3.png" alt="">
      </a>`;
      taskElement.removeChild(saveButton);

      // Salir del modo de edición
      taskElement.classList.remove('edit-mode');
    });
  }
}

// Modificar el evento de clic izquierdo para activar el edit mode
lista.addEventListener("click", function (event) {
  const element = event.target;
  if (element.id === "edit") {
    const taskElement = element.closest(".row");
    const taskId = taskElement.getAttribute("data-task-id"); // Obtener el taskId de los atributos de datos
    editMode(taskId);
  }
});

// ...

// Cargar la lista desde el almacenamiento local
function cargoListaDesdeLocalstorage() {
  const data = localStorage.getItem("todo");
  if (data) {
    listArr = JSON.parse(data).tasks;
    cargarLista();
  }
}

cargoListaDesdeLocalstorage();




// Agregar evento de clic izquierdo para aumentar el contador y clic izquierdo + tecla "Control" o "Command" para disminuir (macOS y otros sistemas)
lista.addEventListener("mousedown", function (event) {
  const element = event.target;
  if (element.id === "cambiosExp") {
    const taskElement = element.closest(".row");
    const taskId = taskElement.getAttribute("data-task-id"); // Obtener el taskId de los atributos de datos

    let task = listArr.find(task => task.id === taskId); // Buscar la tarea correspondiente en listArr
    if (!task) return; // Si la tarea no existe, salimos

    let cambiosCount = task.cambios || 0;

    if (event.button === 0 && !event.metaKey && !event.ctrlKey) {
      // Clic izquierdo sin tecla "Control" o "Command"
      cambiosCount++;
    } else if (
      event.button === 0 && // Clic izquierdo
      ((event.ctrlKey && !navigator.platform.includes("Mac")) ||
        (event.metaKey && navigator.platform.includes("Mac"))) // Tecla "Control" (no en macOS) o "Command" (en macOS)
    ) {
      // Clic izquierdo + tecla "Control" o "Command"
      if (cambiosCount > 0) {
        cambiosCount--;
      }
    }

    task.cambios = cambiosCount;

    const cambiosElement = taskElement.querySelector("#cambiosExp");
    if (cambiosCount > 0) {
      cambiosElement.textContent = `Cambios ${cambiosCount}`;
    } else {
      cambiosElement.textContent = "Cambios";
    }

    // Guardar cambios en el almacenamiento local
    guardoListaEnLocalstorage();
  }
});



function cargoListaDesdeLocalstorage() {
  const data = localStorage.getItem("todo");
  if (data) {
    listArr = JSON.parse(data).tasks;
    cargarLista();
  }
}

cargoListaDesdeLocalstorage();
