/**
 * Adds event listeners to handle quiz review actions.
 * @fileoverview This script adds event listeners to elements with IDs 'myanstb' and 'quizrestb'.
 * When the user clicks on elements with the 'review-quiz' class, it sends a request to review the quiz
 * and redirects the user to the review page.
 */

const matb = document.getElementById('myanstb');

/**
 * Adds an event listener for DOMContentLoaded to handle clicks on the 'myanstb' element.
 * When a 'review-quiz' button is clicked, sends a POST request to review the quiz.
 */
document.addEventListener('DOMContentLoaded', function() {
    if (matb) {
        // Event delegation for delete buttons
        matb.addEventListener('click', async function(event) {
            if (event.target.classList.contains('review-quiz')) {
                const quizCode = event.target.getAttribute('data-quiz-code');
                const uname = event.target.getAttribute('data-uname');
                let data = {
                    username: uname,
                    code: quizCode
                };
                try {                    
                    await fetch(`/api/v1/quizzes/review`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(res => res.json())
                    .then(data => {
                        localStorage.setItem("Review", JSON.stringify(data));
                        window.location.href = "/review.html";
                    });
                } catch (error) {
                    console.error('Error fetching answers:', error);
                }
            }
        });
    }
});

/**
 * Adds an event listener for DOMContentLoaded to handle clicks on the 'quizrestb' element.
 * When a 'review-quiz' button is clicked, sends a POST request to review the quiz.
 */
document.addEventListener('DOMContentLoaded', function() {
    let qrtb = document.getElementById('quizrestb');
    if (qrtb) {
        qrtb.addEventListener('click', async function(event) {
            if (event.target.classList.contains('review-quiz')) {
                const quizCode = event.target.getAttribute('data-quiz-code');
                const uname = event.target.getAttribute('data-uname');
                let data = {
                    username: uname,
                    code: quizCode
                };
                try {
                    await fetch(`/api/v1/quizzes/review`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(res => res.json())
                    .then(data => {
                        localStorage.setItem("Review", JSON.stringify(data));
                        window.location.href = "/review.html";
                    });
                } catch (error) {
                    console.error('Error fetching answers:', error);
                }
            }
        });
    }
});