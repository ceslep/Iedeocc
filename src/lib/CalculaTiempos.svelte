<script lang="ts">
  import moment from "moment";
  import { afterUpdate, onMount } from "svelte";
  import { Tab } from "bootstrap";
  import Individuales from "./Individuales.svelte";

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
            nombres: inicia.nombres,
            fecha: inicia.fecha,
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
  });
  afterUpdate(() => {
    resultados = calcularTiempoTranscurrido(json);
    console.log(resultados);
  });

  let total: number;
  let res: any;
  $: if (resultados && resultados.length > 0) {
    res = [
      ...resultados.filter(
        (r) => r.tiempoTranscurrido > 0 && r.tiempoTranscurrido < 35
      ),
    ];
  }

  $: if (res && res.length > 0)
    total = res.reduce((a, b) => a + b.tiempoTranscurrido, 0);

  $: console.log(res);

  let tabTrigger;
  const tab = (node) => {
    if (!tabTrigger) tabTrigger = new Tab(node);
  };
</script>

<div class="container-md">
  <nav use:tab>
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
      <button
        class="nav-link active"
        id="nav-consolidado-tab"
        data-bs-toggle="tab"
        data-bs-target="#nav-consolidado"
        type="button"
        role="tab"
        aria-controls="nav-consolidado"
        aria-selected="true">Consolidado</button
      >
      <button
        class="nav-link"
        id="nav-resultados-tab"
        data-bs-toggle="tab"
        data-bs-target="#nav-resultados"
        type="button"
        role="tab"
        aria-controls="nav-resultados"
        aria-selected="false">Resultados</button
      >
    </div>
  </nav>
  <div class="tab-content" id="nav-tabContent">
    <div
      class="tab-pane fade show active"
      id="nav-consolidado"
      role="tabpanel"
      aria-labelledby="nav-consolidado-tab"
      tabindex="0"
    >
      ...
    </div>
    <div
      class="tab-pane fade"
      id="nav-resultados"
      role="tabpanel"
      aria-labelledby="nav-resultados-tab"
      tabindex="0"
    >
      <Individuales {resultados} {res} {total}/> 
    </div>
  </div>
</div>


<style>
   .tab-content {
      overflow: auto;
      height: 300px; /* Ajusta la altura según tus necesidades */
    }
</style>