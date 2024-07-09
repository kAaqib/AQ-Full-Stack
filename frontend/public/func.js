const username = document.getElementById("username");
const password = document.getElementById("password");
const logsub = document.getElementById("logsub");

if(username) {
    username.addEventListener("change", () => {
        localStorage.setItem("myName", username.value);
    })  
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

    const data = {
      code: code
    };

    // Send a POST request
    fetch("http://127.0.0.1:3000/getQuiz", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
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
      window.location.href = "http://127.0.0.1:3000/getQuiz";
    })
  })
}

const quiz = document.getElementById("quiz");
const answerEls = document.querySelectorAll(".answer");
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

      ldb.addEventListener("click", async () => {
        const data = {
          code: localStorage.getItem("code")
        };
        // Send a POST request
        fetch("http://127.0.0.1:3000/leaderboard", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then( data => {
            let top10 = data.Top10;
            localStorage.setItem("top10", JSON.stringify(top10));
            window.location.href = "http://127.0.0.1:3000/leaderboard.html";
        })
      })
    } else {
      b4sub.style.display = "block";
      afsub.style.display = "none";
    }
    const answersObject = Object.fromEntries(answers);
    let sc;
    fetch("http://127.0.0.1:3000/getScore", {
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
        window.location.href = "http://127.0.0.1:3000/getTopicPage";
    })

    myoq.addEventListener("click", () => {
        window.location.href = "http://127.0.0.1:3000/makeQuiz";
    })

    qc.addEventListener("click", () => {
        localStorage.setItem("code", codeIP.value);
        localStorage.setItem("topic", "");
        localStorage.setItem("level", "");
        const data = {
            code: codeIP.value,
        };

        // Send a POST request
        fetch("http://127.0.0.1:3000/getQuiz", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("Received", JSON.stringify(data.questions));
        })
        .catch(error => {
            console.error("Error:", error);
        })
        .then( () => {
            window.location.href = "http://127.0.0.1:3000/getQuiz";
        })
    });
}

const addQ = document.getElementById("addQ");
const subMake = document.getElementById("subMake");

if (addQ) {
    let hidden = subMake.getAttribute("hidden");
    let qcount = 0;
    addQ.addEventListener("click", () => {
        subMake.removeAttribute(hidden);
        qcount++;
        console.log(qcount);
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
            qcount = deleteQuestion(id, qcount, hidden);
        });
    })
    function deleteQuestion(id, qcount, hidden) {
        const questionBlock = document.getElementById(`question${id}`);
    
        questionBlock.remove();
    
        const deleteButton = document.querySelector(`#del${qcount}`);
        if (deleteButton) {
            deleteButton.remove();
        }

        // Decrement the question count
        qcount--;
        if (qcount == 0) {
            subMake.setAttribute("hidden", "hidden")
        }
        // Update the remaining questions
        const remainingQuestions = document.querySelectorAll('.question-block');
        remainingQuestions.forEach((question, index) => {
            const newIndex = index + 1;
            console.log(newIndex);
            question.id = `question${newIndex}`;
            question.querySelector('h3').innerText = `Question ${newIndex}`;
            question.querySelector(`label[for^="questionText"]`).setAttribute('for', `questionText${newIndex}`);
            question.querySelector(`[id^="questionText"]`).id = `questionText${newIndex}`;
            question.querySelector(`[name^="questions"]`).name = `questions[${newIndex}][question]`;
            question.querySelector(`label[for^="optionA"]`).setAttribute('for', `optionA${newIndex}`);
            question.querySelector(`[id^="optionA"]`).id = `optionA${newIndex}`;
            question.querySelector(`[name^="questions"]`).name = `questions[${newIndex}][a]`;
            question.querySelector(`label[for^="optionB"]`).setAttribute('for', `optionB${newIndex}`);
            question.querySelector(`[id^="optionB"]`).id = `optionB${newIndex}`;
            question.querySelector(`[name^="questions"]`).name = `questions[${newIndex}][b]`;
            question.querySelector(`label[for^="optionC"]`).setAttribute('for', `optionC${newIndex}`);
            question.querySelector(`[id^="optionC"]`).id = `optionC${newIndex}`;
            question.querySelector(`[name^="questions"]`).name = `questions[${newIndex}][c]`;
            question.querySelector(`label[for^="optionD"]`).setAttribute('for', `optionD${newIndex}`);
            question.querySelector(`[id^="optionD"]`).id = `optionD${newIndex}`;
            question.querySelector(`[name^="questions"]`).name = `questions[${newIndex}][d]`;
            question.querySelector(`label[for^="answer"]`).setAttribute('for', `answer${newIndex}`);
            question.querySelector(`[id^="answer"]`).id = `answer${newIndex}`;
            question.querySelector(`[name^="questions"]`).name = `questions[${newIndex}][ans]`;
        });
        console.log(remainingQuestions);
        return qcount;
    }
    document.getElementById('quizForm').addEventListener('submit', function(event) {
        // Retrieve the username from localStorage
        const username = localStorage.getItem('myName');
    
        // Create a hidden input field for the username
        const usernameInput = document.createElement('input');
        usernameInput.type = 'hidden';
        usernameInput.name = 'username';  // Set the name for the form field
        usernameInput.value = username;   // Set the value to the retrieved username
    
        // Append the hidden input field to the form
        this.appendChild(usernameInput);
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
    console.log("Updating ldb");
    data.forEach((entry, index) => {
    // Update the name and score cells
    document.getElementById(`name${index + 1}`).innerHTML = entry.username;
    document.getElementById(`score${index + 1}`).innerHTML = entry.score;
  });
}

const myquiztb = document.getElementById("myquiztb");
if (myquiztb) {
    try {
        const uname = localStorage.getItem("myName");
        const data = {
            username: uname
        };
        fetch('http://127.0.0.1:3000/myquizzes', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then (response => response.json())
        .then (myquizzes => {
            const tbody = document.getElementById('myquiztb');
            
            myquizzes.forEach((quizCode, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${index + 1}</td>
                <td>${quizCode}</td>
                <td><a href="/responses?quizCode=${quizCode}">View Responses</a></td>
                `;
                tbody.appendChild(row);
            });
        })
    } catch (err) {
        console.error('Error fetching quizzes:', err);
    }
};

const quizrestb = document.getElementById("quizrestb");
if (quizrestb) {

}