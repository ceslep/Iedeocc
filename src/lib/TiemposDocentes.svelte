<script lang="ts">
  import { onMount } from "svelte";
  import { _URL } from "./../Stores.js";

  import axios from "axios";
  import CalculaTiempos from "./CalculaTiempos.svelte";

  let _tiempos: tiempos;
  let docente = "10288864";

  type tiempos = objetoTiempos[];

  interface objetoTiempos {
    fecha: Date;
    docente: string;
    asignatura: string;
    grado: string;
    hora: string;
    minuto: string;
    tiempo:string;
  }

  const getData = async (): Promise<tiempos> => {
    const { data }: any = await axios.post(`${$_URL}getTiemposDocentes.php`, {
      docente,
    });
    const _tiempos: tiempos = data.map((t: any) => {
      return {
        fecha: t.fecha,
        docente: t.docente,
        asignatura: t.asignatura,
        grado: t.grado,
        hora: t.hora,
        minuto: t.minuto,
        tiempo:t.tiempo
      };
    });
    return _tiempos;
  };

  const tiempos = async () => {
    _tiempos = await getData();
    const asignaturas = new Set(_tiempos.map(t=>{
      const {grado,asignatura,tiempo}=t;
      return {grado,asignatura}
    }));
    console.log({asignaturas})
  };
  onMount(() => {
    tiempos();
  });

  $:if(_tiempos)console.log(_tiempos)
</script>

<nav class="navbar" style="background-color: #e3f2fd;">
  <div class="container">
    <!-- Navbar content -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a
          class="nav-link active"
          aria-current="page"
          href="#!"
          on:click={tiempos}>Refrescar datos</a
        >
      </li>
    </ul>
  </div>
</nav>

{#if _tiempos}
<CalculaTiempos json={_tiempos}/>
{/if}