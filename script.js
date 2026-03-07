// ROI Calculator Logic
const calcVehicles = document.getElementById('calc-vehicles');
const calcTrips = document.getElementById('calc-trips');
const calcRevenue = document.getElementById('calc-revenue');

const outRevenue = document.getElementById('out-revenue');
const outCost = document.getElementById('out-cost');
const outNet = document.getElementById('out-net');

function calculateROI() {
  const vehicles = parseInt(calcVehicles.value) || 0;
  const trips = parseInt(calcTrips.value) || 0;
  const revPerTrip = parseFloat(calcRevenue.value) || 0;

  // Assume 4 weeks per month for conservative estimate
  const monthlyTrips = trips * 4;
  const totalMonthlyRevenue = vehicles * monthlyTrips * revPerTrip;
  const totalMonthlyCost = vehicles * 299;
  const netGain = totalMonthlyRevenue - totalMonthlyCost;

  outRevenue.textContent = `$${totalMonthlyRevenue.toLocaleString()}`;
  outCost.textContent = `$${totalMonthlyCost.toLocaleString()}`;
  outNet.textContent = `$${netGain.toLocaleString()}`;

  // Change color if net gain is negative (unlikely with defaults, but good practice)
  if (netGain < 0) {
    outNet.classList.remove('text-emerald');
    outNet.classList.add('text-red');
  } else {
    outNet.classList.remove('text-red');
    outNet.classList.add('text-emerald');
  }
}

// Add event listeners to calculate on input change
if (calcVehicles && calcTrips && calcRevenue) {
  [calcVehicles, calcTrips, calcRevenue].forEach(input => {
    input.addEventListener('input', calculateROI);
  });
  
  // Initial calculation
  calculateROI();
}

// Onboarding Form Logic
const form = document.getElementById('onboarding-form');
const paymentStep = document.getElementById('payment-step');
const statusMsg = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = (formData.get('name') || '').toString().trim();
    const company = (formData.get('company') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().trim();
    const vehicles = (formData.get('vehicles') || '').toString().trim();
    const preferences = (formData.get('preferences') || '').toString().trim();

    const recipients = 'ampliftsllc@icloud.com,thewshii@gmail.com';
    const subject = `New Onboarding Profile: ${company} - SEE.SMART`;
    const body = [
      'A new onboarding profile has been submitted for SEE.SMART.',
      '',
      `Name: ${name}`,
      `Company: ${company}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Vehicles to Enroll: ${vehicles}`,
      '',
      'Routing Preferences:',
      preferences
    ].join('\n');

    const mailtoUrl = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoUrl;

    // Reveal Step 2 (Payment)
    if (paymentStep) {
      paymentStep.style.display = 'block';
      paymentStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (statusMsg) {
      statusMsg.textContent = 'Profile data prepared in your email app. Please complete Step 2 above to activate your subscription.';
      statusMsg.classList.add('text-emerald');
    }
  });
}
