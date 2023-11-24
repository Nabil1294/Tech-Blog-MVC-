const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const username = document.querySelector('#username').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (username && password) {
    // Send a POST request to the API endpoint
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(response);
    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace('/');
    } else {
      const data = await response.json();
      const errorContainer = document.querySelector('#error-message');
      if (errorContainer) {
        errorContainer.textContent = data.message;
        errorContainer.style.display = 'block';
      }}
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);
