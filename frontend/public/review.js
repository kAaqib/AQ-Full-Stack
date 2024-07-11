document.addEventListener('DOMContentLoaded', function() {
    // Event delegation for delete buttons
    document.getElementById('myanstb').addEventListener('click', async function(event) {
        if (event.target.classList.contains('review-quiz')) {
            const quizCode = event.target.getAttribute('data-quiz-code');
            const uname = event.target.getAttribute('data-uname');
            const data = {
                name: uname,
                code: quizCode
            }
            try {
                await fetch("/review", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
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
});