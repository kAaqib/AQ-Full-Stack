/**
 * Retrieves the elements from the DOM for username, password, and form submission buttons.
 */
const username = document.getElementById("username");
const password = document.getElementById("password");
const logsub = document.getElementById("logsub");
const regsub = document.getElementById("reggsub");

/**
 * Adds an event listener to the username field to store the value in localStorage
 * whenever it changes.
 */
if (username) {
    username.addEventListener("change", () => {
        localStorage.setItem("myName", username.value);
    });

    /**
     * Handles the login form submission.
     * Prevents the default form submission and sends the form data to the server via fetch.
     * On success, redirects to the home page; otherwise, displays an error message.
     * @param {Event} event - The submit event triggered by the form.
     */
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const form = event.target;
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new URLSearchParams(formData), // Convert formData to URL-encoded format
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const result = await response.json();
            if (response.ok) {
                // Handle success - redirect or update the UI as needed
                if (result.msg === "Success") {
                    // Assuming result.success indicates a successful login
                    window.location.href = '/home.html'; // Redirect to home page
                } else {
                    // Show error message to the user
                    alert('Login failed: ' + result.err);
                }
            } else {
                alert('Error: ' + JSON.stringify(result.err));
            }
        } catch (error) {
            alert('Fetch error: ' + error.message);
        }
    });
}

/**
 * Adds an event listener to the registration form to handle form submission.
 * Prevents the default form submission and sends the form data to the server via fetch.
 * On successful registration, redirects to the home page; otherwise, displays an error message.
 */
