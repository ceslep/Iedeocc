<script context="module" lang="ts">
  export type tiempos = objetoTiempos[];
  export type docentes = objetoDocentes[];

  export interface objetoTiempos {
    fecha: Date;
    docente: string;
    asignatura: string;
    grado: string;
    hora: string;
    minuto: string;
    tiempo: string;
    nombres: string;
  }

  export interface objetoDocentes {
    identificacion: string;
    nombres: string;
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { _URL } from "./../Stores.js";

  import axios from "axios";
  import CalculaTiempos from "./CalculaTiempos.svelte";
  import FormularioConsulta from "./FormularioConsulta.svelte";

  let _tiempos: tiempos;
  let _docentes: docentes = [];
  let _tdocs: tiempos = [];
  let docente = "10288864";

  const getData = async (): Promise<tiempos> => {
    const { data }: any = await axios.post(`${$_URL}getTiemposDocentes.php`, {
      docente,
    });
    const _tiempos: tiempos = data.map((t: objetoTiempos) => {
      return {
        fecha: t.fecha,
        docente: t.docente,
        asignatura: t.asignatura,
        grado: t.grado,
        hora: t.hora,
        minuto: t.minuto,
        tiempo: t.tiempo,
        nombres: t.nombres,
      };
    });
    return _tiempos;
  };

  const tiempos = async () => {
    _tiempos = await getData();

    const dcnts: docentes = _tiempos
      .filter(
        (t, i, a) =>
          i ===
          a.findIndex((o) => o.docente === t.docente && o.nombres === t.nombres)
      )
      .map((d) => {
        return {
          identificacion: d.docente,
          nombres: d.nombres,
        };
      })
      .sort((a, b) => (a.nombres < b.nombres ? -1 : 1));
    _docentes = [...dcnts];
    console.log({ _tiempos });
    console.log(_docentes);
    console.log({ doc });
    const fe1: Date = new Date(f1);
    const fe2: Date = new Date(f2);
    console.log({ doc, f1, f2 });
    console.log({todos})
    _tdocs = [
      ..._tiempos.filter((t) => {
        const fecha = new Date(t.fecha);
        let r:boolean;
        if (!todos)
          return t.docente === doc && fecha >= fe1 && fecha <= fe2;
        else  return fecha >= fe1 && fecha <= fe2;
      }),
    ];
    console.log(_tdocs);
  };

  onMount(() => {
    tiempos();
  });

  const fechaActual = new Date();

  let f1: string = fechaActual.toISOString().split("T")[0];
  let f2: string = fechaActual.toISOString().split("T")[0];

  let doc: string = "";
  let todos: boolean = true;

  $: console.log(_tdocs);
  //$:if(todos) doc="";
</script>

<nav
  class="sticky-top bg-body-tertiary bg-light navbar"
  style="background-color: #e3f2fd;"
>
  <div class="container">
    <!-- Navbar content -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a
          class="nav-link active"
          aria-current="page"
          href="#!"
          on:click={tiempos}>Tiempos de uso Docentes</a
        >
      </li>
    </ul>
  </div>
</nav>

{#if _docentes.length > 0}
  <FormularioConsulta
    {_docentes}
    on:select={(e) => {
      console.clear();
      console.log(e.detail);
      doc = e.detail.docente;
      f1 = e.detail.fecha1;
      f2 = e.detail.fecha2;
      todos = e.detail.todos;
      _tdocs = [];
      tiempos();
    }}
    on:consultar={async () => {
      _docentes = [];
      _tdocs = [];
      await tiempos();
    }}
  />
{:else}
  <div class="d-flex justify-content-center pt-5">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
{/if}

{#if _tiempos}
  <CalculaTiempos json={_tdocs} />
{/if}
