const username = document.getElementById("username");
const password = document.getElementById("password");
const logsub = document.getElementById("logsub");
const regsub = document.getElementById("reggsub");

if(username) {
    username.addEventListener("change", () => {
        localStorage.setItem("myName", username.value);
    })  
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

const topicEls = document.querySelectorAll(".topic");
const levelEls = document.querySelectorAll(".level");
const selbtn = document.getElementById("selbtn");

const gk = document.getElementById("gk");
const sci = document.getElementById("sci");
const math = document.getElementById("math");
const l1 = document.getElementById("l1");
const l2 = document.getElementById("l2");
const l3 = document.getElementById("l3");

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
    selbtn.addEventListener("click", ()=>{
        let topic;
        let level;
        topicEls.forEach(topicEls => {
            if (topicEls.checked)
                topic = topicEls.id;
        })
        levelEls.forEach(levelEls => {
            if (levelEls.checked)
                level = levelEls.id;
        })
        if (topic === undefined || level === undefined) {
            alert("Select both topic and level");
        } else {
            localStorage.setItem("topic", topic);
            localStorage.setItem("level", level);
            let code;
            switch(topic) {
                case 'General Knowledge':
                    switch(level) {
                        case 'Level 1': code = 'gk1'; break;
                        case 'Level 2': code = 'gk2'; break;
                        case 'Level 3': code = 'gk3'; break;
                    }
                    break;
                case 'Science':
                    switch(level) {
                        case 'Level 1': code = 'sc1'; break;
                        case 'Level 2': code = 'sc2'; break;
                        case 'Level 3': code = 'sc3'; break;
                    }
                    break;
                case 'Mathematics':
                    switch(level) {
                        case 'Level 1': code = 'mt1'; break;
                        case 'Level 2': code = 'mt2'; break;
                        case 'Level 3': code = 'mt3'; break;
                    }
                    break;
            }
            // Send a POST request
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
            .then( () => {
                window.location.href = "/quiz.html";
            })
        }
    })
}

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
    if (localStorage.getItem("Received") == undefined) {
        alert("Quiz does not exist");
    }
    let arr = JSON.parse(localStorage.getItem("Received"));
    let quizData = arr;
    let topic = localStorage.getItem("topic");
    let level = localStorage.getItem("level");

    let answers = new Map();
    answers.set("code", localStorage.getItem("code"));
    answers.set("name", localStorage.getItem("myName"));
    for (let i=0; i<quizData.length; i++) {
        answers.set(quizData[i]._id, "");
    }

    let qno = 0;

    // let answered = false;
    loadQuiz();
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

    function getSelected() {
        let answer = undefined;
        answerEls.forEach(answerEls => {
            if (answerEls.checked) {
                answer = answerEls.id;
            }
        });
        return answer;
    }

    function deselectAnswers() {
        if (!answers.get(quizData[qno]._id)) {
            answerEls.forEach(answerEls => {
                answerEls.checked = false;
            });
        } else {
            answerEls.forEach(answerEls => {
                if (answerEls.id == answers.get(quizData[qno]._id)) {
                    answerEls.checked = true;
                }
            });
        }
    }

    submitBtn.addEventListener("click", async () => {
        const answer = getSelected();
        const currentButton = document.getElementById(`q${qno + 1}`);
        if (currentButton) {
            currentButton.style.backgroundColor = "#5e174e";
        }

        if (answer) {
            answers.set(quizData[qno]._id, answer);
            a:
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

    function submitQuiz() {
        if (b4sub.style.display === "block") {
            b4sub.style.display = "none";
            afsub.style.display = "block";
            const ldb = document.getElementById("leaderboard"); 
            const rev = document. getElementById("review");

            ldb.addEventListener("click", leaderboard)
            rev.addEventListener("click", review)
        } else {
            b4sub.style.display = "block";
            afsub.style.display = "none";
        }
        const answersObject = Object.fromEntries(answers);
        let sc;
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
            res.innerHTML=`You answered  ${sc}/${quizData.length} questions correctly.`;
        })
    }
    
    for (let i=1; i<=quizData.length; i++) {
        const qbut = `<button class="qnavbtn" id="q${i}">${i}</button>`
        document.querySelector('.qnav').insertAdjacentHTML('beforeend', qbut);
    }
    
    document.querySelectorAll('.qnavbtn').forEach(button => {
        button.addEventListener('click', function() {
            qno = parseInt(this.id.replace('q', '')) - 1;
            loadQuiz();
        });
    });
}

