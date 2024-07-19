/**
 * Displays quiz response data in a table.
 * @fileoverview This script retrieves response data from localStorage and populates a table with scores. It formats
 * the date of the response and provides buttons for reviewing individual responses.
 */

/**
 * Event listener for the DOMContentLoaded event.
 * This function populates a table with quiz response data from localStorage.
 */
document.addEventListener("DOMContentLoaded", async () => {
    // Retrieve and parse response data from localStorage
    const data = JSON.parse(localStorage.getItem("Responses"));
    let scores = data.Scores; // Array of score data
    let quizCode = data.code; // Quiz code for review buttons
    const tbody = document.getElementById('quizrestb'); // Table body element

    // Populate the table with rows for each score entry
    scores.forEach((scoreData, index) => {
        // Format the last answered date
        var s = new Date(scoreData.lastanswered).toLocaleString('en-GB', {timeZone: 'Asia/Kolkata'});

        // Create a new table row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${scoreData.username}</td>
            <td>${scoreData.score}</td>
            <td><button class="review-quiz btn" data-quiz-code="${quizCode}" data-uname="${scoreData.username}">Review</button></td>
            <td>${s}</td>
        `;
        // Append the row to the table body
        tbody.appendChild(row);
    });
});