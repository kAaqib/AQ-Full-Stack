const matb = document.getElementById('myanstb');
document.addEventListener('DOMContentLoaded', function() {
    if (matb) {
    // Event delegation for delete buttons
        matb.addEventListener('click', async function(event) {
            if (event.target.classList.contains('review-quiz')) {
                const quizCode = event.target.getAttribute('data-quiz-code');
                const uname = event.target.getAttribute('data-uname');
                try {
                    await fetch(`/api/v1/quizzes/${uname}/${quizCode}/review`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        localStorage.setItem("Review", JSON.stringify(data));
                        window.location.href = "/review.html"
                    })
                } catch (error) {
                    console.error('Error fetching answers:', error);
                }
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    let qrtb = document.getElementById('quizrestb');
    if (qrtb) {
        qrtb.addEventListener('click', async function(event) {
            if (event.target.classList.contains('review-quiz')) {
                const quizCode = event.target.getAttribute('data-quiz-code');
                const uname = event.target.getAttribute('data-uname');
                try {
                    await fetch(`/api/v1/quizzes/${uname}/${quizCode}/review`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    })
                    .then(res => res.json())
                    .then(data => {
                        localStorage.setItem("Review", JSON.stringify(data));
                        window.location.href = "/review.html"
                    })
                } catch (error) {
                    console.error('Error fetching answers:', error);
                }
            }
        });
    }
});