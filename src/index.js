const BASE_URL = "http://localhost:3000/profiles";
const dataTableBody = document.querySelector("#profiles-table-body");
const dataCreateForm = document.querySelector("#create-data-form");
const showCreateModal = document.querySelector("#show-create-modal");
const createDataSubmitBtn = document.querySelector("#create-data-submit-btn");
const editDataSubmitBtn = document.querySelector("#edit-data-submit-btn");
const deleteSubmitBtn = document.querySelector("#delete-submit-btn");

const firstNameInput = dataCreateForm.querySelector("#first-name");
const lastNameInput = dataCreateForm.querySelector("#last-name");
const phoneNumberInput = dataCreateForm.querySelector("#phone-number");
const emailInput = dataCreateForm.querySelector("#email");

let editDataId;
let deleteDataId;

// Fetching data from api
const fetchData = async () => {
  const response = await fetch(BASE_URL);
  if (response.status !== 200) {
    return [];
  }
  const data = await response.json();
  return data;
}

const showEditModal = (data) => {
  createDataSubmitBtn.classList.add("d-none");
  editDataSubmitBtn.classList.remove("d-none");

  firstNameInput.value = data["firstName"];
  lastNameInput.value = data["lastName"];
  phoneNumberInput.value = data["phoneNumber"];
  emailInput.value = data["email"];
  editDataId = data["id"];
}

// Creating row element dynamicly
const createRow = (data) => {
  const rowElement = document.createElement("tr");
  rowElement.id = data["id"];
  for (const key in data) {
    if (key !== "id") {
      const td = document.createElement("td");
      td.innerText = data[key];
      rowElement.append(td);
    }
  }
  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-primary btn-sm";
  editBtn.innerText = "Edit";
  editBtn.setAttribute("data-bs-toggle", "modal");
  editBtn.setAttribute("data-bs-target", "#form-modal");

  editBtn.addEventListener("click", () => {
    showEditModal(data);
  })

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger btn-sm ms-2";
  deleteBtn.innerText = "Delete";
  deleteBtn.setAttribute("data-bs-toggle", "modal");
  deleteBtn.setAttribute("data-bs-target", "#delete-modal");
  deleteBtn.addEventListener("click", () => {
    deleteDataId = data["id"];
  })

  const actionsTd = document.createElement("td");
  actionsTd.append(editBtn, deleteBtn);

  rowElement.appendChild(actionsTd);
  dataTableBody.append(rowElement);
}

// Fill data to table
const fillData = async () => {
  const data = await fetchData();
  data.forEach(dataElement => {
    createRow(dataElement);
  });
}

// Create data object
const createDataObject = () => {
  let id = String(Date.now());
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  const phoneNumber = phoneNumberInput.value;
  const email = emailInput.value;
  const dataObject = {
    id,
    firstName,
    lastName,
    phoneNumber,
    email
  }
  return dataObject;
}

// Post data Object to API
const postDataToApi = async (data) => {
  if (firstNameInput.value && lastNameInput.value && phoneNumberInput.value) {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify(data)
    });
    data = await response.json();
    createRow(data);
  }
}

const putEditDataToAPi = async (data) => {
  const editDataRow = dataTableBody.querySelector(`[id = "${editDataId}"]`);
  if (firstNameInput.value && lastNameInput.value && phoneNumberInput.value) {
    const response = await fetch(`${BASE_URL}/${editDataId}`, {
      method: "PUT",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      data = await response.json();
      editDataRow.children[0].innerText = data["firstName"];
      editDataRow.children[1].innerText = data["lastName"];
      editDataRow.children[2].innerText = data["phoneNumber"];
      editDataRow.children[3].innerText = data["email"];
      editDataRow.children[4].firstElementChild.addEventListener("click", () => {
        showEditModal(data);
      });
    }
  }
}

const deleteDataFromAPI = async (id) => {
  const deleteDataRow = dataTableBody.querySelector(`[id = "${id}"]`);
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "Application/json",
    }
  });
  if (response.ok) {
    deleteDataRow.remove();
  }
}

const checkInput = () => {
  if (firstNameInput.value && lastNameInput.value && phoneNumberInput.value) {
    editDataSubmitBtn.removeAttribute("disabled");
    createDataSubmitBtn.removeAttribute("disabled");
  }
}

fillData();

showCreateModal.addEventListener("click", () => {
  dataCreateForm.reset();
  createDataSubmitBtn.classList.remove("d-none");
  editDataSubmitBtn.classList.add("d-none");
});

createDataSubmitBtn.addEventListener("click", () => {
  const data = createDataObject();
  postDataToApi(data);
});

editDataSubmitBtn.addEventListener("click", () => {
  const data = createDataObject();
  putEditDataToAPi(data);
});

deleteSubmitBtn.addEventListener("click", () => {
  deleteDataFromAPI(deleteDataId);
});

firstNameInput.addEventListener("keyup", checkInput);
lastNameInput.addEventListener("keyup", checkInput);
phoneNumberInput.addEventListener("keyup", checkInput);