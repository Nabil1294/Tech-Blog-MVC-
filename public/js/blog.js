// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();

  // Get form data
  const title = document.querySelector('#blog-title').value.trim();
  const description = document.querySelector('#blog-description').value.trim();
  const blogId = document.querySelector('#blog-id').value; // ID for existing blog (empty for new blog)

  // Check if all fields are filled
  if (!title || !description) {
    const errorContainer = document.querySelector('#error-message');
    errorContainer.textContent = 'All fields must be completed to submit the post.';
    errorContainer.style.display = 'block';
    return;
  }

  // Determine the request type (POST for new, PUT for update) and URL
  const method = blogId ? 'PUT' : 'POST';
  const url = blogId ? `/api/blogs/${blogId}` : '/api/blogs';

  // Send the request to the server
  const response = await fetch(url, {
    method: method,
    body: JSON.stringify({ title, description }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    const data = await response.json();
    const errorContainer = document.querySelector('#error-message');
    errorContainer.textContent = data.message;
    errorContainer.style.display = 'block';
  }
}

// Attach the event listener to the form
document.getElementById('new-blog-form')?.addEventListener('submit', handleFormSubmit);

// Function to redirect to the blog form for editing
function editBlogPost(blogId) {
  document.location.href = `/create-blog/${blogId}`;
}

// Check if we're editing an existing blog post (For use in the blog creation page)
const urlParams = new URLSearchParams(window.location.search);
const editBlogId = urlParams.get('edit');

if (editBlogId) {
  fetch(`/api/blogs/${editBlogId}`)
    .then(response => response.json())
    .then(blogData => {
      document.querySelector('#blog-title').value = blogData.title;
      document.querySelector('#blog-description').value = blogData.description;
      document.querySelector('#blog-id').value = editBlogId;
      // Change form's behavior to be an update rather than a create
    })
    .catch(error => console.error('Error:', error));
}