if (regsub) {
    document.getElementById('regForm').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const form = event.target;
        const formData = new FormData(form);

        try {
            const response = await fetch("/register", {
                method: "POST",
                body: new URLSearchParams(formData), // Convert formData to URL-encoded format
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const result = await response.json();
            if (response.ok) {
                // If the response is a redirect (successful registration), we manually follow the redirect
                if (result.msg === "Success") {
                    window.location.href = '/';
                }
            } else {
                alert('Error: ' + JSON.stringify(result.msg));
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Fetch error: ' + error.message);
        }
    });
}

/**
 * Retrieves the start button element and initializes localStorage with default values if the button exists.
 */
const startbtn = document.getElementById("startbtn");
if (startbtn) {
    localStorage.setItem("code", "");
    localStorage.setItem("top10", "");
    localStorage.setItem("EditFlag", "false");
    localStorage.setItem("Received", "");
    localStorage.setItem("Edit", "");
    localStorage.setItem("Review", "");
    localStorage.setItem("topic", "");
    localStorage.setItem("level", "");
    localStorage.setItem("View", "");
    localStorage.setItem("Responses", "");
}

/**
 * Retrieves all elements with the class 'topic' and 'level', and the selection button.
 */
const topicEls = document.querySelectorAll(".topic");
const levelEls = document.querySelectorAll(".level");
const selbtn = document.getElementById("selbtn");

/**
 * Retrieves the elements for topics and levels.
 */
const gk = document.getElementById("gk");
const sci = document.getElementById("sci");
const math = document.getElementById("math");
const l1 = document.getElementById("l1");
const l2 = document.getElementById("l2");
const l3 = document.getElementById("l3");

/**
 * Adds event listeners to the topic and level elements.
 * - Sets the checked property of the corresponding elements when a topic or level is clicked.
 * - On the selection button click, retrieves the selected topic and level, saves them to localStorage,
 *   sends a GET request to fetch quiz data based on the selected topic and level, and redirects to the quiz page.
 */
if (selbtn) {
    gk.addEventListener("click", () => {
        topicEls[0].checked = true;
    });
    sci.addEventListener("click", () => {
        topicEls[1].checked = true;
    });
    math.addEventListener("click", () => {
        topicEls[2].checked = true;
    });
    l1.addEventListener("click", () => {
        levelEls[0].checked = true;
    });
    l2.addEventListener("click", () => {
        levelEls[1].checked = true;
    });
    l3.addEventListener("click", () => {
        levelEls[2].checked = true;
    });

    /**
     * Handles the selection button click event.
     * Retrieves the selected topic and level, saves them to localStorage, sends a GET request to fetch
     * quiz data based on the selected topic and level, and redirects to the quiz page.
     * Alerts the user if both topic and level are not selected.
     */
    selbtn.addEventListener("click", () => {
        let topic;
        let level;
        
        topicEls.forEach(topicEl => {
            if (topicEl.checked) topic = topicEl.id;
        });
        
        levelEls.forEach(levelEl => {
            if (levelEl.checked) level = levelEl.id;
        });

        if (topic === undefined || level === undefined) {
            alert("Select both topic and level");
        } else {
            localStorage.setItem("topic", topic);
            localStorage.setItem("level", level);
            let code;
            
            // Determine the quiz code based on selected topic and level
            switch (topic) {
                case 'General Knowledge':
                    switch (level) {
                        case 'Level 1': code = 'gk1'; break;
                        case 'Level 2': code = 'gk2'; break;
                        case 'Level 3': code = 'gk3'; break;
                    }
                    break;
                case 'Science':
                    switch (level) {
                        case 'Level 1': code = 'sc1'; break;
                        case 'Level 2': code = 'sc2'; break;
                        case 'Level 3': code = 'sc3'; break;
                    }
                    break;
                case 'Mathematics':
                    switch (level) {
                        case 'Level 1': code = 'mt1'; break;
                        case 'Level 2': code = 'mt2'; break;
                        case 'Level 3': code = 'mt3'; break;
                    }
                    break;
            }

            // Send a GET request to fetch quiz data
            fetch(`/api/v1/quizzes/${code}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("Received", JSON.stringify(data.questions));
                localStorage.setItem("code", JSON.stringify(data.code));
            })
            .catch(error => {
                console.error("Error:", error);
            })
            .then(() => {
                window.location.href = "/quiz.html"; // Redirect to the quiz page
            });
        }
    });
}

/**
 * Retrieves DOM elements for the quiz interface and initializes quiz data from localStorage.
 */
const quiz = document.getElementById("quiz");
const answerEls = document.querySelectorAll(".answer");
const qnoview = document.getElementById("qnoview");
const questionEl = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitBtn = document.getElementById("submit");
const b4sub = document.getElementById("beforesub");
const afsub = document.getElementById("aftersub");
const res = document.getElementById("res");

if (quiz) {
    // Check if quiz data exists in localStorage
    if (localStorage.getItem("Received") == undefined) {
        alert("Quiz does not exist");
    }
    
    /**
     * Array containing quiz questions and options.
     * @type {Object[]}
     */
    let arr = JSON.parse(localStorage.getItem("Received"));
    let quizData = arr;
    let topic = localStorage.getItem("topic");
    let level = localStorage.getItem("level");

    /**
     * Map to store answers with question IDs as keys.
     * @type {Map<string, string>}
     */
    let answers = new Map();
    answers.set("code", localStorage.getItem("code"));
    answers.set("name", localStorage.getItem("myName"));
    for (let i = 0; i < quizData.length; i++) {
        answers.set(quizData[i]._id, "");
    }

    let qno = 0; // Current question number

    /**
     * Loads the current question and updates the quiz interface.
     */
    function loadQuiz() {
        deselectAnswers();
        if (qno === quizData.length - 1)
            submitBtn.innerHTML = "Submit";
        else
            submitBtn.innerHTML = "Next";
        const CurrData = quizData[qno];
        qnoview.innerText = "Question " + (qno + 1);
        questionEl.innerText = CurrData.question;
        a_text.innerText = CurrData.a;
        b_text.innerText = CurrData.b;
        d_text.innerText = CurrData.d;
        c_text.innerText = CurrData.c;
    }

    /**
     * Retrieves the currently selected answer.
     * @returns {string | undefined} The ID of the selected answer, or undefined if none is selected.
     */
    function getSelected() {
        let answer = undefined;
        answerEls.forEach(answerEl => {
            if (answerEl.checked) {
                answer = answerEl.id;
            }
        });
        return answer;
    }

    /**
     * Deselects all answer options if no answer has been selected for the current question.
     * Otherwise, selects the previously selected answer for the current question.
     */
    function deselectAnswers() {
        if (!answers.get(quizData[qno]._id)) {
            answerEls.forEach(answerEl => {
                answerEl.checked = false;
            });
        } else {
            answerEls.forEach(answerEl => {
                if (answerEl.id == answers.get(quizData[qno]._id)) {
                    answerEl.checked = true;
                }
            });
        }
    }

    /**
     * Handles the click event on the submit button. Advances to the next question or submits the quiz.
     */
    submitBtn.addEventListener("click", async () => {
        const answer = getSelected();
        const currentButton = document.getElementById(`q${qno + 1}`);
        if (currentButton) {
            currentButton.style.backgroundColor = "#5e174e";
        }

        if (answer) {
            answers.set(quizData[qno]._id, answer);
            qno++;
            if (qno < quizData.length) { 
                loadQuiz(); 
            } else {
                submitQuiz();
            }
        } else {
            qno++;
            if (qno < quizData.length) { 
                loadQuiz(); 
            } else {
                submitQuiz();
            }
        }
    });

    /**
     * Submits the quiz results and updates the UI to show either the leaderboard or review options.
     */
    function submitQuiz() {
        if (b4sub.style.display === "block") {
            b4sub.style.display = "none";
            afsub.style.display = "block";
            const ldb = document.getElementById("leaderboard"); 
            const rev = document.getElementById("review");

            ldb.addEventListener("click", leaderboard);
            rev.addEventListener("click", review);
        } else {
            b4sub.style.display = "block";
            afsub.style.display = "none";
        }

        const answersObject = Object.fromEntries(answers);
        let sc;

        // Send the quiz answers to the server to calculate the score
        fetch("/api/v1/quizzes/score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(answersObject) 
        })
        .then(response => response.json())
        .then(data => {
            sc = data.score;
            res.innerHTML = `You answered ${sc}/${quizData.length} questions correctly.`;
        });
    }

    // Generate navigation buttons for each question
    for (let i = 1; i <= quizData.length; i++) {
        const qbut = `<button class="qnavbtn" id="q${i}">${i}</button>`;
        document.querySelector('.qnav').insertAdjacentHTML('beforeend', qbut);
    }
    
    // Add click event listeners to question navigation buttons
    document.querySelectorAll('.qnavbtn').forEach(button => {
        button.addEventListener('click', function() {
            qno = parseInt(this.id.replace('q', '')) - 1;
            loadQuiz();
        });
    });
}

/**
 * Retrieves DOM elements for quiz-related actions.
 * @type {HTMLElement}
 */
const moyq = document.getElementById("myoq");
const tryQ = document.getElementById("try");
const qc = document.getElementById("qc");
const codeIP = document.getElementById("codeIP");

if (tryQ) {
    /**
     * Event listener for the "Try" button.
     * Redirects the user to the topic selection page.
     */
    tryQ.addEventListener("click", () => {
        window.location.href = "/getTopicPage";
    });

    /**
     * Event listener for the "My Quiz" button.
     * Redirects the user to the quiz creation page.
     */
    moyq.addEventListener("click", () => {
        window.location.href = "/makeQuiz";
    });

    /**
     * Event listener for the "QC" button.
     * Checks if the quiz code entered by the user exists and loads the quiz if it does.
     */
    qc.addEventListener("click", () => {
        localStorage.setItem("code", codeIP.value);
        localStorage.setItem("topic", "");
        localStorage.setItem("level", "");
        let code = codeIP.value;

        /**
         * Data object containing the quiz code.
         * @type {Object}
         */
        const data = {
            code: code,
        };

        // Check if the quiz code exists
        fetch('/api/v1/quizzes/check-code', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.message === "Quiz code exists") {
                // Fetch the quiz questions if the code exists
                fetch(`/api/v1/quizzes/${code}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem("Received", JSON.stringify(data.questions));
                })
                .catch(error => {
                    console.error("Error:", error);
                })
                .then(() => {
                    window.location.href = "/quiz.html";
                });
            } else {
                alert("Quiz does not exist");
                codeIP.value = "";
            }
        });
    });
}

