<script lang="ts">
  import moment from "moment";
  import { onMount } from "svelte";

  // Función para calcular el tiempo transcurrido entre "Inicia" y "Finaliza"
  function calcularTiempoTranscurrido(json) {
    var resultados = [];

    var agrupadosPorAsignaturaGrado = agruparPorAsignaturaGrado(json);

    agrupadosPorAsignaturaGrado.forEach(function (datos) {
      var tiemposInicia = datos.filter(function (obj) {
        return obj.tiempo === "Inicia";
      });

      var tiemposFinaliza = datos.filter(function (obj) {
        return obj.tiempo === "Finaliza";
      });

      tiemposInicia.forEach(function (inicia) {
        var finaliza = tiemposFinaliza.find(function (obj) {
          return (
            obj.hora > inicia.hora ||
            (obj.hora === inicia.hora && obj.minuto >= inicia.minuto)
          );
        });

        if (finaliza) {
          var horaInicio = moment(inicia.hora + ":" + inicia.minuto, "HH:mm");
          var horaFinal = moment(
            finaliza.hora + ":" + finaliza.minuto,
            "HH:mm"
          );

          var duracion = moment.duration(horaFinal.diff(horaInicio));
          var tiempoTranscurrido = duracion.asMinutes();

          resultados.push({
            asignatura: inicia.asignatura,
            grado: inicia.grado,
            tiempoTranscurrido: tiempoTranscurrido,
          });
        }
      });
    });

    return resultados;
  }

  // Función para agrupar los objetos por "asignatura" y "grado"
  function agruparPorAsignaturaGrado(json) {
    var grupos = {};

    json.forEach(function (obj) {
      var key = obj.asignatura + "-" + obj.grado;

      if (!grupos[key]) {
        grupos[key] = [];
      }

      grupos[key].push(obj);
    });

    var resultados = [];

    for (var key in grupos) {
      if (grupos.hasOwnProperty(key)) {
        resultados.push(grupos[key]);
      }
    }
    return resultados;
  }

  // Ejemplo de uso con el JSON proporcionado
  export let json; /* = JSON.parse(`
[{"fecha":"2023-05-10","docente":"10288864","asignatura":"TECNOLOG","grado":"8-1","hora":"07","minuto":"25","tiempo":"Inicia"},{"fecha":"2023-05-10","docente":"10288864","asignatura":"TECNOLOG","grado":"8-1","hora":"7","minuto":"50","tiempo":"Finaliza"},{"fecha":"2023-05-10","docente":"10288864","asignatura":"TECNOLOG","grado":"8-1","hora":"7","minuto":"52","tiempo":"Finaliza"},{"fecha":"2023-05-10","docente":"10288864","asignatura":"TECNOLOG","grado":"6-1","hora":"07","minuto":"53","tiempo":"Inicia"},{"fecha":"2023-05-10","docente":"10288864","asignatura":"TECNOLOG","grado":"6-2","hora":"10","minuto":"45","tiempo":"Inicia"},{"fecha":"2023-05-10","docente":"10288864","asignatura":"TECNOLOG","grado":"6-2","hora":"10","minuto":"55","tiempo":"Finaliza"},{"fecha":"2023-05-10","docente":"10288864","asignatura":"TECNOLOG","grado":"6-2","hora":"13","minuto":"00","tiempo":"Inicia"},{"fecha":"2023-05-10","docente":"10288864","asignatura":"TECNOLOG","grado":"6-2","hora":"13","minuto":"11","tiempo":"Finaliza"},{"fecha":"2023-05-10","docente":"10288864","asignatura":"TECNOLOG","grado":"6-2","hora":"13","minuto":"22","tiempo":"Finaliza"}]
`); */
  let resultados;
  onMount(() => {
    resultados = calcularTiempoTranscurrido(json);
    console.log(resultados);
  });

  let total:number;
  let res:any;
  $:if(resultados&&resultados.length>0) {
    res=[...resultados.filter(r=>r.tiempoTranscurrido>0 && r.tiempoTranscurrido<35)]
  }

$:if(res&&res.length>0)
total=res.reduce((a,b)=>a+b.tiempoTranscurrido,0)
</script>

{#if resultados}
<h3>{JSON.stringify(res)}</h3>
<h1>Total: {total} minutos</h1>

{/if}