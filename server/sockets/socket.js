const { io } = require("../server");
const { Usuarios } = require("../classes/usuarios");
const { crearMensaje } = require("../utils/utils");

const usuarios = new Usuarios();

io.on("connection", (client) => {
  client.on("entrarChat", (data, callback) => {
    if (!data.nombre || !data.sala) {
      return callback({
        error: true,
        mensaje: "Nombre/Sala requeridos",
      });
    }

    client.join(data.sala);

    let personasConectadas = usuarios.agregarPersona(
      client.id,
      data.nombre,
      data.sala
    );

    client.broadcast
      .to(data.sala)
      .emit("listaPersona", usuarios.getPersonasPorSala(data.sala));
    callback(personasConectadas);
  });

  client.on("disconnect", () => {
    let personaEliminada = usuarios.eliminarPersona(client.id);
    let nombre = "Admin";
    let mensaje = `${personaEliminada.nombre} abandono el chat`;

    client.broadcast
      .to(personaEliminada.sala)
      .emit(client, "crearMensaje", crearMensaje(nombre, mensaje));

    client.broadcast
      .to(personaEliminada.sala)
      .emit("listaPersona", usuarios.getPersonasPorSala(personaEliminada.sala));
  });

  client.on("crearMensaje", (data) => {
    if (!data) {
      return;
    }

    let persona = usuarios.getPersona(client.id);
    client.broadcast
      .to(persona.sala)
      .emit("crearMensaje", crearMensaje(persona.nombre, data.mensaje));
  });

  client.on("mensajePrivado", (data) => {
    if (!data) {
      return;
    }

    let persona = usuarios.getPersona(client.id);
    client.broadcast
      .to(data.para)
      .emit("crearMensaje", crearMensaje(persona.nombre, data.mensaje));
  });
});
