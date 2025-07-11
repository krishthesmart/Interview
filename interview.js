document.addEventListener('DOMContentLoaded', function() {
  const questions = [
    { question: "What is the purpose of an ARD (Automatic Rescue Device) in an elevator?", answer: "Power Outage" },
    { question: "What's a typical travel speed for home elevators (m/s)?", answer: "0.3 to 1.0" },
    { question: "Is licensing required for residential elevator installation?", answer: "No" },
    { question: "What safety feature stops doors from closing on obstructions?", answer: "Light Curtain" }
  ];

  let currentQuestionIndex = 0;
  let score = 0;
  let quizTaken = false; // Track if quiz has been taken

  const questionText = document.getElementById('question-text');
  const answerInput = document.getElementById('answer-input');
  const submitAnswerButton = document.getElementById('submit-answer');
  const resultArea = document.getElementById('result-area');
  const resultMessage = document.getElementById('result-message');
  const resetQuizButton = document.getElementById('reset-quiz');
  const countdownDisplay = document.getElementById('countdown');
  const quizContent = document.getElementById('quiz-content');

  // Rate limiting using localStorage
  const lastTakenTimeKey = 'lastInterviewTaken';
  let lastTakenTime = localStorage.getItem(lastTakenTimeKey);
  let timeRemaining = 0;

  function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    displayQuestion();
    quizContent.style.display = "block";
    resultArea.style.display = "none";
    countdownDisplay.style.display = "none";
  }

  function displayQuestion() {
    questionText.textContent = questions[currentQuestionIndex].question;
    answerInput.value = '';
  }

  function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();

    if (userAnswer.includes(correctAnswer)) {
      score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      displayQuestion();
    } else {
      endQuiz();
    }
  }

  function endQuiz() {
    quizContent.style.display = "none";
    resultArea.style.display = "block";

    let hired = score / questions.length >= 0.7; // Requires 70% or more

    resultMessage.textContent = hired ? "Hired! Welcome to GPlus Elevators!" : "Not Hired.  Please brush up on your elevator knowledge.";

    // Save the time to localStorage
    localStorage.setItem(lastTakenTimeKey, Date.now().toString());
    lastTakenTime = Date.now();
    startCountdown();
  }

  function resetQuiz() {
    localStorage.removeItem(lastTakenTimeKey); // Remove the time restriction
    lastTakenTime = null;
    startQuiz();
  }

  function startCountdown() {
    if (lastTakenTime) {
      let nextAvailableTime = parseInt(lastTakenTime) + 7 * 24 * 60 * 60 * 1000; // 1 week from last taken time
      timeRemaining = nextAvailableTime - Date.now();

      if (timeRemaining > 0) {
        quizContent.style.display = "none";
        resultArea.style.display = "none";
        countdownDisplay.style.display = "block";

        let countdownInterval = setInterval(function() {
          let days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
          let hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

          countdownDisplay.textContent = "You must wait " + days + "d " + hours + "h " + minutes + "m " + seconds + "s before taking the quiz again.";
          timeRemaining -= 1000;

          if (timeRemaining < 0) {
            clearInterval(countdownInterval);
            countdownDisplay.textContent = "You can take the quiz again!";
            countdownDisplay.style.display = "none";
            startQuiz();
          }
        }, 1000);
      } else {
        startQuiz();
      }
    } else {
      startQuiz();
    }
  }

  submitAnswerButton.addEventListener('click', checkAnswer);
  resetQuizButton.addEventListener('click', resetQuiz);

  startCountdown(); // Check if they can take the quiz immediately or have to wait
});
