'use strict';

const reviewForm = document.querySelector('#review-form');
const reviewText = document.querySelector('#review-text');
const reviewStatus = document.querySelector('#review-status');
const reviewList = document.querySelector('#review-list');
const ratingAverage = document.querySelector('#rating-average');

function stars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function addReviewCard(review) {
  const card = document.createElement('article');
  card.className = 'review-card';
  card.dataset.rating = String(review.rating);
  const starLine = document.createElement('p');
  starLine.className = 'review-stars';
  starLine.setAttribute('aria-label', `${review.rating} out of 5 stars`);
  starLine.textContent = stars(review.rating);
  const quote = document.createElement('blockquote');
  const text = document.createElement('p');
  text.textContent = review.text;
  quote.append(text);
  card.append(starLine, quote);
  const by = [review.name, review.about].filter(Boolean).join(' · ');
  if (by) {
    const byLine = document.createElement('p');
    byLine.className = 'review-by';
    byLine.textContent = by;
    card.append(byLine);
  }
  reviewList.append(card);
}

// Average the reviews on the page and show the rating summary.
function updateSummary() {
  const cards = [...document.querySelectorAll('.review-card[data-rating]')];
  if (!cards.length || !ratingAverage) return;
  const total = cards.reduce((sum, card) => sum + Number(card.dataset.rating), 0);
  const average = (total / cards.length).toFixed(1);
  ratingAverage.textContent = `${average} out of 5 from ${cards.length} review${cards.length === 1 ? '' : 's'}`;
}

// Load approved reviews from the site's API (available on Cloudflare Pages).
async function loadReviews() {
  try {
    const response = await fetch('/api/reviews', { headers: { accept: 'application/json' } });
    if (!response.ok) return;
    const data = await response.json();
    (data.reviews || []).forEach(addReviewCard);
  } catch {
    // No API on this host: the reviews written into the page still show.
  } finally {
    updateSummary();
  }
}

function emailFallback(rating, feedback) {
  const email = reviewForm.dataset.email;
  const subject = encodeURIComponent('Tutoring review');
  const body = encodeURIComponent(`Rating: ${rating}/5\r\n\r\nFeedback:\r\n${feedback}`);
  reviewStatus.textContent = `Send the draft from your email app. If it does not open, email your rating and feedback to ${email}.`;
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

reviewText.addEventListener('input', () => reviewText.setCustomValidity(''));

reviewForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const feedback = reviewText.value.trim();
  if (!feedback) {
    reviewText.setCustomValidity('Please enter your feedback.');
    reviewText.reportValidity();
    return;
  }
  const form = new FormData(reviewForm);
  const rating = Number(form.get('rating'));
  const button = reviewForm.querySelector('button[type="submit"]');
  button.disabled = true;
  reviewStatus.textContent = 'Sending…';
  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        rating,
        text: feedback,
        name: String(form.get('name') || '').trim(),
        about: String(form.get('about') || '').trim(),
        website: String(form.get('website') || ''),
      }),
    });
    if (response.status === 404 || response.status === 405) {
      emailFallback(rating, feedback);
      return;
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      reviewStatus.textContent = data.error || 'Something went wrong. Please try again later.';
      return;
    }
    reviewForm.reset();
    reviewStatus.textContent = 'Thank you! Your review will appear here once it has been approved.';
  } catch {
    emailFallback(rating, feedback);
  } finally {
    button.disabled = false;
  }
});

loadReviews();
