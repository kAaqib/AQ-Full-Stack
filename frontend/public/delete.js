document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');

    // Event delegation for delete buttons
    document.getElementById('myquiztb').addEventListener('click', async function(event) {
        if (event.target.classList.contains('delete-quiz')) {
            const quizCode = event.target.getAttribute('data-quiz-code');
            const uname = event.target.getAttribute('data-uname');
            try {
                const response = await fetch(`/deletequizData?quizCode=${quizCode}&uname=${uname}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const remainingQuizzes = await response.json();
                    // Remove the row from the table
                    const row = event.target.closest('tr');
                    row.remove();
                } else {
                    console.error('Failed to delete quiz');
                }
            } catch (error) {
                console.error('Error deleting quiz:', error);
            }
        }
    });
});