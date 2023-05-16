<script>
  import 'bootstrap/dist/js/bootstrap.bundle.min.js';
  import 'bootstrap/dist/css/bootstrap.min.css';

  const menus = {
    "Menus": [
      {
        "menuName": "Accesos Rapidos",
        "subMenu": ["Comunicados y Circulares", "Agenda Semanal", "Sedes"]
      },
      {
        "menuName": "Nuestro Colegio",
        "subMenu": [
          {
            "menuItem": "Horizonte Institucional",
            "itemsSubmenu": [
              "Misión",
              "Visión",
              "Valores",
              "Politica de Calidad",
              "Procedimiento para atender situaciones de convivencia"
            ]
          },
          {
            "menuItem": "Símbolos",
            "itemsSubmenu": [
              "Bandera",
              "Escudo",
              "Himno"
            ]
          }
        ]
      }
    ]
  };

  function toggleSubmenu(event) {
    const dropdown = event.target.closest('.dropdown');
    if (!dropdown) return;

    const submenu = dropdown.querySelector('.dropdown-menu');
    if (!submenu) return;

    const expanded = submenu.getAttribute('data-bs-expanded') === 'true';
    submenu.setAttribute('data-bs-expanded', (!expanded).toString());
  }
</script>

<nav class="sticky-top navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#!">Instituto Educativo</a>
  <button
    class="navbar-toggler"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#navbarNav"
    aria-controls="navbarNav"
    aria-expanded="false"
    aria-label="Toggle navigation"
  >
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      {#each menus.Menus as menu}
        {#if typeof menu.subMenu === 'string'}
          <li class="nav-item">
            <a class="nav-link" href="#!">{menu.menuName}</a>
          </li>
        {:else}
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#!"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {menu.menuName}
            </a>
            <ul
              on:keydown={()=>{}}
              class="dropdown-menu"
              data-bs-scroll="true"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              data-bs-expanded="false"
              role="menu"
              on:click={toggleSubmenu}
            >
              {#each menu.subMenu as submenu}
                {#if typeof submenu === 'string'}
                  <li>
                    <a class="dropdown-item" href="#">{submenu}</a>
                  </li>
                {:else}
                  <li class="dropdown-submenu">
                    <a
                      class="dropdown-item dropdown-toggle"
                      href="#!"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {submenu.menuItem}
                    </a>
                    <ul
                      on:keydown={()=>{}}
                      class="dropdown-menu"
                      data-bs-scroll="true"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      data-bs-expanded="false"
                      role="menu"
                      on:click={toggleSubmenu}
                   
                      >
                      {#each submenu.itemsSubmenu as item}
                        <li>
                          <a class="dropdown-item" href="#!">{item}</a>
                        </li>
                      {/each}
                    </ul>
                  </li>
                {/if}
              {/each}
            </ul>
          </li>
        {/if}
      {/each}
    </ul>
  </div>
</nav> 