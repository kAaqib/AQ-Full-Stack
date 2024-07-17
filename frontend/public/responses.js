document.addEventListener("DOMContentLoaded", async () => {
    const data = JSON.parse(localStorage.getItem("Responses"));
    let scores = data.Scores;
    let quizCode = data.code;
    const tbody = document.getElementById('quizrestb');

    scores.forEach((scoreData, index) => {
        var s = new Date(scoreData.lastanswered).toLocaleString('en-GB', {timeZone: 'Asia/Kolkata'});
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${scoreData.username}</td>
            <td>${scoreData.score}</td>
            <td><button class="review-quiz btn" data-quiz-code="${quizCode}" data-uname="${scoreData.username}">Review</button></td>
            <td>${s}</td>
        `;
        tbody.appendChild(row);
    });
});