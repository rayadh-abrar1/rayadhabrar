'use strict';

const reviewForm = document.querySelector('#review-form');
const reviewText = document.querySelector('#review-text');
const reviewStatus = document.querySelector('#review-status');

reviewText.addEventListener('input', () => {
  reviewText.setCustomValidity('');
});

reviewForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const feedback = reviewText.value.trim();
  if (!feedback) {
    reviewText.setCustomValidity('Please enter your feedback.');
    reviewText.reportValidity();
    return;
  }

  const rating = new FormData(reviewForm).get('rating');
  const subject = encodeURIComponent('Tutoring review');
  const body = encodeURIComponent(`Rating: ${rating}/5\r\n\r\nFeedback:\r\n${feedback}`);
  const email = reviewForm.dataset.email;

  reviewStatus.textContent = `Send the draft from your email app. If it does not open, email your rating and feedback to ${email}.`;
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
});

// Average the published reviews and show the rating summary.
const reviewCards = [...document.querySelectorAll('.review-card[data-rating]')];
const ratingAverage = document.querySelector('#rating-average');
if (reviewCards.length && ratingAverage) {
  const total = reviewCards.reduce((sum, card) => sum + Number(card.dataset.rating), 0);
  const average = (total / reviewCards.length).toFixed(1);
  ratingAverage.textContent = `${average} out of 5 from ${reviewCards.length} review${reviewCards.length === 1 ? '' : 's'}`;
  document.querySelector('.review-empty')?.remove();
}
