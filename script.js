// Revenue and Time Recovery Calculators Logic
(function() {
  function updateCalculators() {
    calculateROI();
    calculateTimeSaved();
  }

  function calculateROI() {
    const calcVehicles = document.getElementById('calc-vehicles');
    const calcRevenue = document.getElementById('calc-revenue');
    const displayTotalTrips = document.getElementById('display-total-trips');
    const outRevenue = document.getElementById('out-revenue');
    const outCost = document.getElementById('out-cost');
    const outNet = document.getElementById('out-net');

    if (!calcVehicles || !calcRevenue) return;

    // Use valueAsNumber for more robust retrieval from numeric inputs
    const vehicles = calcVehicles.valueAsNumber || parseInt(calcVehicles.value) || 0;
    const revPerTrip = calcRevenue.valueAsNumber || parseFloat(calcRevenue.value) || 0;
    
    // Benchmark: 50 trips per vehicle per week
    const totalWeeklyTrips = vehicles * 50;
    
    if (displayTotalTrips) displayTotalTrips.textContent = totalWeeklyTrips.toLocaleString();

    // Conservative Monthly Math (4 weeks)
    const totalMonthlyRevenue = totalWeeklyTrips * 4 * revPerTrip;
    const totalMonthlyCost = vehicles * 497;
    const netGain = totalMonthlyRevenue - totalMonthlyCost;

    if (outRevenue) outRevenue.textContent = `$${totalMonthlyRevenue.toLocaleString()}`;
    if (outCost) outCost.textContent = `$${totalMonthlyCost.toLocaleString()}`;
    if (outNet) {
      outNet.textContent = `$${netGain.toLocaleString()}`;
      outNet.className = netGain < 0 ? 'text-red' : 'text-emerald';
    }
  }

  function calculateTimeSaved() {
    const timeVehicles = document.getElementById('time-vehicles');
    const timePerTrip = document.getElementById('time-per-trip');
    const tripsPerDay = document.getElementById('trips-per-day');
    
    const outHoursWeek = document.getElementById('out-hours-week');
    const outHoursMonth = document.getElementById('out-hours-month');
    const outDaysYear = document.getElementById('out-days-year');

    if (!timeVehicles || !timePerTrip || !tripsPerDay) return;

    const vehicles = timeVehicles.valueAsNumber || parseInt(timeVehicles.value) || 0;
    const minsPerTrip = timePerTrip.valueAsNumber || parseFloat(timePerTrip.value) || 0;
    const dailyTrips = tripsPerDay.valueAsNumber || parseFloat(tripsPerDay.value) || 0;

    // Assume 6 days a week operation for NEMT
    const weeklyHours = (vehicles * dailyTrips * 6 * minsPerTrip) / 60;
    const monthlyHours = weeklyHours * 4.33; // Average weeks per month
    const yearlyDays = (monthlyHours * 12) / 8; // Reclaimed 8-hour work days

    if (outHoursWeek) outHoursWeek.textContent = weeklyHours.toFixed(1);
    if (outHoursMonth) outHoursMonth.textContent = monthlyHours.toFixed(0);
    if (outDaysYear) outDaysYear.textContent = `${yearlyDays.toFixed(0)} Work Days/Year`;
  }

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
        window.stripeCheckoutUrl = result.url;
        paymentStep.scrollIntoView({ behavior: 'smooth' });
      } else {
        throw new Error(result.error || 'Server error');
      }
    } catch (err) {
      if (statusMsg) statusMsg.textContent = `Error: ${err.message}`;
    }
  }

  function init() {
    const inputs = ['calc-vehicles', 'calc-revenue', 'time-vehicles', 'time-per-trip', 'trips-per-day'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', updateCalculators);
        el.addEventListener('change', updateCalculators);
      }
    });

    const obForm = document.getElementById('onboarding-form');
    if (obForm) obForm.addEventListener('submit', handleOnboarding);

    const stripeBtn = document.getElementById('stripe-checkout-btn');
    if (stripeBtn) {
      stripeBtn.addEventListener('click', () => {
        if (window.stripeCheckoutUrl) window.location.href = window.stripeCheckoutUrl;
      });
    }

    // Run once on init
    updateCalculators();
  }

  // Robust initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Fallback for some browsers or delayed rendering
  window.addEventListener('load', init);
})();
