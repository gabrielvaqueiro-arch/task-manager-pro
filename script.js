// Array donde guardamos todas las tareas
let tareas = [];

// Variable para generar IDs únicos
let id = 1;


// Referencias a elementos del HTML
const form = document.getElementById("form");       // formulario
const lista = document.getElementById("lista");     // contenedor de tareas
const mensaje = document.getElementById("mensaje"); // mensajes al usuario
const buscador = document.getElementById("buscador"); // input de búsqueda



// 🔹 CARGAR DATOS AL INICIAR LA PÁGINA
window.addEventListener("load", function() {

    // Intentamos obtener datos guardados en localStorage
    let datos = localStorage.getItem("tareas");

    // Si hay datos guardados...
    if (datos) {

        // Convertimos el JSON a array de objetos
        tareas = JSON.parse(datos);

        // Ajustamos el id para que no se repita
        // Si hay tareas, cogemos el último id + 1
        // Si no hay tareas, empezamos en 1
        id = tareas.length > 0 ? tareas[tareas.length - 1].id + 1 : 1;

        // Mostramos las tareas en pantalla
        pintar();
    }
});



// 🔹 FUNCIÓN PARA GUARDAR DATOS EN LOCALSTORAGE
function guardarDatos() {

    // Convertimos el array a texto JSON
    let json = JSON.stringify(tareas);

    // Guardamos el JSON en localStorage con la clave "tareas"
    localStorage.setItem("tareas", json);
}



// 🔹 EVENTO PARA AÑADIR TAREA
form.addEventListener("submit", function(e) {

    // Evita que el formulario recargue la página
    e.preventDefault();

    // Recogemos valores del formulario
    let titulo = document.getElementById("titulo").value.trim(); // texto sin espacios
    let estado = document.getElementById("estado").value;
    let prioridad = document.getElementById("prioridad").value;

    // VALIDACIÓN: no permitir título vacío
    if (titulo === "") {
        mensaje.textContent = "El título es obligatorio";
        return; // detenemos la ejecución
    }

    // Creamos el objeto tarea
    let tarea = {
        id: id++,      // asigna id y lo incrementa
        titulo,
        estado,
        prioridad
    };

    // Añadimos la tarea al array
    tareas.push(tarea);

    // Guardamos en localStorage
    guardarDatos();

    // Mostramos mensaje al usuario
    mensaje.textContent = "Tarea añadida";

    // Limpiamos el formulario
    form.reset();

    // Actualizamos la interfaz
    pintar();
});



// 🔹 FUNCIÓN QUE DIBUJA LAS TAREAS EN PANTALLA
function pintar() {

    // Limpiamos la lista antes de volver a dibujar
    lista.innerHTML = "";

    // Texto del buscador en minúsculas
    let texto = buscador.value.toLowerCase();

    // Recorremos todas las tareas
    tareas.forEach(function(tarea) {

        // FILTRO: si no coincide con la búsqueda, no se muestra
        if (!tarea.titulo.toLowerCase().includes(texto)) return;

        // Creamos contenedor de la tarea
        let div = document.createElement("div");

        // Título en negrita
        let titulo = document.createElement("strong");
        titulo.textContent = tarea.titulo;

        // Estado
        let estado = document.createElement("p");
        estado.textContent = "Estado: " + tarea.estado;

        // Prioridad
        let prioridad = document.createElement("p");
        prioridad.textContent = "Prioridad: " + tarea.prioridad;

        // 🔘 BOTÓN CAMBIAR ESTADO
        let btnEstado = document.createElement("button");
        btnEstado.textContent = "Cambiar estado";

        btnEstado.addEventListener("click", function() {

            // Cambiamos estado de forma cíclica
            if (tarea.estado === "Pendiente") {
                tarea.estado = "En progreso";
            } else if (tarea.estado === "En progreso") {
                tarea.estado = "Hecha";
            } else {
                tarea.estado = "Pendiente";
            }

            // Guardamos cambios
            guardarDatos();

            // Actualizamos pantalla
            pintar();
        });


        // 🔘 BOTÓN BORRAR
        let btnBorrar = document.createElement("button");
        btnBorrar.textContent = "Borrar";

        btnBorrar.addEventListener("click", function() {

            // Confirmación antes de borrar
            if (!confirm("¿Borrar tarea?")) return;

            // Eliminamos la tarea del array
            tareas = tareas.filter(t => t.id !== tarea.id);

            // Guardamos cambios
            guardarDatos();

            // Actualizamos pantalla
            pintar();
        });


        // Añadimos todos los elementos al div
        div.appendChild(titulo);
        div.appendChild(estado);
        div.appendChild(prioridad);
        div.appendChild(btnEstado);
        div.appendChild(btnBorrar);

        // Añadimos el div a la lista general
        lista.appendChild(div);
    });
}



// 🔹 EVENTO DEL BUSCADOR
buscador.addEventListener("input", pintar);

// Cada vez que el usuario escribe,
// se vuelve a ejecutar pintar() y se filtran las tareas