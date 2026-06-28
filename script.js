const CHAR_LIMIT = 280;

const likeButtons = document.querySelectorAll(".like-button");

function initLikeButton(button) {
  button.addEventListener("click", () => {
    const container = button.parentElement;
    const countElement = container.querySelector(".like-count");

    let count = parseInt(countElement.textContent, 10);

    if (!button.classList.contains("liked")) {
      count++;
      button.classList.add("liked");
      button.src = "./assets/post-icons/liked.svg";
    } else {
      count--;
      button.classList.remove("liked");
      button.src = "./assets/post-icons/like.svg";
    }

    countElement.textContent = count;
  });
}

likeButtons.forEach(initLikeButton);

const openComposeBtns = document.querySelectorAll(
  "#open-compose-modal, #open-compose-modal-small"
);
const closeComposeBtn = document.getElementById("close-compose-modal");
const composeOverlay = document.getElementById("compose-modal-overlay");
const composeTextarea = document.getElementById("compose-textarea");
const charCounter = document.getElementById("char-counter");
const composeSubmit = document.getElementById("compose-submit");
const timeline = document.getElementById("timeline");

function openComposeModal() {
  composeOverlay.hidden = false;
  composeTextarea.value = "";
  updateCharCounter();
  composeTextarea.focus();
}

function closeComposeModal() {
  composeOverlay.hidden = true;
  composeTextarea.value = "";
  updateCharCounter();
}

function updateCharCounter() {
  const length = composeTextarea.value.length;
  const remaining = CHAR_LIMIT - length;

  charCounter.textContent = remaining;
  charCounter.classList.remove("char-counter-warning", "char-counter-over");

  if (remaining <= 20 && remaining > 0) {
    charCounter.classList.add("char-counter-warning");
  } else if (remaining <= 0) {
    charCounter.classList.add("char-counter-over");
  }

  composeSubmit.disabled = length === 0 || length > CHAR_LIMIT;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function createTweetElement(text) {
  const post = document.createElement("div");
  post.className = "posts";
  post.innerHTML = `
    <div class="posts-top">
      <div class="poster-profile">
        <img src="./assets/navbar-icons/Photo.jpg" alt="poster profile icon" />
      </div>
      <div class="poster-post">
        <div class="poster-name">
          <div class="poster-name-info">
            <h4 class="creator-name">Devon Lotter</h4>
            <h4>@fervantech</h4>
            <h4 class="meta-dot">·</h4>
            <h4>now</h4>
          </div>
          <div class="poster-settings">
            <img src="./assets/posting-area-icons/generate-image.svg" alt="Explain this post" />
            <img src="./assets/posting-area-icons/more.settings.svg" alt="More" />
          </div>
        </div>
        <div class="poster-content">
          <h4>${escapeHtml(text)}</h4>
        </div>
      </div>
    </div>
    <div class="posts-bottom">
      <div class="post-interactions">
        <div class="post-interactions-left">
          <div>
            <img src="./assets/post-icons/comment.svg" alt="comment">
            <h6>0</h6>
          </div>
          <div>
            <img src="./assets/post-icons/repost.svg" alt="repost">
            <h6>0</h6>
          </div>
          <div class="like-container">
            <img class="like-button" src="./assets/post-icons/like.svg" alt="like">
            <h6 class="like-count">0</h6>
          </div>
          <div>
            <img src="./assets/post-icons/view.svg" alt="view">
            <h6>0</h6>
          </div>
        </div>
        <div class="post-interactions-right">
          <img src="./assets/post-icons/bookmark.svg" alt="bookmark">
          <img src="./assets/post-icons/share.svg" alt="share">
        </div>
      </div>
    </div>
  `;

  const newLikeButton = post.querySelector(".like-button");
  initLikeButton(newLikeButton);

  return post;
}

function submitTweet() {
  const text = composeTextarea.value.trim();
  if (!text || text.length > CHAR_LIMIT || !timeline) return;

  const tweet = createTweetElement(text);
  timeline.insertBefore(tweet, timeline.firstChild);
  closeComposeModal();
}

openComposeBtns.forEach((btn) => {
  btn.addEventListener("click", openComposeModal);
});
closeComposeBtn.addEventListener("click", closeComposeModal);

composeOverlay.addEventListener("click", (event) => {
  if (event.target === composeOverlay) {
    closeComposeModal();
  }
});

composeTextarea.addEventListener("input", updateCharCounter);
composeSubmit.addEventListener("click", submitTweet);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !composeOverlay.hidden) {
    closeComposeModal();
  }
});
