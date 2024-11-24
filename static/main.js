// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_LENGTH = 5000;

// UI Elements
const form = document.getElementById('emailForm');
const sendButton = document.getElementById('sendButton');
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');
const bodyInput = document.getElementById('body');
const charCounter = document.getElementById('charCounter');
const loadingSpinner = document.getElementById('loadingSpinner');

// Update character counter
function updateCharCounter() {
    const remaining = MAX_BODY_LENGTH - bodyInput.value.length;
    charCounter.textContent = `${remaining} characters remaining`;
    charCounter.className = remaining < 100 ? 'char-counter warning' : 'char-counter';
}

// Validate email
function validateEmail(email) {
    return EMAIL_REGEX.test(email);
}

// Show alert
function showAlert(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.classList.add('visible');

    setTimeout(() => {
        element.classList.remove('visible');
    }, 5000);
}

// Send email
async function sendEmail(formData) {
    try {
        const response = await fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showAlert(successAlert, 'Email sent successfully!');
            form.reset();
            updateCharCounter();
        } else {
            throw new Error(data.error || 'Failed to send email');
        }
    } catch (error) {
        showAlert(errorAlert, error.message);
    }
}

// Event Listeners
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const toEmail = document.getElementById('to').value;
    if (!validateEmail(toEmail)) {
        showAlert(errorAlert, 'Please enter a valid email address');
        return;
    }

    if (bodyInput.value.length > MAX_BODY_LENGTH) {
        showAlert(errorAlert, 'Message is too long');
        return;
    }

    if (!confirm('Are you sure you want to send this email?')) {
        return;
    }

    sendButton.disabled = true;
    loadingSpinner.style.display = 'inline-block';

    const formData = {
        to: toEmail,
        subject: document.getElementById('subject').value,
        body: bodyInput.value
    };

    await sendEmail(formData);

    sendButton.disabled = false;
    loadingSpinner.style.display = 'none';
});

bodyInput.addEventListener('input', updateCharCounter);

// Initialize character counter
updateCharCounter();

// Handle alert transitions
document.querySelectorAll('.alert').forEach(alert => {
    alert.addEventListener('transitionend', function() {
        if (!this.classList.contains('visible')) {
            this.style.display = 'none';
        }
    });
});
