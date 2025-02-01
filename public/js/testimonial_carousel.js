const track = document.querySelector(".carousel_track");
const cards = Array.from(track.children);
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");
let currentIndex = 0;

const updateCards = () => {
  const cardWidth =
    cards[0].offsetWidth + parseFloat(getComputedStyle(track).gap);

  const translateX = -(currentIndex * cardWidth);
  track.style.transform = `translateX(${translateX}px)`;

  cards.forEach((card, index) => {
    const offset = index - currentIndex;

    if (window.innerWidth > 850) {
      if (offset === 2) {
        card.style.transform = "scale(1.3)";
        card.style.zIndex = 5;
      } else if (offset === 1 || offset === 3) {
        card.style.transform = "scale(1.15)";
        card.style.zIndex = 3;
      } else {
        card.style.transform = "scale(1)";
        card.style.zIndex = 1;
      }
    } else {
      if (offset === 1) {
        card.style.transform = "scale(2)";
        card.style.zIndex = 5;
      } else if (offset === 0 || offset === 2) {
        card.style.transform = "scale(1.5)";
        card.style.zIndex = 3;
      } else {
        card.style.transform = "scale(1)";
        card.style.zIndex = 1;
      }
    }
  });
};

cards.forEach((card, index) => {
  card.addEventListener("click", () => {
    if (window.innerWidth > 850) {
      currentIndex = index - 2;
    } else {
      currentIndex = index - 1;
    }
    updateCards();
  });
});

const moveRight = () => {
  if (window.innerWidth > 850) {
    if (currentIndex < cards.length - 3) {
      currentIndex++;
    }
  } else {
    if (currentIndex < cards.length - 2) {
      currentIndex++;
    }
  }
  updateCards();
};

const moveLeft = () => {
  if (window.innerWidth > 850) {
    if (currentIndex > -2) {
      currentIndex--;
    }
  } else {
    if (currentIndex > -1) {
      currentIndex--;
    }
  }
  updateCards();
};
rightArrow.addEventListener("click", moveRight);
leftArrow.addEventListener("click", moveLeft);

// HANDLE TOUCH EVENTS

let touchStartX = 0;
let touchEndX = 0;

track.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
});

track.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].clientX;

  const swipeDistance = touchEndX - touchStartX;

  if (swipeDistance > 50) {
    moveLeft();
  } else if (swipeDistance < -50) {
    moveRight();
  }
});

// Initial setup
updateCards();