/**
 * Retrieves DOM elements for quiz management actions.
 * @type {HTMLElement}
 */
const addQ = document.getElementById("addQ");
const subMake = document.getElementById("subMake");
const draftbtn = document.getElementById("draftbtn");
const checkCode = document.getElementById("quizCode");

if (checkCode) {
    /**
     * Event listener for the quiz code input field.
     * Checks if the entered quiz code exists and alerts the user if it does.
     */
    checkCode.addEventListener("change", () =>  {
        /**
         * Data object containing the quiz code.
         * @type {Object}
         */
        const data = {
            code: checkCode.value
        };

        fetch('/api/v1/quizzes/check-code', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(res => {
            if (res.message !== "lesgooo") {
                alert("Quiz code exists");
                checkCode.value = "";
            }
        });
    });
}

/**
 * Handles interactions with the quizzes table for deleting, toggling status, viewing responses, and editing quizzes.
 * @fileoverview This script manages the quiz table's interactions by adding event listeners to handle actions such
 * as deleting quizzes, toggling their status, viewing responses, and editing quizzes. It uses event delegation to
 * handle clicks on various buttons and updates the table and localStorage accordingly.
 */

if (addQ) {
    let hidden = subMake.getAttribute("hidden");
    let hid = draftbtn.getAttribute("hidden");
    let qcount = 0;

    /**
     * Event listener for the "Add Question" button.
     * Adds a new question block and delete button to the form.
     */
    addQ.addEventListener("click", () => {
        subMake.removeAttribute(hidden);
        draftbtn.removeAttribute(hid);
        qcount++;
        
        /**
         * Template string for a new question block.
         * @type {string}
         */
        const qele = `
            <div class="question-block" id="question${qcount}">
                <h3>Question ${qcount}</h3>
                <label for="questionText${qcount}">Question:</label>
                <input type="text" id="questionText${qcount}" name="questions[${qcount}][question]" required><br>
                <label for="optionA${qcount}">Option A:</label>
                <input type="text" id="optionA${qcount}" name="questions[${qcount}][a]" required><br>
                <label for="optionB${qcount}">Option B:</label>
                <input type="text" id="optionB${qcount}" name="questions[${qcount}][b]" required><br>
                <label for="optionC${qcount}">Option C:</label>
                <input type="text" id="optionC${qcount}" name="questions[${qcount}][c]" required><br>
                <label for="optionD${qcount}">Option D:</label>
                <input type="text" id="optionD${qcount}" name="questions[${qcount}][d]" required><br>
                <label for="answer${qcount}">Answer (a, b, c, or d):</label>
                <input type="text" id="answer${qcount}" name="questions[${qcount}][ans]" required pattern="[abcd]"><br><br>
            </div>`;

        /**
         * Template string for a new delete button.
         * @type {string}
         */
        const dele = `<button class="dnavbtn" id="del${qcount}" data-id="${qcount}">Delete Question ${qcount}</button>`;

        document.getElementById('questionsContainer').insertAdjacentHTML('beforeend', qele);
        document.getElementById('dnav').insertAdjacentHTML('beforeend', dele);

        /**
         * Event listener for the delete button of a specific question.
         */
        document.getElementById(`del${qcount}`).addEventListener('click', function(event) {
            const id = this.getAttribute('data-id');
            qcount = deleteQuestion(id, qcount);
        });
    });

    /**
     * Removes a question block and updates the remaining question blocks.
     * @param {number} id - The ID of the question to be deleted.
     * @param {number} qcount - The current count of questions.
     * @returns {number} - The updated count of questions.
     */
    function deleteQuestion(id, qcount) {
        const questionBlock = document.getElementById(`question${id}`);
        
        // Remove the question block
        questionBlock.remove();
    
        // Remove the corresponding delete button
        const deleteButton = document.querySelector(`#del${id}`);
        if (deleteButton) {
            deleteButton.remove();
        }
    
        // Decrement the question count
        qcount--;
        if (qcount === 0) {
            subMake.setAttribute("hidden", "hidden");
            draftbtn.setAttribute("hidden", "hidden");
        }
    
        // Update the remaining questions
        const remaining = document.querySelectorAll('.question-block');
        const remdel = document.querySelector('.dnav').querySelectorAll('.dnavbtn');
        remdel.forEach((button, index) => {
            if (index >= id - 1) {
                const newIndex = index + 1;
                button.id = `del${newIndex}`;
                button.dataset.id = newIndex;
                button.innerText = `Delete Question ${newIndex}`;
            }      
        });

        remaining.forEach((question, index) => {
            if (index >= id - 1) {
                const newIndex = index + 1;
                question.id = `question${newIndex}`;
                question.querySelector('h3').innerText = `Question ${newIndex}`;
                
                question.querySelector(`label[for^="questionText"]`).setAttribute('for', `questionText${newIndex}`);
                question.querySelector(`[id^="questionText"]`).id = `questionText${newIndex}`;
                question.querySelector(`[name^="questions[${newIndex+1}][question"]`).name = `questions[${newIndex}][question]`;
                
                question.querySelector(`label[for^="optionA"]`).setAttribute('for', `optionA${newIndex}`);
                question.querySelector(`[id^="optionA"]`).id = `optionA${newIndex}`;
                question.querySelector(`[name^="questions[${newIndex+1}][a]"]`).name = `questions[${newIndex}][a]`;
                
                question.querySelector(`label[for^="optionB"]`).setAttribute('for', `optionB${newIndex}`);
                question.querySelector(`[id^="optionB"]`).id = `optionB${newIndex}`;
                question.querySelector(`[name^="questions[${newIndex+1}][b]"]`).name = `questions[${newIndex}][b]`;
                
                question.querySelector(`label[for^="optionC"]`).setAttribute('for', `optionC${newIndex}`);
                question.querySelector(`[id^="optionC"]`).id = `optionC${newIndex}`;
                question.querySelector(`[name^="questions[${newIndex+1}][c]"]`).name = `questions[${newIndex}][c]`;
                
                question.querySelector(`label[for^="optionD"]`).setAttribute('for', `optionD${newIndex}`);
                question.querySelector(`[id^="optionD"]`).id = `optionD${newIndex}`;
                question.querySelector(`[name^="questions[${newIndex+1}][d]"]`).name = `questions[${newIndex}][d]`;

                question.querySelector(`label[for^="answer"]`).setAttribute('for', `answer${newIndex}`);
                question.querySelector(`[id^="answer"]`).id = `answer${newIndex}`;
                question.querySelector(`[name^="questions[${newIndex+1}][ans]"]`).name = `questions[${newIndex}][ans]`;
            }
        });
        return qcount;
    }

    /**
     * Event listener for the quiz form submission.
     * Sends the form data to the server and handles the response.
     * @param {Event} event - The submit event.
     */
    document.getElementById('quizForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        let un = document.getElementById("uname");
        if (!un) {
            // Retrieve the username from localStorage
            const username = localStorage.getItem('myName');
            const EditFlag = localStorage.getItem('EditFlag');
            localStorage.setItem("EditFlag", "false");
            
            // Create a hidden input field for the username
            const usernameInput = document.createElement('input');
            usernameInput.type = 'hidden';
            usernameInput.id = 'uname';  // Set the name for the form field
            usernameInput.name = 'username';  // Set the name for the form field
            usernameInput.value = username;   // Set the value to the retrieved username
            
            const editflagInput = document.createElement('input');
            editflagInput.type = 'hidden';
            editflagInput.id = 'editflag';  // Set the name for the form field
            editflagInput.name = 'editflag';  // Set the name for the form field
            editflagInput.value = EditFlag;   // Set the value to the retrieved username
            
            // Append the hidden input field to the form
            this.appendChild(usernameInput);
            this.appendChild(editflagInput);
        }

        const form = event.target;
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new URLSearchParams(formData), // Convert formData to URL-encoded format
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.ok) {
                const result = await response.json();
                // Handle success - redirect or update the UI as needed
                if (result.message === 'Quiz saved successfully!' || result.message === 'Draft saved successfully!') {
                    window.location.href = '/myquizzes.html'; // Redirect to quizzes page
                } else {
                    // Show error message to the user
                    alert('Operation failed: ' + result.message);
                }
            } else {
                console.error('Error:', response.statusText);
                alert('Error: ' + response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Fetch error: ' + error.message);
        }
    });
}

