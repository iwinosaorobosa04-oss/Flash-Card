const URL_HOST = "https://flash-card-backend-ibve.onrender.com";

const fullNameSpan = document.getElementById("fullName");
const subjectsCount = document.getElementById("subjectsCount");
const cardsCount = document.getElementById("cardsCount");
const addSubjectBtn = document.querySelector(".add-btn");
const subjectsGrid = document.querySelector(".subjects-grid");

// Utility: Get auth token
function getAuthToken() {
  return localStorage.getItem("authToken");
}

// Create the "new subject" input card
function createNewSubjectInputCard() {
  const card = document.createElement("div");
  card.className = "subject-card new-subject-card";
  const textarea = document.createElement("textarea");
  textarea.placeholder = "Enter subject name...";
  textarea.rows = 1;

  textarea.addEventListener("keydown", async function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const name = textarea.value.trim();
      console.log(name);

      if (!name) return;
      textarea.disabled = true;
      try {
        const subject = await createSubject(name);
        const subjectCard = createSubjectCard(subject);
        card.replaceWith(subjectCard);
      } catch (err) {
        textarea.disabled = false;
        console.log("Failed to create subject.");
        console.error(err);
      }
    }
  });

  card.appendChild(textarea);
  return card;
}

// Create a subject card element
function createSubjectCard(subject) {
  const card = document.createElement("div");
  card.className = "subject-card";
  card.dataset.id = subject._id;
  card.dataset.name = subject.name;

  const h3 = document.createElement("h3");
  h3.textContent = subject.name;
  h3.contentEditable = "true";

  h3.addEventListener("keydown", async function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const newName = h3.textContent.trim();
      if (!newName) return;
      h3.blur();
      try {
        await updateSubject(subject._id, newName);
        h3.textContent = newName;
      } catch (err) {
        alert("Failed to update subject.");
        console.error(err);
      }
    }
  });

  const p = document.createElement("p");
  p.textContent = `Total cards: ${null}`;

  card.appendChild(h3);
  card.appendChild(p);
  return card;
}

// API: Create subject
async function createSubject(name) {
  const token = getAuthToken();
  const res = await fetch(`${URL_HOST}/api/subject/create-subject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Create subject failed");
  return res.json();
}

// API: Update subject
async function updateSubject(id, name) {
  const token = getAuthToken();
  const res = await fetch(`${URL_HOST}/api/subject/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Update subject failed");
  return res.json();
}

addSubjectBtn.addEventListener("click", function () {
  subjectsGrid.insertAdjacentElement("afterbegin", createNewSubjectInputCard());
});

window.addEventListener("DOMContentLoaded", async function () {
  const fullName = this.sessionStorage.getItem("name");
  const subjects = this.sessionStorage.getItem("subjects");
  const cards = this.sessionStorage.getItem("cards");

  fullNameSpan.textContent = fullName;
  subjectsCount.textContent = subjects.length;
  cardsCount.textContent = cards.length;

  await getStudentSubjects();
});

async function getStudentSubjects() {
  const token = getAuthToken();
  const subjectsRes = await fetch(`${URL_HOST}/api/subject/my-subjects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const subjects = await subjectsRes.json();

  subjects.forEach(async (subject) => {
    const subjectId = subject._id;

    const cardsRes = await fetch(
      `${URL_HOST}/api/card/subject-cards/${subjectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const cards = cardsRes.json();
    const subjectCard = `<div class="subject-card" data-id=${subjectId} data-name=${subject.name}>
              <h3>${subject.name}</h3>
              <p>Total cards: ${cards.length}</p>
            </div>`;

    subjectsGrid.insertAdjacentHTML("afterbegin", subjectCard);
  });
}
// TODO
// 1) Edit codes
// 2) Make the frontend and backend consistent
// 3) create delete card function
// 4) create edit card function
