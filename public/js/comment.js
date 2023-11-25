document.addEventListener('DOMContentLoaded', function() {
  const commentForm = document.getElementById('new-comment-form');

  commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const commentDescription = document.querySelector('#comment-description').value.trim();
    const blogId = window.location.pathname.split('/').pop();

    if (commentDescription) {
      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ comment_description: commentDescription, blog_id: blogId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        document.location.reload();
      } else {
        alert('Failed to post comment');
      }
    }
  });
});
