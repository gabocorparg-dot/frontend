// ==== USUARIOS DE PRUEBA ====
const users = [
  { email: "admin@colegio.edu", password: "admin123", rol: "admin", nombre: "Administrador" },
  { email: "profe@colegio.edu", password: "prof123", rol: "profesor", nombre: "Profesor Juan" },
  { email: "alumno@colegio.edu", password: "alum123", rol: "alumno", nombre: "María Pérez" }
];

// ==== LOGIN (index.html) ====
if (document.getElementById("login-btn")) {
  const loginBtn = document.getElementById("login-btn");
  const loginError = document.getElementById("login-error");

  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "boletin.html";
    } else {
      loginError.textContent = "Correo o contraseña incorrectos.";
    }
  });
}

// ==== PANEL DEL ALUMNO/PROFESOR (boletin.html) ====

if (document.getElementById("user-name")) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const userNameEl = document.getElementById("user-name");
  const logoutBtn = document.getElementById("logout-btn");

  if (!userData) {
    window.location.href = "index.html";
  } else {
    userNameEl.textContent = userData.nombre;
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });

  // Si el usuario es profesor, habilitar edición
  if (userData && userData.rol === "profesor") {
    document.querySelectorAll("#boletin-excel td:not(:first-child)").forEach(td => {
      td.contentEditable = "true";
    });
  }
}
// ==== CONTROL DE PESTAÑAS ====
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-tab");
    tabButtons.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

// ==== CARGA Y EDICIÓN DE DATOS DE USUARIO ====
const userData = JSON.parse(localStorage.getItem("user"));
if (userData && document.getElementById("nombre-usuario")) {
  document.getElementById("nombre-usuario").value = userData.nombre;
  document.getElementById("correo-usuario").value = userData.email;
  document.getElementById("clave-usuario").value = userData.password;

  document.getElementById("guardar-datos").addEventListener("click", () => {
    userData.nombre = document.getElementById("nombre-usuario").value;
    userData.email = document.getElementById("correo-usuario").value;
    userData.password = document.getElementById("clave-usuario").value;
    localStorage.setItem("user", JSON.stringify(userData));
    alert("✅ Datos guardados correctamente.");
  });
}

// ==== Datos iniciales de prueba ====
// Si no existe "users" en localStorage, se crea con usuarios de ejemplo.
if (!localStorage.getItem("users")) {
  const seedUsers = [
    { email: "admin@colegio.edu", password: "admin123", rol: "admin", nombre: "Administrador" },
    { email: "profe@colegio.edu", password: "prof123", rol: "profesor", nombre: "Profesor Juan" },
    { email: "alumno@colegio.edu", password: "alum123", rol: "alumno", nombre: "María Pérez" }
  ];
  localStorage.setItem("users", JSON.stringify(seedUsers));
}

// Inicializar boletines básicos si no existen
if (!localStorage.getItem("boletines")) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const materias = [
    "Matemáticas",
    "Inglés Técnico",
    "Marco Jurídico y Derechos del Trabajador",
    "Asistencia 2",
    "Hardware 4",
    "Prácticas Profesionalizantes 2",
    "Programación 4",
    "Redes 3"
  ];
  const boletines = {};
  users.forEach(u => {
    if (u.rol === "alumno") {
      boletines[u.email] = materias.map(m => ({
        materia: m,
        inf1: "",
        inf2: "",
        cuat1: "",
        inf1_2c: "",
        inf2_2c: "",
        cuat2: "",
        recDic: "",
        recFeb: "",
        notaFinal: ""
      }));
    }
  });
  localStorage.setItem("boletines", JSON.stringify(boletines));
}

// Utilidades
function getUsers() { return JSON.parse(localStorage.getItem("users") || "[]"); }
function setUsers(u){ localStorage.setItem("users", JSON.stringify(u)); }
function getBoletines(){ return JSON.parse(localStorage.getItem("boletines") || "{}"); }
function setBoletines(b){ localStorage.setItem("boletines", JSON.stringify(b)); }
function saveUserSession(user){ localStorage.setItem("user", JSON.stringify(user)); }
function clearUserSession(){ localStorage.removeItem("user"); }
function getUserSession(){ return JSON.parse(localStorage.getItem("user") || "null"); }

