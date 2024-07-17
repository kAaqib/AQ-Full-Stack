const mqtb = document.getElementById('myquiztb')
document.addEventListener('DOMContentLoaded', function() {
    // Event delegation for delete buttons
    if (mqtb) {
        mqtb.addEventListener('click', async function(event) {
            if (event.target.classList.contains('delete-quiz')) {
                const quizCode = event.target.getAttribute('data-quiz-code');
                const uname = event.target.getAttribute('data-uname');
                try {
                    const response = await fetch(`/api/v1/quizzes/${uname}/${quizCode}`, {
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
    }
});

document.addEventListener('DOMContentLoaded', function() {
    if (mqtb) {
        mqtb.addEventListener('click', async function(event) {
            if (event.target.classList.contains('resp-quiz')) {
                let quizCode = event.target.getAttribute('data-quiz-code');
                try {
                    await fetch(`/api/v1/quizzes/${quizCode}/responses`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        localStorage.setItem("Responses", JSON.stringify(data));
                        window.location.href = "/responses"
                    })
                } catch (error) {
                    console.error('Error fetching answers:', error);
                }
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    if (mqtb) {
        mqtb.addEventListener('click', async function(event) {
            if (event.target.classList.contains('view-quiz')) {
                const quizCode = event.target.getAttribute('data-quiz-code');
                try {
                    await fetch(`/api/v1/quizzes/${quizCode}/view`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
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
    }
});

document.addEventListener('DOMContentLoaded', function() {
    if (mqtb) {
        mqtb.addEventListener('click', async function(event) {
            if (event.target.classList.contains('edit-quiz')) {
                const quizCode = event.target.getAttribute('data-quiz-code');
                try {
                    await fetch(`/api/v1/quizzes/${quizCode}/edit`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
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
    }
});

const mdtb = document.getElementById('mydrafttb');

document.addEventListener('DOMContentLoaded', function() {
    if (mdtb) {
    // Event delegation for delete buttons
        mdtb.addEventListener('click', async function(event) {
            if (event.target.classList.contains('delete-quiz')) {
                const quizCode = event.target.getAttribute('data-quiz-code');
                const uname = event.target.getAttribute('data-uname');
                try {
                    const response = await fetch(`/api/v1/drafts/${uname}/${quizCode}`, {
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
    }
});

document.addEventListener('DOMContentLoaded', function() {
    if (mdtb) {
        mdtb.addEventListener('click', async function(event) {
            if (event.target.classList.contains('view-quiz')) {
                const quizCode = event.target.getAttribute('data-quiz-code');
                try {
                    await fetch(`/api/v1/drafts/${quizCode}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
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
    }
});

document.addEventListener('DOMContentLoaded', function() {
    if (mdtb) {
        mdtb.addEventListener('click', async function(event) {
            if (event.target.classList.contains('edit-quiz')) {
                const quizCode = event.target.getAttribute('data-quiz-code');
                try {
                    await fetch(`/api/v1/drafts/${quizCode}/edit`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
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
    }
});