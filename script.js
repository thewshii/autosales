// ROI Calculator Logic
const calcVehicles = document.getElementById('calc-vehicles');
const calcRevenue = document.getElementById('calc-revenue');
const displayTotalTrips = document.getElementById('display-total-trips');

const outRevenue = document.getElementById('out-revenue');
const outCost = document.getElementById('out-cost');
const outNet = document.getElementById('out-net');

function calculateROI() {
  if (!calcVehicles || !calcRevenue) return;

  const vehicles = parseInt(calcVehicles.value) || 0;
  const revPerTrip = parseFloat(calcRevenue.value) || 0;
  
  // Fixed multiplier: 13 trips per vehicle per week
  const weeklyTripsPerVehicle = 13;
  const totalWeeklyTrips = vehicles * weeklyTripsPerVehicle;
  
  // Update total trips display
  if (displayTotalTrips) {
    displayTotalTrips.textContent = totalWeeklyTrips.toLocaleString();
  }

  // Assume 4 weeks per month for conservative estimate
  const monthlyTrips = totalWeeklyTrips * 4;
  const totalMonthlyRevenue = monthlyTrips * revPerTrip;
  const totalMonthlyCost = vehicles * 300;
  const netGain = totalMonthlyRevenue - totalMonthlyCost;

  if (outRevenue) outRevenue.textContent = `$${totalMonthlyRevenue.toLocaleString()}`;
  if (outCost) outCost.textContent = `$${totalMonthlyCost.toLocaleString()}`;
  if (outNet) {
    outNet.textContent = `$${netGain.toLocaleString()}`;
    
    // Visual feedback for profit/loss
    if (netGain < 0) {
      outNet.classList.remove('text-emerald');
      outNet.classList.add('text-red');
    } else {
      outNet.classList.remove('text-red');
      outNet.classList.add('text-emerald');
    }
  }
}

// Add event listeners and run initial calculation
if (calcVehicles && calcRevenue) {
  calcVehicles.addEventListener('input', calculateROI);
  calcRevenue.addEventListener('input', calculateROI);
  
  // Force a small delay to ensure DOM is fully ready for values
  setTimeout(calculateROI, 100);
}

// Onboarding & Stripe Logic
const form = document.getElementById('onboarding-form');
const paymentStep = document.getElementById('payment-step');
const stripeBtn = document.getElementById('stripe-checkout-btn');
const statusMsg = document.getElementById('form-status');

let checkoutUrl = '';

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (statusMsg) {
      statusMsg.textContent = 'Processing profile...';
      statusMsg.classList.remove('text-red', 'text-emerald');
    }
    
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      company: formData.get('company'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      vehicles: formData.get('vehicles'),
      preferences: formData.get('preferences'),
    };

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.url) {
        checkoutUrl = result.url;
        if (paymentStep) {
          paymentStep.style.display = 'block';
          paymentStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (statusMsg) {
          statusMsg.textContent = 'Profile saved. Please complete the subscription payment below.';
          statusMsg.classList.add('text-emerald');
        }
      } else {
        throw new Error(result.error || 'Failed to create checkout session');
      }
    } catch (err) {
      if (statusMsg) {
        statusMsg.textContent = `Error: ${err.message}`;
        statusMsg.classList.add('text-red');
      }
    }
  });
}

if (stripeBtn) {
  stripeBtn.addEventListener('click', () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  });
}

// Handle Success/Cancel states
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('success')) {
  if (statusMsg) {
    statusMsg.textContent = 'Subscription successful! Our team will reach out within 24 hours to complete your setup.';
    statusMsg.classList.add('text-emerald');
    statusMsg.scrollIntoView({ behavior: 'smooth' });
  }
}
if (urlParams.get('canceled')) {
  if (statusMsg) {
    statusMsg.textContent = 'Payment canceled. Your profile is saved, but you must subscribe to activate the service.';
    statusMsg.classList.add('text-red');
  }
}
