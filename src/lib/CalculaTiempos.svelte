<script lang="ts">
  import moment from "moment";
  import { afterUpdate, onMount } from "svelte";
  import { Tab } from "bootstrap";
  import Individuales from "./Individuales.svelte";
  import Consolidado from "./Consolidado.svelte";

  // Función para calcular el tiempo transcurrido entre "Inicia" y "Finaliza"
  function calcularTiempoTranscurrido(json) {
    let results = [];

    let agrupadosPorAsignaturaGrado = agruparPorAsignaturaGrado(json);

    agrupadosPorAsignaturaGrado.forEach(function (datos) {
      let tiemposInicia = datos.filter(function (obj) {
        return obj.tiempo === "Inicia";
      });

      let tiemposFinaliza = datos.filter(function (obj) {
        return obj.tiempo === "Finaliza";
      });

      tiemposInicia.forEach(function (inicia) {
        let finaliza = tiemposFinaliza.find(function (obj) {
          return (
            obj.hora > inicia.hora ||
            (obj.hora === inicia.hora && obj.minuto >= inicia.minuto)
          );
        });

        if (finaliza) {
          let horaInicio = moment(inicia.hora + ":" + inicia.minuto, "HH:mm");
          let horaFinal = moment(
            finaliza.hora + ":" + finaliza.minuto,
            "HH:mm"
          );

          let duracion = moment.duration(horaFinal.diff(horaInicio));
          let tiempoTranscurrido = duracion.asMinutes();

          results.push({
            asignatura: inicia.asignatura,
            grado: inicia.grado,
            tiempoTranscurrido: tiempoTranscurrido,
            nombres: inicia.nombres,
            fecha: inicia.fecha,
          });
        }
      });
    });

   return results;
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

  export let json;

  let resultados;

  onMount(() => {
    resultados = calcularTiempoTranscurrido(json);
  });
  afterUpdate(() => {
    resultados = calcularTiempoTranscurrido(json);
  });

  let total: number;
  let res: any;

  $: if (resultados)
    res = [
      ...resultados.filter(
        (r) => r.tiempoTranscurrido > 0 && r.tiempoTranscurrido < 35
      ),
    ];
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
      {#if res}
        <Consolidado {res} />
      {/if}
    </div>
    <div
      class="tab-pane fade"
      id="nav-resultados"
      role="tabpanel"
      aria-labelledby="nav-resultados-tab"
      tabindex="0"
    >
      <Individuales {resultados} {res} {total} />
    </div>
  </div>
</div>

<style>
  .tab-content {
    overflow: auto;
    height: 300px; /* Ajusta la altura según tus necesidades */
  }
</style>
