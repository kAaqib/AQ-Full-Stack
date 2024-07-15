document.addEventListener('DOMContentLoaded', function() {
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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('myquiztb').addEventListener('click', async function(event) {
        if (event.target.classList.contains('view-quiz')) {
            const quizCode = event.target.getAttribute('data-quiz-code');
            const uname = event.target.getAttribute('data-uname');
            const data = {
                name: uname,
                code: quizCode
            }
            try {
                await fetch("/viewquiz", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem("View", JSON.stringify(data));
                    window.location.href = "/viewquiz.html"
                })
            } catch (error) {
                console.error('Error fetching answers:', error);
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('myquiztb').addEventListener('click', async function(event) {
        if (event.target.classList.contains('edit-quiz')) {
            const quizCode = event.target.getAttribute('data-quiz-code');
            const uname = event.target.getAttribute('data-uname');
            const data = {
                name: uname,
                code: quizCode,
            }
            try {
                await fetch("/editquiz", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem("Edit", JSON.stringify(data));
                    localStorage.setItem("EditFlag", "true");
                    window.location.href = "/makeQuiz"
                })
                .then(() => {

                })
            } catch (error) {
                console.error('Error fetching answers:', error);
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');

    // Event delegation for delete buttons
    document.getElementById('mydrafttb').addEventListener('click', async function(event) {
        if (event.target.classList.contains('delete-quiz')) {
            const quizCode = event.target.getAttribute('data-quiz-code');
            const uname = event.target.getAttribute('data-uname');
            try {
                const response = await fetch(`/deleteDquizData?quizCode=${quizCode}&uname=${uname}`, {
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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('mydrafttb').addEventListener('click', async function(event) {
        if (event.target.classList.contains('view-quiz')) {
            const quizCode = event.target.getAttribute('data-quiz-code');
            const uname = event.target.getAttribute('data-uname');
            const data = {
                name: uname,
                code: quizCode
            }
            try {
                await fetch("/viewDquiz", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem("View", JSON.stringify(data));
                    window.location.href = "/viewquiz.html"
                })
            } catch (error) {
                console.error('Error fetching answers:', error);
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('mydrafttb').addEventListener('click', async function(event) {
        if (event.target.classList.contains('edit-quiz')) {
            const quizCode = event.target.getAttribute('data-quiz-code');
            const uname = event.target.getAttribute('data-uname');
            const data = {
                name: uname,
                code: quizCode,
            }
            try {
                await fetch("/editDquiz", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem("Edit", JSON.stringify(data));
                    localStorage.setItem("EditFlag", "true");
                    window.location.href = "/makeQuiz"
                })
                .then(() => {

                })
            } catch (error) {
                console.error('Error fetching answers:', error);
            }
        }
    });
});