document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizCode = urlParams.get('quizCode');
    
    if (quizCode) {
        try {
            const response = await fetch(`/responsesData?quizCode=${quizCode}`);
            const jsonResponse = await response.json();

            if (jsonResponse.error) {
                console.error(jsonResponse.error);
                return;
            }

            const scores = jsonResponse.Scores;

            const tbody = document.getElementById('quizrestb');

            scores.forEach((scoreData, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${scoreData.username}</td>
                    <td>${scoreData.score}</td>
                    <td><button class="review-quiz btn" data-quiz-code="${quizCode}" data-uname="${scoreData.username}">Review</button></td>
                `;
                tbody.appendChild(row);
            });

        } catch (err) {
            console.error('Error fetching responses:', err);
        }
    } else {
        console.error('Quiz code is missing in the URL');
    }
});