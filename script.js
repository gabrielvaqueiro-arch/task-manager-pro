let tareas = [];
let id = 1;

const form = document.getElementById("form");
const lista = document.getElementById("lista");
const mensaje = document.getElementById("mensaje");
const buscador = document.getElementById("buscador");


// 🔹 CARGAR DATOS AL INICIAR
window.addEventListener("load", function() {
    let datos = localStorage.getItem("tareas");

    if (datos) {
        tareas = JSON.parse(datos);

        // actualizar id para que no se repita
        id = tareas.length > 0 ? tareas[tareas.length - 1].id + 1 : 1;

        pintar();
    }
});


// 🔹 GUARDAR EN LOCALSTORAGE
function guardarDatos() {
    let json = JSON.stringify(tareas);
    localStorage.setItem("tareas", json);
}


// 🔹 AÑADIR TAREA
form.addEventListener("submit", function(e) {
    e.preventDefault();

    let titulo = document.getElementById("titulo").value.trim();
    let estado = document.getElementById("estado").value;
    let prioridad = document.getElementById("prioridad").value;

    if (titulo === "") {
        mensaje.textContent = "El título es obligatorio";
        return;
    }

    let tarea = {
        id: id++,
        titulo,
        estado,
        prioridad
    };

    tareas.push(tarea);

    guardarDatos(); // 🔥 guardar

    mensaje.textContent = "Tarea añadida";
    form.reset();
    pintar();
});


// 🔹 PINTAR
function pintar() {
    lista.innerHTML = "";

    let texto = buscador.value.toLowerCase();

    tareas.forEach(function(tarea) {
        if (!tarea.titulo.toLowerCase().includes(texto)) return;

        let div = document.createElement("div");

        let titulo = document.createElement("strong");
        titulo.textContent = tarea.titulo;

        let estado = document.createElement("p");
        estado.textContent = "Estado: " + tarea.estado;

        let prioridad = document.createElement("p");
        prioridad.textContent = "Prioridad: " + tarea.prioridad;

        let btnEstado = document.createElement("button");
        btnEstado.textContent = "Cambiar estado";

        btnEstado.addEventListener("click", function() {
            if (tarea.estado === "Pendiente") {
                tarea.estado = "En progreso";
            } else if (tarea.estado === "En progreso") {
                tarea.estado = "Hecha";
            } else {
                tarea.estado = "Pendiente";
            }

            guardarDatos(); // 🔥 guardar cambios
            pintar();
        });

        let btnBorrar = document.createElement("button");
        btnBorrar.textContent = "Borrar";

        btnBorrar.addEventListener("click", function() {
            if (!confirm("¿Borrar tarea?")) return;

            tareas = tareas.filter(t => t.id !== tarea.id);

            guardarDatos(); // 🔥 guardar cambios
            pintar();
        });

        div.appendChild(titulo);
        div.appendChild(estado);
        div.appendChild(prioridad);
        div.appendChild(btnEstado);
        div.appendChild(btnBorrar);

        lista.appendChild(div);
    });
}


// 🔹 BUSCADOR
buscador.addEventListener("input", pintar);