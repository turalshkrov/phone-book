const BASE_URL = "http://localhost:3000/profiles";
const profilesTableBody = document.querySelector("#profiles-table-body");
const profileForm = document.querySelector("#profile-form");

let id = 0;

const fetchData = async () => {
  const response = await fetch(BASE_URL);
  if (response.status !== 200) {
    return [];
  }
  const data = await response.json();
  id = data[data.length - 1]["id"] += 1;
  return data;
}
const createProfileRow = (profile) => {
  const profileRowElement = document.createElement("tr");
  for (const key in profile) {
    if (key !== "id") {
      const td = document.createElement("td");
      td.innerText = profile[key];
      profileRowElement.append(td);
    }
  }
  profileRowElement.innerHTML += `<td>
    <button class="btn btn-primary btn-sm">
      <i class="bi bi-pencil-square"></i>
    </button>
    <button class="btn btn-danger btn-sm">
      <i class="bi bi-trash-fill"></i>
    </button>
  </td>`
  profilesTableBody.append(profileRowElement);
}
const fillData = async () => {
  const peofiles = await fetchData();
  peofiles.forEach(profile => {
    createProfileRow(profile);
  });
}

const createProfile = () => {
  const firstName = profileForm.querySelector("#first-name").value;
  const lastName = profileForm.querySelector("#last-name").value;
  const phoneNumber = profileForm.querySelector("#phone-number").value;
  const email = profileForm.querySelector("#email").value;
  const profile = {
    id,
    firstName,
    lastName,
    phoneNumber,
    email
  }
  id += 1;
  return profile;
}

const postProfileToApi = async (profile) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "Application/json",
    },
    body: JSON.stringify(profile)
  });
  profile = await response.json();
  createProfileRow(profile);
}

fillData();
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const profile = createProfile();
  postProfileToApi(profile);
  profileForm.reset();
})