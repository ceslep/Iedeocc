<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { type objetoDocentes } from "./TiemposDocentes.svelte";

  const convertirFecha = (fecha) => {
    const partes = fecha.split("/");
    const dia = partes[0].padStart(2, "0"); // Añade cero al día si es menor que 10
    const mes = partes[1].padStart(2, "0"); // Añade cero al mes si es menor que 10
    const anio = partes[2];
    const fechaISO = `${anio}-${mes}-${dia}`;
    console.log(fechaISO);
    return fechaISO;
  };

  const fechaActual = new Date().toLocaleDateString("es-CO", {});
  console.log(fechaActual);
  export let _docentes: objetoDocentes[] = [];
  let fecha1 = convertirFecha(fechaActual);
  console.log(fecha1);
  let fecha2 = convertirFecha(fechaActual);

  let docente: string;
  let todos: boolean = true;
  let td: boolean = true;

  const dispatch = createEventDispatcher();

  const consultar = () => {
    const todos: boolean = docente === "" && td ? false : true;
    dispatch("select", { todos, docente, fecha1, fecha2 });
  };
  $: console.log(todos);
</script>

<div class="container-lg">
  <form class="">
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label for="fechaInicio" class="form-label">Fecha de inicio</label>
          <input
            bind:value={fecha1}
            type="date"
            class="form-control"
            id="fechaInicio"
            name="fechaInicio"
            on:input={consultar}
          />
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <label for="fechaFin" class="form-label">Fecha de fin</label>
          <input
            bind:value={fecha2}
            type="date"
            class="form-control"
            id="fechaFin"
            name="fechaFin"
            on:input={consultar}
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label for="selectElement" class="form-label">Docente</label>
          <select
            bind:value={docente}
            class="form-select"
            id="selectElement"
            name="selectElement"
            on:change={() => {
              if (docente !== "") td = false;
              consultar();
            }}
          >
            <option value="" />
            {#if _docentes.length > 0}
              {#each _docentes as { identificacion, nombres }, index}
                <option data-index="{index} " value={identificacion}
                  >{nombres}</option
                >
              {/each}
            {/if}
          </select>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3 mt-4 pt-2">
          <button
            type="submit"
            class="btn btn-primary w-100"
            on:click|preventDefault={() => {
              dispatch("consultar");
            }}>Recargar</button
          >
        </div>
      </div>
    </div>
    <div class="form-check">
      <input
        bind:checked={td}
        on:change={() => {
          if (td) docente = "";
          consultar();
        }}
        class="form-check-input"
        type="checkbox"
        id="flexCheckDefault"
      />
      <label class="form-check-label" for="flexCheckDefault"> Todos </label>
    </div>
  </form>
</div>
