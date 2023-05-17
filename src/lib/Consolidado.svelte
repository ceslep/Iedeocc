<script lang="ts">
  import { afterUpdate, onMount } from "svelte";
  import { groupBy, mapObject } from "underscore";
  import { convertir } from "./Individuales.svelte";

  export let res: any;

  let _consolidadoDocentes: any;

  const calculos = () => {
    const grouped = groupBy(res, "nombres");
    console.log({grouped});
    const summedGroups = mapObject(grouped, (group) => {
      const sum = group.reduce((acc, obj) => acc + obj.tiempoTranscurrido, 0);
      console.log(group);
      return {
        nombres: group[0].nombres,
        tiempoTotal: sum,
      };
    });
    return summedGroups;
    
  };

  let sumaGrupos;
  onMount(() => {
    sumaGrupos=calculos();
  });
  afterUpdate(() => {
    sumaGrupos=calculos();
  });

  let total;

  $:if (res) sumaGrupos=calculos();

  $: if (_consolidadoDocentes && _consolidadoDocentes.length > 0)
    total = _consolidadoDocentes.reduce((a, b) => a + b.tiempoTotal, 0);

  $: if(sumaGrupos){
    _consolidadoDocentes = Object.values(sumaGrupos);
  }
</script>

{#if _consolidadoDocentes && _consolidadoDocentes.length > 0 && total}
  <h2>
    Total:
    <span class="fw-bold text-success">
      {convertir(total)}
    </span>
  </h2>
  <div class="container grid">
    {#each _consolidadoDocentes.sort((a, b) => b.tiempoTotal - a.tiempoTotal) as { nombres, tiempoTotal }, index}
      <div class="item">
        {nombres}
      </div>
      <div class="item text-secondary text-end">
        {convertir(tiempoTotal)}
      </div>
    {/each}
  </div>
{/if}

<style>
  .grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto;
    align-items: center;
  }

  .grid > .item {
    font-size: 0.8rem;
  }
</style>
