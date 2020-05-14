var socket = io();
var params = new URLSearchParams(window.location.search);

var usuario = { nombre: params.get("nombre"), sala: params.get("sala") };

if (!params.has("nombre") || !params.has("sala")) {
  window.location = "index.html";
  throw new Error("El nombre y la sala son requeridos");
}

socket.on("connect", function () {
  console.log("Conectado al servidor");
  socket.emit("entrarChat", usuario, (respuesta) => {
    console.log(respuesta);
  });
});

// escuchar
socket.on("disconnect", function () {
  console.log("Perdimos conexión con el servidor");
});

// Enviar información
// socket.emit(
//   "crearMensaje",
//   {
//     mensaje: "Hola Mundo",
//   },
//   function (resp) {
//     console.log("respuesta server: ", resp);
//   }
// );

// Escuchar información
socket.on("crearMensaje", function (mensaje) {
  console.log("Servidor:", mensaje);
});

socket.on("listaPersona", function (mensaje) {
  console.log(mensaje);
});

socket.on("mensajePrivado", function (mensaje) {
  console.log(`Mensaje privado: ${mensaje}`);
});