const moyq = document.getElementById("myoq");
const tryQ = document.getElementById("try");
const qc = document.getElementById("qc");
const codeIP = document.getElementById("codeIP");
if (tryQ) {
    tryQ.addEventListener("click", () => {
        window.location.href = "/getTopicPage";
    })

    myoq.addEventListener("click", () => {
        window.location.href = "/makeQuiz";
    })

    qc.addEventListener("click", () => {
        localStorage.setItem("code", codeIP.value);
        localStorage.setItem("topic", "");
        localStorage.setItem("level", "");
        let code = codeIP.value;
        const data = {
            code: code,
        };

        fetch('/api/v1/quizzes/check-code', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then (response => response.json())
        .then (res => {
            if (res.message === "Quiz code exists") {
                // Send a POST request
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
                .then( () => {
                    window.location.href = "/quiz.html";
                })
            } else {
                alert("Quiz does not exist");
                codeIP.value = "";
            }
        })
    });
}

const addQ = document.getElementById("addQ");
const subMake = document.getElementById("subMake");
const draftbtn = document.getElementById("draftbtn");

const checkCode = document.getElementById("quizCode");
if (checkCode) {
    checkCode.addEventListener("change", () =>  {
        data = {
            code: checkCode.value
        }
        fetch('/api/v1/quizzes/check-code', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then (response => response.json())
        .then (res => {
            if (res.message !== "lesgooo") {
                alert(res.message);
                checkCode.value = "";
            }
        })
    })
}

if (addQ) {
    let hidden = subMake.getAttribute("hidden");
    let hid = draftbtn.getAttribute("hidden");
    let qcount = 0;
    addQ.addEventListener("click", () => {
        subMake.removeAttribute(hidden);
        draftbtn.removeAttribute(hid);
        qcount++;
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
            </div>`
        const dele = `<button class="dnavbtn" id="del${qcount}" data-id="${qcount}">Delete Question ${qcount}</button>`
        document.getElementById('questionsContainer').insertAdjacentHTML('beforeend', qele);
        document.getElementById('dnav').insertAdjacentHTML('beforeend', dele);
        document.getElementById(`del${qcount}`).addEventListener('click', function(event) {
            const id = this.getAttribute('data-id');
            qcount = deleteQuestion(id, qcount);
        });
    })
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
        if (qcount == 0) {
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
        })
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
                if (result.message === 'Quiz saved successfully!' || 'Draft saved successfully!') {
                    // Assuming result.success indicates a successful login
                    window.location.href = '/myquizzes.html'; // Redirect to home page
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


// Function to update the leaderboard table
const qcode = document.getElementById("qcode");
if (qcode) {
    let ttop10 = JSON.parse(localStorage.getItem("top10"));
    let code = localStorage.getItem("code");
    qcode.innerHTML = "Quiz Code: " + code;
    updateLeaderboard(ttop10);
}

function updateLeaderboard(data) {
    data.forEach((entry, index) => {
        var s = new Date(entry.lastanswered).toLocaleString('en-GB', {timeZone: 'Asia/Kolkata'});
        // Update the name and score cells
        document.getElementById(`name${index + 1}`).innerHTML = entry.username;
        document.getElementById(`score${index + 1}`).innerHTML = entry.score;
        document.getElementById(`ansdon${index + 1}`).innerHTML = s;
    });
}

const myquiztb = document.getElementById("myquiztb");
if (myquiztb) {
    try {
        const uname = localStorage.getItem("myName");
        fetch(`/api/v1/users/${uname}/quizzes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then (response => response.json())
        .then (myquizzes => {
            const tbody = document.getElementById('myquiztb');
            
            myquizzes.forEach((quiz, index) => {
                var s = new Date(quiz.lastupdate).toLocaleString('en-GB', {timeZone: 'Asia/Kolkata'});
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${index + 1}</td>
                <td>${quiz.code}</td>
                <td><button class="resp-quiz btn" data-quiz-code="${quiz.code}" data-uname="${uname}">View Responses</button></td>
                <td><button class="view-quiz btn" data-quiz-code="${quiz.code}" data-uname="${uname}">View Quiz</button></td>
                <td><button class="edit-quiz btn" data-quiz-code="${quiz.code}" data-uname="${uname}">Edit Quiz</button></td>
                <td><button class="delete-quiz btn" data-quiz-code="${quiz.code}" data-uname="${uname}">Delete</button></td>
                <td>${s}</td>
                `;
                tbody.appendChild(row);
            });
        })
    } catch (err) {
        console.error('Error fetching quizzes:', err);
    }
};

const mydrafttb = document.getElementById("mydrafttb");
if (mydrafttb) {
    try {
        const uname = localStorage.getItem("myName");
        fetch(`/api/v1/users/${uname}/drafts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then (response => response.json())
        .then (mydrafts => {
            const tbody = document.getElementById('mydrafttb');
            
            mydrafts.forEach((quiz, index) => {
                var s = new Date(quiz.lastupdate).toLocaleString('en-GB', {timeZone: 'Asia/Kolkata'});
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${quiz.code}</td>
                    <td><button class="view-quiz btn" data-quiz-code="${quiz.code}" data-uname="${uname}">View Quiz</button></td>
                    <td><button class="edit-quiz btn" data-quiz-code="${quiz.code}" data-uname="${uname}">Edit Quiz</button></td>
                    <td><button class="delete-quiz btn" data-quiz-code="${quiz.code}" data-uname="${uname}">Delete</button></td>
                    <td>${s}</td>
                    `;
                tbody.appendChild(row);
            });
        })
    } catch (err) {
        console.error('Error fetching quizzes:', err);
    }
};

const myanstb = document.getElementById("myanstb");
if (myanstb) {
    try {
        const uname = localStorage.getItem("myName");
        fetch(`/api/v1/users/${uname}/answers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then (response => response.json())
        .then (myanswers => {
            const anstbody = document.getElementById('myanstb');
            myanswers.forEach((ind, index) => {
                var s = new Date(ind.date).toLocaleString('en-GB', {timeZone: 'Asia/Kolkata'});
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${(index + 1)}</td>
                <td>${ind.code}</td>
                <td><a href="/responses?quizCode=${ind.code}">${ind.score}</a></td>
                <td><button class="review-quiz btn" data-quiz-code="${ind.code}" data-uname="${uname}">Review</button></td>
                <td>${s}</td>
                `;
                anstbody.appendChild(row);
            });
        })
    } catch (err) {
        console.error('Error fetching quizzes:', err);
    }
};

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

function review() {
    let name = localStorage.getItem("myName");
    let code = localStorage.getItem("code");

    fetch(`/api/v1/quizzes/${name}/${code}/review`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => {
        localStorage.setItem("Review", JSON.stringify(data));
        window.location.href = "/review.html"
    })
}

const quizreview = document.getElementById("quizreview");
const ans = document.getElementById("ans");
const userans = document.getElementById("userans");

if (quizreview) {
    let arr = JSON.parse(localStorage.getItem("Review"));
    let quizData = arr;

    let qno = 0;

    loadQuiz();
    function loadQuiz() {
        if (qno === quizData.length - 1)
            submitBtn.innerHTML = "Exit";
        else
            submitBtn.innerHTML = "Next";
        const CurrData = quizData[qno];
        qnoview.innerText = "Question " + (qno + 1);
        questionEl.innerText = CurrData.question;
        a_text.innerText = CurrData.a;
        b_text.innerText = CurrData.b;
        d_text.innerText = CurrData.d;
        c_text.innerText = CurrData.c;
        ans.innerText = CurrData.ans;
        userans.innerText = CurrData.userans;
        if (CurrData.ans == CurrData.userans) {
            userans.style.color = "green";
        } else {
            userans.style.color = "red";
        }
    }

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

    function submitQuiz() {
        window.location.href = "home.html"
    }
    
    for (let i=1; i<=quizData.length; i++) {
        const qbut = `<button class="qnavbtn" id="q${i}">${i}</button>`
        document.querySelector('.qnav').insertAdjacentHTML('beforeend', qbut);
    }
    
    document.querySelectorAll('.qnavbtn').forEach(button => {
        button.addEventListener('click', function() {
            qno = parseInt(this.id.replace('q', '')) - 1;
            loadQuiz();
        });
    });
}

const viewquiz = document.getElementById("viewquiz");

if (viewquiz) {
    let arr = JSON.parse(localStorage.getItem("View"));
    let quizData = arr;

    let qno = 0;

    loadQuiz();
    function loadQuiz() {
        if (qno === quizData.length - 1)
            submitBtn.innerHTML = "Exit";
        else
            submitBtn.innerHTML = "Next";
        const CurrData = quizData[qno];
        qnoview.innerText = "Question " + (qno + 1);
        questionEl.innerText = CurrData.question;
        a_text.innerText = CurrData.a;
        b_text.innerText = CurrData.b;
        d_text.innerText = CurrData.d;
        c_text.innerText = CurrData.c;
        ans.innerText = CurrData.ans;
    }

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

    function submitQuiz() {
        window.location.href = "home.html"
    }
    
    for (let i=1; i<=quizData.length; i++) {
        const qbut = `<button class="qnavbtn" id="q${i}">${i}</button>`
        document.querySelector('.qnav').insertAdjacentHTML('beforeend', qbut);
    }
    
    document.querySelectorAll('.qnavbtn').forEach(button => {
        button.addEventListener('click', function() {
            qno = parseInt(this.id.replace('q', '')) - 1;
            loadQuiz();
        });
    });
}

const editflag = localStorage.getItem("EditFlag");
const quizcip = document.getElementById("quizCode");

if (addQ && editflag == "true") {
    const edit = JSON.parse(localStorage.getItem("Edit"));
    quizcip.value = edit.code;
    quizcip.setAttribute("readonly", "readonly");
    for (let i=0; i<edit.questions.length; i++) {
        addQ.click();
        const qt = document.getElementById(`questionText${(i+1)}`);
        const opA = document.getElementById(`optionA${(i+1)}`);
        const opB = document.getElementById(`optionB${(i+1)}`);
        const opC = document.getElementById(`optionC${(i+1)}`);
        const opD = document.getElementById(`optionD${(i+1)}`);
        const qans = document.getElementById(`answer${(i+1)}`);
        qt.value = edit.questions[i].question;
        opA.value = edit.questions[i].a;
        opB.value = edit.questions[i].b;
        opC.value = edit.questions[i].c;
        opD.value = edit.questions[i].d;
        qans.value = edit.questions[i].ans;
    }
}

if (addQ) {
    document.getElementById("draftbtn").addEventListener("click", () => {
        const qf = document.getElementById("quizForm");
        qf.setAttribute("action", "/api/v1/drafts");
        subMake.click();
        qf.setAttribute("action", "/api/v1/quizzes");
    })
}

const logout = document.getElementById("logoutbtn");
if (logout) {
    logout.addEventListener("click", () => {
        window.location.href = '/';
    })
}