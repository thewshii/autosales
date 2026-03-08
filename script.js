// ROI Calculator Logic
function calculateROI() {
  const calcVehicles = document.getElementById('calc-vehicles');
  const calcRevenue = document.getElementById('calc-revenue');
  const displayTotalTrips = document.getElementById('display-total-trips');
  const outRevenue = document.getElementById('out-revenue');
  const outCost = document.getElementById('out-cost');
  const outNet = document.getElementById('out-net');

  if (!calcVehicles || !calcRevenue) return;

  const vehicles = parseInt(calcVehicles.value) || 0;
  const revPerTrip = parseFloat(calcRevenue.value) || 0;
  
  // Benchmark: 13 trips per vehicle per week
  const totalWeeklyTrips = vehicles * 13;
  
  if (displayTotalTrips) displayTotalTrips.textContent = totalWeeklyTrips.toLocaleString();

  // Conservative Monthly Math (4 weeks)
  const totalMonthlyRevenue = totalWeeklyTrips * 4 * revPerTrip;
  const totalMonthlyCost = vehicles * 300;
  const netGain = totalMonthlyRevenue - totalMonthlyCost;

  if (outRevenue) outRevenue.textContent = `$${totalMonthlyRevenue.toLocaleString()}`;
  if (outCost) outCost.textContent = `$${totalMonthlyCost.toLocaleString()}`;
  if (outNet) {
    outNet.textContent = `$${netGain.toLocaleString()}`;
    outNet.className = netGain < 0 ? 'text-red' : 'text-emerald';
  }
}

// Reclaimed Time Calculator Logic
function calculateTimeSaved() {
  const timeVehicles = document.getElementById('time-vehicles');
  const timePerTrip = document.getElementById('time-per-trip');
  const tripsPerDay = document.getElementById('trips-per-day');
  
  const outHoursWeek = document.getElementById('out-hours-week');
  const outHoursMonth = document.getElementById('out-hours-month');
  const outDaysYear = document.getElementById('out-days-year');

  if (!timeVehicles || !timePerTrip || !tripsPerDay) return;

  const vehicles = parseInt(timeVehicles.value) || 0;
  const minsPerTrip = parseFloat(timePerTrip.value) || 0;
  const dailyTrips = parseFloat(tripsPerDay.value) || 0;

  // Assume 6 days a week operation for NEMT
  const weeklyHours = (vehicles * dailyTrips * 6 * minsPerTrip) / 60;
  const monthlyHours = weeklyHours * 4.33; // Average weeks per month
  const yearlyDays = (monthlyHours * 12) / 8; // Reclaimed 8-hour work days

  if (outHoursWeek) outHoursWeek.textContent = weeklyHours.toFixed(1);
  if (outHoursMonth) outHoursMonth.textContent = monthlyHours.toFixed(0);
  if (outDaysYear) outDaysYear.textContent = `${yearlyDays.toFixed(0)} Work Days/Year`;
}

// Onboarding & Stripe Logic
async function handleOnboarding(event) {
  event.preventDefault();
  const statusMsg = document.getElementById('form-status');
  const paymentStep = document.getElementById('payment-step');
  if (statusMsg) statusMsg.textContent = 'Processing profile...';

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.url) {
      if (paymentStep) paymentStep.style.display = 'block';
      if (statusMsg) statusMsg.textContent = 'Profile saved. Complete Step 2 below.';
      
      // Store URL for the button
      window.stripeCheckoutUrl = result.url;
      paymentStep.scrollIntoView({ behavior: 'smooth' });
    } else {
      throw new Error(result.error);
    }
  } catch (err) {
    if (statusMsg) statusMsg.textContent = `Error: ${err.message}`;
  }
}

// Initialization
function init() {
  const calcVehicles = document.getElementById('calc-vehicles');
  const calcRevenue = document.getElementById('calc-revenue');
  
  const timeVehicles = document.getElementById('time-vehicles');
  const timePerTrip = document.getElementById('time-per-trip');
  const tripsPerDay = document.getElementById('trips-per-day');

  const obForm = document.getElementById('onboarding-form');
  const stripeBtn = document.getElementById('stripe-checkout-btn');

  if (calcVehicles) calcVehicles.addEventListener('input', calculateROI);
  if (calcRevenue) calcRevenue.addEventListener('input', calculateROI);
  
  if (timeVehicles) timeVehicles.addEventListener('input', calculateTimeSaved);
  if (timePerTrip) timePerTrip.addEventListener('input', calculateTimeSaved);
  if (tripsPerDay) tripsPerDay.addEventListener('input', calculateTimeSaved);

  if (obForm) obForm.addEventListener('submit', handleOnboarding);
  if (stripeBtn) {
    stripeBtn.addEventListener('click', () => {
      if (window.stripeCheckoutUrl) window.location.href = window.stripeCheckoutUrl;
    });
  }

  // Initial calculations
  calculateROI();
  calculateTimeSaved();
}

// Run immediately and also on DOM ready
init();
document.addEventListener('DOMContentLoaded', init);
window.onload = init;
// Final fallback to ensure non-zero values
setTimeout(() => {
    calculateROI();
    calculateTimeSaved();
}, 500);