// ===== LOGIN (index.html) =====
if (document.getElementById("login-btn")) {
  const loginBtn = document.getElementById("login-btn");
  const loginError = document.getElementById("login-error");

  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      saveUserSession(user);
      // Redirigir según rol
      if (user.rol === "admin") window.location.href = "panel-admin.html";
      else if (user.rol === "profesor") window.location.href = "panel-profesor.html";
      else window.location.href = "boletin.html";
    } else {
      loginError.textContent = "Correo o contraseña incorrectos.";
      setTimeout(()=> loginError.textContent = "", 4000);
    }
  });
}

// ===== FUNCIONES COMUNES: logout y nav name =====
const session = getUserSession();
if (session) {
  // Nombre en cabeceras de cada panel si existe
  const nameEls = [
    document.getElementById("user-name"),
    document.getElementById("user-name-prof"),
    document.getElementById("user-name-admin")
  ];
  nameEls.forEach(el => { if (el) el.textContent = session.nombre; });

  // Logout buttons
  const lbtns = [
    document.getElementById("logout-btn"),
    document.getElementById("logout-btn-prof"),
    document.getElementById("logout-btn-admin")
  ];
  lbtns.forEach(b => {
    if (b) b.addEventListener("click", () => {
      clearUserSession();
      window.location.href = "index.html";
    });
  });
} else {
  // Si la página requiere sesión, redirigir al login
  const protectedPages = ["boletin.html", "panel-profesor.html", "panel-admin.html"];
  const path = window.location.pathname.split("/").pop();
  if (protectedPages.includes(path)) {
    window.location.href = "index.html";
  }
}

// ===== TAB SWITCH (boletin alumno) =====
document.querySelectorAll && document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-tab");
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

