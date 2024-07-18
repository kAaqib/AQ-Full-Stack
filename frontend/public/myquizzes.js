const mqtb = document.getElementById('myquiztb')
document.addEventListener('DOMContentLoaded', function() {
    // Event delegation for delete buttons
    if (mqtb) {
        mqtb.addEventListener('click', async function(event) {
            if (event.target.classList.contains('delete-quiz')) {
                const quizCode = event.target.getAttribute('data-quiz-code');
                const uname = event.target.getAttribute('data-uname');
                let data = {
                    username: uname,
                    code: quizCode
                }
                try {
                    const response = await fetch(`/api/v1/quizzes/delete`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
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
    // Event delegation for delete buttons
    if (mqtb) {
        // const toggleButtons = document.querySelectorAll('.toggle-quiz');
        // toggleButtons.forEach(button => {
        //     button.addEventListener('click', async (event) => {
        //         console.log("Button clicked")
        //         const quizCode = event.target.dataset.quizCode;
        //         const username = event.target.dataset.uname;
        //         await toggleQuizStatus(quizCode, username, event.target);
        //     });
        // });
        // async function toggleQuizStatus(quizCode, username, button) {
        //     const data = {
        //         code: quizCode,
        //         username: username
        //     };
        
        //     try {
        //         const response = await fetch('/api/v1/quizzes/status', {
        //             method: 'PUT',
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify(data)
        //         });
        
        //         const result = await response.json();
        //         console.log(result);
        //         if (response.ok) {
        //             const statusCell = button.parentNode;
        //             const statusText = statusCell.firstChild;
        //             const newStatus = result.find(quiz => quiz.code === quizCode).status ? "Active" : "Inactive";
        //             statusText.textContent = newStatus;
        //         } else {
        //             alert('Error: ' + result.error);
        //         }
        //     } catch (error) {
        //         alert('Error: ' + error.message);
        //     }
        // }
        mqtb.addEventListener('click', async function(event) {
            if (event.target.classList.contains('toggle-quiz')) {
                const quizCode = event.target.getAttribute('data-quiz-code');
                const uname = event.target.getAttribute('data-uname');
                let data = {
                    username: uname,
                    code: quizCode
                }
                try {
                    const response = await fetch(`/api/v1/quizzes/status`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    if (response.ok) {
                        const statusCell = event.target.parentNode;
                        const statusText = statusCell.firstChild;
                        const newStatus = result.find(quiz => quiz.code === quizCode).status ? "true" : "false";
                        if (newStatus == "true")
                            statusText.textContent = "Active";
                        else 
                            statusText.textContent = "Inactive";
                    } else {
                        console.error('Failed to update status');
                    }
                } catch (error) {
                    console.error('Error updating status:', error);
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
                let data = {
                    code: quizCode
                }
                try {
                    await fetch(`/api/v1/quizzes`, {
                        method: 'PUT',
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
    }
});