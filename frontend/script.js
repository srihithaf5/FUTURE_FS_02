// LOGIN PROTECTION
if (sessionStorage.getItem("loggedIn") !== "true") {
  window.location = "login.html";
}

const API = "http://localhost:5000/api/leads";

const leadForm = document.getElementById("leadForm");
const leadList = document.getElementById("leadList");

// FETCH LEADS
async function fetchLeads() {
  try {
    const response = await fetch(API);
    let leads = await response.json();

    updateStats(leads);

    // SEARCH
    const searchInput =
      document.getElementById("search").value.toLowerCase();

    leads = leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchInput) ||
        lead.email.toLowerCase().includes(searchInput) ||
        lead.source.toLowerCase().includes(searchInput)
    );

    // FILTER
    const filterStatus =
      document.getElementById("filterStatus").value;

    if (filterStatus !== "all") {
      leads = leads.filter(
        (lead) => lead.status === filterStatus
      );
    }

    leadList.innerHTML = "";

    leads.forEach((lead) => {

      let badgeColor = "#3b82f6";

      if (lead.status === "contacted") {
        badgeColor = "#f59e0b";
      }

      if (lead.status === "converted") {
        badgeColor = "#22c55e";
      }

      leadList.innerHTML += `
      
      <div class="lead">

        <h3>${lead.name}</h3>

        <p>
          <strong>Email:</strong>
          ${lead.email}
        </p>

        <p>
          <strong>Source:</strong>
          ${lead.source}
        </p>

        <p>
          <strong>Status:</strong>

          <span
          style="
          background:${badgeColor};
          color:white;
          padding:5px 12px;
          border-radius:20px;
          ">
          ${lead.status}
          </span>

        </p>

        <p>
          <strong>Follow-up:</strong>
          ${
            lead.followup_date
              ? lead.followup_date.split("T")[0]
              : "Not Set"
          }
        </p>

        <br>

        <select id="status-${lead.id}">

          <option value="new"
          ${lead.status === "new" ? "selected" : ""}>
          New
          </option>

          <option value="contacted"
          ${lead.status === "contacted" ? "selected" : ""}>
          Contacted
          </option>

          <option value="converted"
          ${lead.status === "converted" ? "selected" : ""}>
          Converted
          </option>

        </select>

        <br><br>

        <input
        type="date"
        id="followup-${lead.id}"
        value="${
          lead.followup_date
            ? lead.followup_date.split("T")[0]
            : ""
        }">

        <br><br>

        <input
        type="text"
        id="notes-${lead.id}"
        placeholder="Notes"
        value="${lead.notes || ""}">

        <br><br>

        <button onclick="updateLead(${lead.id})">
          Save
        </button>

        <button onclick="deleteLead(${lead.id})">
          Delete
        </button>

      </div>
      `;
    });

  } catch (error) {
    console.log(error);
  }
}

// ADD LEAD
leadForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const lead = {

    name:
    document.getElementById("name").value,

    email:
    document.getElementById("email").value,

    source:
    document.getElementById("source").value,

    followup_date:
    document.getElementById("followup_date").value

  };

  await fetch(API, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(lead)

  });

  alert("✅ Lead Added Successfully");

  leadForm.reset();

  fetchLeads();

});

// UPDATE LEAD
async function updateLead(id) {

  const status =
    document.getElementById(`status-${id}`).value;

  const notes =
    document.getElementById(`notes-${id}`).value;

  const followup_date =
    document.getElementById(`followup-${id}`).value;

  await fetch(`${API}/${id}`, {

    method: "PUT",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      status,
      notes,
      followup_date
    })

  });

  alert("✅ Lead Updated Successfully");

  fetchLeads();

}

// DELETE LEAD
async function deleteLead(id) {

  const confirmDelete =
    confirm("Delete this lead?");

  if (!confirmDelete) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  alert("🗑️ Lead Deleted");

  fetchLeads();

}

// DASHBOARD STATS
function updateStats(leads) {

  document.getElementById("totalLeads").textContent =
    leads.length;

  document.getElementById("newLeads").textContent =
    leads.filter(
      lead => lead.status === "new"
    ).length;

  document.getElementById("contactedLeads").textContent =
    leads.filter(
      lead => lead.status === "contacted"
    ).length;

  document.getElementById("convertedLeads").textContent =
    leads.filter(
      lead => lead.status === "converted"
    ).length;

}

// SEARCH
document
.getElementById("search")
.addEventListener(
  "keyup",
  fetchLeads
);

// FILTER
document
.getElementById("filterStatus")
.addEventListener(
  "change",
  fetchLeads
);

// DARK MODE
document
.getElementById("darkModeBtn")
.addEventListener(
  "click",
  () => {
    document.body.classList.toggle("dark");
  }
);

// LOGOUT FUNCTION
function logout() {

  sessionStorage.removeItem(
    "loggedIn"
  );

  window.location =
  "login.html";

}

// INITIAL LOAD
fetchLeads();