// ===== PROCESOS DEL PANEL ALUMNO (boletin.html) =====
if (document.getElementById("boletin-body")) {
  const user = getUserSession();
  if (!user || user.rol !== "alumno") {
    window.location.href = "index.html";
  } else {
    const boletines = getBoletines();
    const myBoletin = boletines[user.email] || [];
    const tbody = document.getElementById("boletin-body");

    function renderAlumnoBoletin() {
      tbody.innerHTML = "";
      myBoletin.forEach((row, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="mat">${row.materia}</td>
          <td contenteditable="true" data-field="inf1" data-idx="${idx}">${row.inf1}</td>
          <td contenteditable="true" data-field="inf2" data-idx="${idx}">${row.inf2}</td>
          <td contenteditable="true" data-field="cuat1" data-idx="${idx}">${row.cuat1}</td>
          <td contenteditable="true" data-field="inf1_2c" data-idx="${idx}">${row.inf1_2c}</td>
          <td contenteditable="true" data-field="inf2_2c" data-idx="${idx}">${row.inf2_2c}</td>
          <td contenteditable="true" data-field="cuat2" data-idx="${idx}">${row.cuat2}</td>
          <td contenteditable="true" data-field="recDic" data-idx="${idx}">${row.recDic}</td>
          <td contenteditable="true" data-field="recFeb" data-idx="${idx}">${row.recFeb}</td>
          <td contenteditable="true" data-field="notaFinal" data-idx="${idx}">${row.notaFinal}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    renderAlumnoBoletin();

    // Guardar datos al presionar "Guardar cambios" en Mis Datos
    if (document.getElementById("guardar-datos")) {
      document.getElementById("nombre-usuario").value = user.nombre;
      document.getElementById("correo-usuario").value = user.email;
      document.getElementById("clave-usuario").value = user.password;

      document.getElementById("guardar-datos").addEventListener("click", () => {
        const users = getUsers();
        const idx = users.findIndex(u => u.email === user.email);
        if (idx >= 0) {
          users[idx].nombre = document.getElementById("nombre-usuario").value.trim();
          users[idx].email = document.getElementById("correo-usuario").value.trim();
          users[idx].password = document.getElementById("clave-usuario").value.trim();
          setUsers(users);
          // update session
          const newUser = users[idx];
          saveUserSession(newUser);
          alert("✅ Datos guardados correctamente.");
        }
      });
    }

    // Auto-guardar cambios de celdas en localStorage cuando cambian (evento blur)
    tbody.addEventListener("input", (e) => {
      const td = e.target.closest("td");
      if (!td) return;
      const field = td.getAttribute("data-field");
      const idx = td.getAttribute("data-idx");
      if (field != null && idx != null) {
        myBoletin[idx][field] = td.textContent.trim();
      }
    });

    // Guardar boletín explícito al salir de la página o en evento
    window.addEventListener("beforeunload", () => {
      const allBoletines = getBoletines();
      allBoletines[user.email] = myBoletin;
      setBoletines(allBoletines);
    });
  }
}

// ===== PANEL PROFESOR (panel-profesor.html) =====
if (document.getElementById("buscar-alumno")) {
  const user = getUserSession();
  if (!user || user.rol !== "profesor") {
    window.location.href = "index.html";
  } else {
    const buscarInput = document.getElementById("buscar-alumno");
    const listaAlumnos = document.getElementById("lista-alumnos");
    const profBoletinBody = document.getElementById("prof-boletin-body");
    const profAlumnoNombre = document.getElementById("prof-alumno-nombre");
    let selectedEmail = null;

    function renderAlumnoList(filter="") {
      const users = getUsers().filter(u => u.rol === "alumno");
      listaAlumnos.innerHTML = "";
      users.filter(u => (u.nombre + " " + u.email).toLowerCase().includes(filter.toLowerCase()))
        .forEach(u => {
          const d = document.createElement("div");
          d.className = "lista-item";
          d.innerHTML = `<strong>${u.nombre}</strong><div class="muted">${u.email}</div>`;
          d.addEventListener("click", () => {
            selectAlumno(u.email);
          });
          listaAlumnos.appendChild(d);
        });
    }

    function selectAlumno(email) {
      selectedEmail = email;
      const users = getUsers();
      const u = users.find(x => x.email === email);
      profAlumnoNombre.textContent = u ? `${u.nombre} — ${u.email}` : "Alumno seleccionado";
      renderProfBoletin(email);
    }

    function renderProfBoletin(email) {
      profBoletinBody.innerHTML = "";
      const boletines = getBoletines();
      const b = boletines[email] || [];
      b.forEach((row, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="mat">${row.materia}</td>
          <td contenteditable="true" data-field="inf1" data-idx="${idx}">${row.inf1}</td>
          <td contenteditable="true" data-field="inf2" data-idx="${idx}">${row.inf2}</td>
          <td contenteditable="true" data-field="cuat1" data-idx="${idx}">${row.cuat1}</td>
          <td contenteditable="true" data-field="inf1_2c" data-idx="${idx}">${row.inf1_2c}</td>
          <td contenteditable="true" data-field="inf2_2c" data-idx="${idx}">${row.inf2_2c}</td>
          <td contenteditable="true" data-field="cuat2" data-idx="${idx}">${row.cuat2}</td>
          <td contenteditable="true" data-field="recDic" data-idx="${idx}">${row.recDic}</td>
          <td contenteditable="true" data-field="recFeb" data-idx="${idx}">${row.recFeb}</td>
          <td contenteditable="true" data-field="notaFinal" data-idx="${idx}">${row.notaFinal}</td>
        `;
        profBoletinBody.appendChild(tr);
      });
    }

    // Buscar alumnos
    buscarInput.addEventListener("input", (e) => {
      renderAlumnoList(e.target.value);
    });

    // Guardar cambios al click
    document.getElementById("guardar-boletin-prof").addEventListener("click", () => {
      if (!selectedEmail) return alert("Seleccioná un alumno primero.");
      const boletines = getBoletines();
      const rows = Array.from(profBoletinBody.querySelectorAll("tr"));
      const newData = rows.map((tr, idx) => {
        const cells = tr.querySelectorAll("td");
        return {
          materia: cells[0].textContent.trim(),
          inf1: cells[1].textContent.trim(),
          inf2: cells[2].textContent.trim(),
          cuat1: cells[3].textContent.trim(),
          inf1_2c: cells[4].textContent.trim(),
          inf2_2c: cells[5].textContent.trim(),
          cuat2: cells[6].textContent.trim(),
          recDic: cells[7].textContent.trim(),
          recFeb: cells[8].textContent.trim(),
          notaFinal: cells[9].textContent.trim()
        };
      });
      boletines[selectedEmail] = newData;
      setBoletines(boletines);
      alert("✅ Notas guardadas correctamente.");
    });

    // Inicial
    renderAlumnoList();
  }
}

// ===== PANEL ADMIN (panel-admin.html) =====
if (document.getElementById("admin-user-list")) {
  const user = getUserSession();
  if (!user || user.rol !== "admin") {
    window.location.href = "index.html";
  } else {
    const userListDiv = document.getElementById("admin-user-list");
    const form = {
      nombre: document.getElementById("admin-nombre"),
      email: document.getElementById("admin-email"),
      password: document.getElementById("admin-password"),
      rol: document.getElementById("admin-rol")
    };
    let editingEmail = null;

    function renderUserList() {
      const users = getUsers();
      userListDiv.innerHTML = "";
      users.forEach(u => {
        const el = document.createElement("div");
        el.className = "admin-user-item";
        el.innerHTML = `<strong>${u.nombre}</strong> <span class="muted">${u.email}</span> <small class="badge">${u.rol}</small>
          <div class="admin-user-actions">
            <button class="btn-edit" data-email="${u.email}">Editar</button>
            <button class="btn-boletin" data-email="${u.email}">Boletín</button>
          </div>`;
        userListDiv.appendChild(el);
      });

      // eventos
      userListDiv.querySelectorAll(".btn-edit").forEach(b => {
        b.addEventListener("click", (e) => {
          const email = e.target.getAttribute("data-email");
          const users = getUsers();
          const u = users.find(x => x.email === email);
          if (u) {
            editingEmail = email;
            form.nombre.value = u.nombre;
            form.email.value = u.email;
            form.password.value = u.password;
            form.rol.value = u.rol;
          }
        });
      });

      userListDiv.querySelectorAll(".btn-boletin").forEach(b => {
        b.addEventListener("click", (e) => {
          const email = e.target.getAttribute("data-email");
          loadAdminBoletin(email);
        });
      });
    }

    // Crear nuevo usuario
    document.getElementById("btn-nuevo-usuario").addEventListener("click", () => {
      editingEmail = null;
      form.nombre.value = "";
      form.email.value = "";
      form.password.value = "";
      form.rol.value = "alumno";
    });

    // Guardar usuario (nuevo o editar)
    document.getElementById("admin-guardar").addEventListener("click", () => {
      const users = getUsers();
      const nombre = form.nombre.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value.trim();
      const rol = form.rol.value;

      if (!nombre || !email || !password) return alert("Completá todos los campos.");

      if (editingEmail) {
        // editar
        const idx = users.findIndex(u => u.email === editingEmail);
        if (idx >= 0) {
          users[idx].nombre = nombre;
          // Si cambió el email, actualizar boletines key
          if (editingEmail !== email) {
            const boletines = getBoletines();
            boletines[email] = boletines[editingEmail] || [];
            delete boletines[editingEmail];
            setBoletines(boletines);
            users[idx].email = email;
          }
          users[idx].password = password;
          users[idx].rol = rol;
          setUsers(users);
          renderUserList();
          alert("✅ Usuario actualizado.");
          editingEmail = null;
          form.nombre.value = form.email.value = form.password.value = "";
        }
      } else {
        // nuevo
        if (users.some(u => u.email === email)) return alert("Ya existe un usuario con ese email.");
        users.push({ nombre, email, password, rol });
        // si es alumno, crear boletín vacío
        if (rol === "alumno") {
          const boletines = getBoletines();
          const materias = [
            "Matemáticas",
            "Inglés Técnico",
            "Marco Jurídico y Derechos del Trabajador",
            "Asistencia 2",
            "Hardware 4",
            "Prácticas Profesionalizantes 2",
            "Programación 4",
            "Redes 3"
          ];
          boletines[email] = materias.map(m => ({
            materia: m, inf1: "", inf2: "", cuat1: "", inf1_2c: "", inf2_2c: "", cuat2: "", recDic: "", recFeb: "", notaFinal: ""
          }));
          setBoletines(boletines);
        }
        setUsers(users);
        renderUserList();
        alert("✅ Usuario creado.");
        form.nombre.value = form.email.value = form.password.value = "";
      }
    });

    // Eliminar usuario
    document.getElementById("admin-eliminar").addEventListener("click", () => {
      if (!editingEmail) return alert("Seleccioná un usuario para eliminar.");
      if (!confirm("¿Eliminar usuario seleccionado? Esta acción es irreversible.")) return;
      let users = getUsers();
      users = users.filter(u => u.email !== editingEmail);
      setUsers(users);
      const boletines = getBoletines();
      delete boletines[editingEmail];
      setBoletines(boletines);
      editingEmail = null;
      form.nombre.value = form.email.value = form.password.value = "";
      renderUserList();
      alert("✅ Usuario eliminado.");
    });

    // Cargar boletín para edición por admin
    function loadAdminBoletin(email) {
      document.getElementById("admin-boletin-body").innerHTML = "";
      const boletines = getBoletines();
      const b = boletines[email] || [];
      const tbody = document.getElementById("admin-boletin-body");
      b.forEach((row, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="mat">${row.materia}</td>
          <td contenteditable="true" data-field="inf1" data-idx="${idx}">${row.inf1}</td>
          <td contenteditable="true" data-field="inf2" data-idx="${idx}">${row.inf2}</td>
          <td contenteditable="true" data-field="cuat1" data-idx="${idx}">${row.cuat1}</td>
          <td contenteditable="true" data-field="inf1_2c" data-idx="${idx}">${row.inf1_2c}</td>
          <td contenteditable="true" data-field="inf2_2c" data-idx="${idx}">${row.inf2_2c}</td>
          <td contenteditable="true" data-field="cuat2" data-idx="${idx}">${row.cuat2}</td>
          <td contenteditable="true" data-field="recDic" data-idx="${idx}">${row.recDic}</td>
          <td contenteditable="true" data-field="recFeb" data-idx="${idx}">${row.recFeb}</td>
          <td contenteditable="true" data-field="notaFinal" data-idx="${idx}">${row.notaFinal}</td>
        `;
        tbody.appendChild(tr);
      });
      // guardar referencia del usuario actual en un atributo
      document.getElementById("admin-guardar-boletin").setAttribute("data-email", email);
    }

    // Guardar boletín admin
    document.getElementById("admin-guardar-boletin").addEventListener("click", () => {
      const email = document.getElementById("admin-guardar-boletin").getAttribute("data-email");
      if (!email) return alert("Seleccioná el boletín de un usuario en la lista.");
      const rows = Array.from(document.querySelectorAll("#admin-boletin-body tr"));
      const newData = rows.map(tr => {
        const cells = tr.querySelectorAll("td");
        return {
          materia: cells[0].textContent.trim(),
          inf1: cells[1].textContent.trim(),
          inf2: cells[2].textContent.trim(),
          cuat1: cells[3].textContent.trim(),
          inf1_2c: cells[4].textContent.trim(),
          inf2_2c: cells[5].textContent.trim(),
          cuat2: cells[6].textContent.trim(),
          recDic: cells[7].textContent.trim(),
          recFeb: cells[8].textContent.trim(),
          notaFinal: cells[9].textContent.trim()
        };
      });
      const boletines = getBoletines();
      boletines[email] = newData;
      setBoletines(boletines);
      alert("✅ Boletín guardado.");
    });

    // inicial
    renderUserList();
  }
}

