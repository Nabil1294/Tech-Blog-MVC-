function requestDeletePost(element) {
  const postId = element.getAttribute('data-id');
  const confirmButton = document.getElementById('confirmDelete');
  confirmButton.setAttribute('data-id', postId);
  var deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
  deleteConfirmationModal.show();
}

document.getElementById('confirmDelete').addEventListener('click', function() {
  const postId = this.getAttribute('data-id');
  fetch(`/api/blogs/${postId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        document.querySelector(`button[data-id="${postId}"]`).closest('.col-md-8, .col-lg-6').remove();
        var deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
        deleteConfirmationModal.hide();
      } else {
        alert('Failed to delete the post.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
