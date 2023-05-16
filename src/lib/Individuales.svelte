<script lang="ts">
  export let resultados: any;
  export let total: number;
  export let res: any;

  function convertir(minutos) {
    var dias = Math.floor(minutos / 1440); // 1 día tiene 1440 minutos (24 horas x 60 minutos)
    var horas = Math.floor((minutos % 1440) / 60); // El residuo después de restar los días se divide por 60 para obtener las horas
    var minutosRestantes = minutos % 60; // El residuo después de dividir por 60 son los minutos restantes

    var resultado = "";

    if (dias > 0) {
      resultado += dias + (dias === 1 ? " día " : " días ");
    }

    if (horas > 0) {
      resultado += horas + (horas === 1 ? " hora " : " horas ");
    }

    if (minutosRestantes > 0) {
      resultado +=
        minutosRestantes + (minutosRestantes === 1 ? " minuto" : " minutos");
    }

    return resultado.trim();
  }
</script>

{#if resultados && resultados.length > 0 && total}
  <h2>
    Total:
    <span class="fw-bold text-success">
      {convertir(total)}
    </span>
  </h2>
  <div class="container grid">
    {#each res.sort( (a, b) => (a.nombres < b.nombres ? -1 : 1) ) as { nombres, fecha, grado, tiempoTranscurrido, asignatura }, index}
      <div class="item">
        {nombres}
      </div>
      <div class="item text-primary">
        {asignatura}
      </div>
      <div class="item text-secondary">
        {grado}
      </div>
      <div class="item text-success">
        {fecha}
      </div>
      <div class="item text-end">
        {tiempoTranscurrido}'
      </div>
    {/each}
  </div>
{/if}

<style>
  .grid {
    display: grid;
    grid-template-columns: 45% 20% 10% 15% 5%;
    grid-template-rows: auto;
    align-items: center;
  }

  .grid > .item {
    font-size: 0.8rem;
  }
</style>
