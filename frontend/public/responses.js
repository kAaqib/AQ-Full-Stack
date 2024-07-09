document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizCode = urlParams.get('quizCode');
    
    if (quizCode) {
        try {
            const response = await fetch(`http://127.0.0.1:3000/responsesData?quizCode=${quizCode}`);
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