/**
 * Retrieves the quiz code from localStorage and updates the leaderboard table.
 * This function is executed when the element with ID "qcode" is present in the DOM.
 */
const qcode = document.getElementById("qcode");
if (qcode) {
    /**
     * The top 10 leaderboard entries retrieved from localStorage.
     * @type {Array<Object>}
     */
    let ttop10 = JSON.parse(localStorage.getItem("top10"));
    
    /**
     * The quiz code retrieved from localStorage.
     * @type {string}
     */
    let code = localStorage.getItem("code");
    
    qcode.innerHTML = "Quiz Code: " + code;
    updateLeaderboard(ttop10);
}

/**
 * Updates the leaderboard table with the given data.
 * @param {Array<Object>} data - An array of leaderboard entries, each containing:
 *   - {string} username - The name of the user.
 *   - {number} score - The score of the user.
 *   - {string} lastanswered - The date and time the quiz was last answered.
 */
function updateLeaderboard(data) {
    data.forEach((entry, index) => {
        /**
         * Formats the date and time of the last answered quiz to a localized string.
         * @type {string}
         */
        var s = new Date(entry.lastanswered).toLocaleString('en-GB', {timeZone: 'Asia/Kolkata'});
        
        // Update the name and score cells
        document.getElementById(`name${index + 1}`).innerHTML = entry.username;
        document.getElementById(`score${index + 1}`).innerHTML = entry.score;
        document.getElementById(`ansdon${index + 1}`).innerHTML = s;
    });
}

