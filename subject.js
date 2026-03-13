const URL_HOST = "http://localhost:8000";

const cardColors = ["pale-gold-card", "purple-card", "dark-card", "blue-card"];

const addCardBtn = document.querySelector(".top-container button");
const cardsContainer = document.querySelector(".cards-container");

const getRandomCardColor = () => {
  const index = Math.floor(Math.random() * cardColors.length);
  return cardColors[index];
};

const initializeCard = (color) => `
            <div class="card create-card">
                <div class="inner-card ${color}">
                    <div>
                    <h4>Question</h4>
                    <textarea rows="4"></textarea>
                    <button class="question-done">Done</button>
                    </div>
                    <div>
                    <h4>Answer</h4>
                    <textarea rows="4"></textarea>
                    <button class="answer-done">Done</button>
                    </div>
                </div>
            </div>
`;

const createCardElement = (question, answer, color) => {
  return `
  <div class="card">
    <div class="inner-card ${color}">
      <div>
        <h4>Question</h4>
        <p>${question}</p>
      </div>
      <div>
        <h4>Answer</h4>
        <p class="answer">${answer}</p>
      </div>
    </div>
  </div>
  `;
};

let currentCardColor = getRandomCardColor();

addCardBtn.addEventListener("click", () => {
  const cardHTML = initializeCard(currentCardColor);

  cardsContainer.insertAdjacentHTML("beforeend", cardHTML);

  const cardElement = cardsContainer.lastElementChild;

  cardElement.querySelector(".inner-card > div > textarea").focus();

  currentCardColor = getRandomCardColor();
});

cardsContainer.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("question-done") ||
    e.target.classList.contains("answer-done")
  ) {
    const card = e.target.closest(".create-card");
    const textareas = card.querySelectorAll("textarea");

    const question = textareas[0].value.trim();
    const answer = textareas[1].value.trim();
    let data = {};

    if (question) {
      data["question"] = question;
      card.querySelector(".inner-card").style.transform = "rotateY(180deg)";
      card.querySelector(".inner-card > div:last-child > textarea").focus();
    }

    if (answer) {
      data.answer = answer;
      const color = card.querySelector(".inner-card").classList[1];
      const finalCard = createCardElement(question, answer, color);
      card.outerHTML = finalCard;
    }

    if (question && answer) console.log(data);
  }
});

function renderInitialCards() {
  cardsData.forEach((card) => {
    const color = getRandomCardColor();
    const element = createCardElement(card.question, card.answer, color);
    cardsContainer.insertAdjacentHTML("beforeend", element);
  });
}

renderInitialCards();

// ---------- Initialize Page -------------
window.addEventListener("DOMContentLoaded", function () {});

// TODO
// 1) add subjectId to URLSearchParams
// 2) using the URLSearchParams -> subjectId, and the question and answer, create a card in the backend
// 3) Load the cards on the frontend
