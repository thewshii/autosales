const form = document.getElementById('application-form');
const statusText = document.getElementById('application-status');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    const recipients = 'ampliftsllc@icloud.com,thewshii@gmail.com';
    const subject = 'Inquiry About Joining the Bot Network';
    const body = [
      'A new inquiry was submitted about joining the bot network.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'Not provided'}`,
      '',
      'Message:',
      message
    ].join('\n');

    const mailtoUrl = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    if (statusText) {
      statusText.textContent = 'Your email app should open with both recipients populated.';
    }
  });
}