/**
 * Fetches and displays the list of quizzes created by the current user.
 * This function is executed when the element with ID "myquiztb" is present in the DOM.
 */
const myquiztb = document.getElementById("myquiztb");
if (myquiztb) {
    try {
        /**
         * The username retrieved from localStorage.
         * @type {string}
         */
        const uname = localStorage.getItem("myName");
        
        /**
         * Data object to be sent in the POST request to fetch user's quizzes.
         * @type {Object}
         * @property {string} username - The username of the current user.
         */
        let data = {
            username: uname
        };

        fetch(`/api/v1/users/quizzes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(myquizzes => {
            /**
             * The table body element where the quiz data will be inserted.
             * @type {HTMLTableSectionElement}
             */
            const tbody = document.getElementById('myquiztb');
            
            myquizzes.forEach((quiz, index) => {
                /**
                 * Formats the date of the last update to a localized string.
                 * @type {string}
                 */
                var s = new Date(quiz.lastupdate).toLocaleString('en-GB', {timeZone: 'Asia/Kolkata'});
                
                const row = document.createElement('tr');
                
                /**
                 * The status of the quiz, either "Active" or "Inactive".
                 * @type {string}
                 */
                var status;
                if (quiz.status)
                    status = "Active";
                else
                    status = "Inactive";

                row.innerHTML = `
                <td>${index + 1}</td>
                <td>${quiz.code}</td>
                <td><button class="resp-quiz tbbtn" data-quiz-code="${quiz.code}" data-uname="${uname}">View Responses</button></td>
                <td><button class="view-quiz tbtn" data-quiz-code="${quiz.code}" data-uname="${uname}">View</button></td>
                <td><button class="edit-quiz tbtn" data-quiz-code="${quiz.code}" data-uname="${uname}">Edit</button></td>
                <td><button class="delete-quiz tbtn" data-quiz-code="${quiz.code}" data-uname="${uname}">Delete</button></td>
                <td>${status}<button class="toggle-quiz tbtn" data-quiz-code="${quiz.code}" data-uname="${uname}">Toggle</button></td>
                <td>${s}</td>
                `;
                tbody.appendChild(row);
            });
        })
    } catch (err) {
        console.error('Error fetching quizzes:', err);
    }
}

/**
 * Fetches and displays the list of answers submitted by the current user.
 * This function is executed when the element with ID "myanstb" is present in the DOM.
 */
const myanstb = document.getElementById("myanstb");
if (myanstb) {
    try {
        /**
         * The username retrieved from localStorage.
         * @type {string}
         */
        const uname = localStorage.getItem("myName");
        
        /**
         * Data object to be sent in the POST request to fetch user's answers.
         * @type {Object}
         * @property {string} username - The username of the current user.
         */
        let data = {
            username: uname
        };

        fetch(`/api/v1/users/answers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(myanswers => {
            /**
             * The table body element where the answer data will be inserted.
             * @type {HTMLTableSectionElement}
             */
            const anstbody = document.getElementById('myanstb');
            
            myanswers.forEach((ind, index) => {
                /**
                 * Formats the date when the answer was submitted to a localized string.
                 * @type {string}
                 */
                var s = new Date(ind.date).toLocaleString('en-GB', {timeZone: 'Asia/Kolkata'});

                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${(index + 1)}</td>
                <td>${ind.code}</td>
                <td><a href="/responses?quizCode=${ind.code}">${ind.score}</a></td>
                <td><button class="review-quiz tbbtn" data-quiz-code="${ind.code}" data-uname="${uname}">Review</button></td>
                <td>${s}</td>
                `;
                anstbody.appendChild(row);
            });
        })
    } catch (err) {
        console.error('Error fetching answers:', err);
    }
}

function leaderboard() {
    let code = localStorage.getItem("code")
    // Send a POST request
    fetch(`/api/v1/quizzes/${code}/leaderboard`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then( data => {
        let top10 = data.Top10;
        localStorage.setItem("top10", JSON.stringify(top10));
        window.location.href = "/leaderboard.html";
    })
}

/**
 * Sends a request to the server to fetch the quiz review data for the current user and quiz code,
 * then redirects to the review page.
 */
function review() {
    /**
     * The username retrieved from localStorage.
     * @type {string}
     */
    let name = localStorage.getItem("myName");
    
    /**
     * The quiz code retrieved from localStorage.
     * @type {string}
     */
    let code = localStorage.getItem("code");

    /**
     * The data object to be sent in the POST request for fetching the quiz review.
     * @type {Object}
     * @property {string} username - The username of the current user.
     * @property {string} code - The code of the quiz being reviewed.
     */
    let data = {
        username: name,
        code: code
    };

    fetch(`/api/v1/quizzes/review`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        // Save the review data in localStorage
        localStorage.setItem("Review", JSON.stringify(data));
        // Redirect to the review page
        window.location.href = "/review.html";
    });
}

/**
 * Handles the display and navigation of quiz review questions.
 */
const quizreview = document.getElementById("quizreview");
const ans = document.getElementById("ans");
const userans = document.getElementById("userans");

if (quizreview) {
    /**
     * The quiz review data retrieved from localStorage.
     * @type {Array<Object>}
     * @property {string} question - The quiz question.
     * @property {string} a - Option A.
     * @property {string} b - Option B.
     * @property {string} c - Option C.
     * @property {string} d - Option D.
     * @property {string} ans - The correct answer.
     * @property {string} userans - The user's answer.
     */
    let arr = JSON.parse(localStorage.getItem("Review"));
    let quizData = arr;

    /**
     * The current question index.
     * @type {number}
     */
    let qno = 0;

    /**
     * Loads the current quiz question based on the `qno` index.
     */
    function loadQuiz() {
        if (qno === quizData.length - 1) {
            submitBtn.innerHTML = "Exit";
        } else {
            submitBtn.innerHTML = "Next";
        }

        const CurrData = quizData[qno];
        qnoview.innerText = "Question " + (qno + 1);
        questionEl.innerText = CurrData.question;
        a_text.innerText = CurrData.a;
        b_text.innerText = CurrData.b;
        d_text.innerText = CurrData.d;
        c_text.innerText = CurrData.c;
        ans.innerText = CurrData.ans;
        userans.innerText = CurrData.userans;

        // Highlight the user's answer
        if (CurrData.ans === CurrData.userans) {
            userans.style.color = "green";
        } else {
            userans.style.color = "red";
        }
    }

    /**
     * Handles the click event for the submit button.
     * Moves to the next question or exits the review.
     */
    submitBtn.addEventListener("click", async () => {
        const currentButton = document.getElementById(`q${qno + 1}`);
        if (currentButton) {
            currentButton.style.backgroundColor = "#5e174e";
        }
        qno++;
        if (qno < quizData.length) {
            loadQuiz();
        } else {
            submitQuiz();
        }
    });

    /**
     * Redirects to the home page.
     */
    function submitQuiz() {
        window.location.href = "home.html";
    }

    // Create navigation buttons for each question
    for (let i = 1; i <= quizData.length; i++) {
        const qbut = `<button class="qnavbtn" id="q${i}">${i}</button>`;
        document.querySelector('.qnav').insertAdjacentHTML('beforeend', qbut);
    }

    // Add event listeners to each navigation button
    document.querySelectorAll('.qnavbtn').forEach(button => {
        button.addEventListener('click', function() {
            qno = parseInt(this.id.replace('q', '')) - 1;
            loadQuiz();
        });
    });
}

/**
 * Handles the display and navigation of quiz questions for viewing purposes.
 */
const viewquiz = document.getElementById("viewquiz");

if (viewquiz) {
    /**
     * The quiz data retrieved from localStorage.
     * @type {Array<Object>}
     * @property {string} question - The quiz question.
     * @property {string} a - Option A.
     * @property {string} b - Option B.
     * @property {string} c - Option C.
     * @property {string} d - Option D.
     * @property {string} ans - The correct answer.
     */
    let arr = JSON.parse(localStorage.getItem("View"));
    let quizData = arr;

    /**
     * The current question index.
     * @type {number}
     */
    let qno = 0;

    /**
     * Loads and displays the current quiz question based on the `qno` index.
     */
    function loadQuiz() {
        // Update the submit button text based on the current question index
        if (qno === quizData.length - 1) {
            submitBtn.innerHTML = "Exit";
        } else {
            submitBtn.innerHTML = "Next";
        }

        const CurrData = quizData[qno];
        qnoview.innerText = "Question " + (qno + 1);
        questionEl.innerText = CurrData.question;
        a_text.innerText = CurrData.a;
        b_text.innerText = CurrData.b;
        d_text.innerText = CurrData.d;
        c_text.innerText = CurrData.c;
        ans.innerText = CurrData.ans;
    }

    /**
     * Handles the click event for the submit button.
     * Moves to the next question or exits the review.
     */
    submitBtn.addEventListener("click", async () => {
        const currentButton = document.getElementById(`q${qno + 1}`);
        if (currentButton) {
            currentButton.style.backgroundColor = "#5e174e";
        }
        qno++;
        if (qno < quizData.length) {
            loadQuiz();
        } else {
            submitQuiz();
        }
    });

    /**
     * Redirects to the home page.
     */
    function submitQuiz() {
        window.location.href = "home.html";
    }

    // Create navigation buttons for each question
    for (let i = 1; i <= quizData.length; i++) {
        const qbut = `<button class="qnavbtn" id="q${i}">${i}</button>`;
        document.querySelector('.qnav').insertAdjacentHTML('beforeend', qbut);
    }

    // Add event listeners to each navigation button
    document.querySelectorAll('.qnavbtn').forEach(button => {
        button.addEventListener('click', function() {
            qno = parseInt(this.id.replace('q', '')) - 1;
            loadQuiz();
        });
    });
}

/**
 * Retrieves the edit flag from localStorage to determine if the quiz is being edited.
 * @type {string|null}
 */
const editflag = localStorage.getItem("EditFlag");

/**
 * The HTML element for the quiz code input field.
 * @type {HTMLInputElement|null}
 */
const quizcip = document.getElementById("quizCode");

/**
 * Handles quiz editing and form submission.
 * @fileoverview This script manages the editing of quiz details. It populates the quiz form with existing quiz data
 * when in edit mode, and handles the creation of new quizzes or saving drafts. It also provides a logout functionality
 * to redirect users to the home page.
 */

if (addQ && editflag == "true") {
    /**
     * The quiz data retrieved from localStorage for editing.
     * @type {Object}
     * @property {string} code - The quiz code.
     * @property {Array<Object>} questions - The list of quiz questions.
     * @property {string} questions[].question - The question text.
     * @property {string} questions[].a - Option A.
     * @property {string} questions[].b - Option B.
     * @property {string} questions[].c - Option C.
     * @property {string} questions[].d - Option D.
     * @property {string} questions[].ans - The correct answer.
     */
    const edit = JSON.parse(localStorage.getItem("Edit"));

    // Set the quiz code for editing and make it readonly
    quizcip.value = edit.code;
    quizcip.setAttribute("readonly", "readonly");

    // Populate the quiz form with existing questions
    for (let i = 0; i < edit.questions.length; i++) {
        addQ.click(); // Add a new question block
        const qt = document.getElementById(`questionText${(i + 1)}`);
        const opA = document.getElementById(`optionA${(i + 1)}`);
        const opB = document.getElementById(`optionB${(i + 1)}`);
        const opC = document.getElementById(`optionC${(i + 1)}`);
        const opD = document.getElementById(`optionD${(i + 1)}`);
        const qans = document.getElementById(`answer${(i + 1)}`);
        
        // Set the values for each question block
        qt.value = edit.questions[i].question;
        opA.value = edit.questions[i].a;
        opB.value = edit.questions[i].b;
        opC.value = edit.questions[i].c;
        opD.value = edit.questions[i].d;
        qans.value = edit.questions[i].ans;
    }
}

if (addQ) {
    /**
     * Event listener for the draft button to change the form action
     * to save the quiz as a draft.
     */
    document.getElementById("draftbtn").addEventListener("click", () => {
        const qf = document.getElementById("quizForm");
        qf.setAttribute("action", "/api/v1/drafts"); // Set action to save as draft
        subMake.click(); // Trigger form submission
        qf.setAttribute("action", "/api/v1/quizzes"); // Reset action to original endpoint
    });
}

/**
 * The HTML element for the logout button.
 * @type {HTMLButtonElement|null}
 */
const logout = document.getElementById("logoutbtn");

/**
 * Event listener for the logout button to redirect the user to the home page.
 */
if (logout) {
    logout.addEventListener("click", () => {
        window.location.href = '/';
    });
}