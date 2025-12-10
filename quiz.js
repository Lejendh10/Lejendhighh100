const quizData = [
    {
        id: 'q1',
        type: 'fill-blank',
        question: '1. The component of a web browser responsible for displaying web content is called the ________.',
        correctAnswer: 'RENDERING ENGINE',
        correctDisplay: 'Rendering Engine'
    },
    {
        id: 'q2',
        type: 'multiple-choice',
        question: '2. What was the first graphical web browser that popularized the World Wide Web?',
        correctAnswer: 'b', // Mosaic
        correctDisplay: 'b. Mosaic'
    },
    {
        id: 'q3',
        type: 'multiple-choice',
        question: '3. Which company initially developed the JavaScript V8 Engine?',
        correctAnswer: 'd', // Google
        correctDisplay: 'd. Google'
    },
    {
        id: 'q4',
        type: 'multiple-choice',
        question: '4. Which of these browser wars took place in late 1990s between Netscape Navigator and Internet Explorer?',
        correctAnswer: 'a', // The First Browser War
        correctDisplay: 'a. The First Browser War'
    },
    {
        id: 'q5',
        type: 'multi-select',
        question: '5. Select ALL of the following that are discussed as core Browser Security Features:',
        correctAnswer: ['sandboxing', 'sameorigin', 'https'],
        correctDisplay: 'Sandboxing, Same-Origin Policy, HTTPS'
    }
];

const totalQuestions = quizData.length;
const form = document.getElementById('assessmentQuiz');
const resultDiv = document.getElementById('results');
const overallResultDiv = document.getElementById('overall-result');
const scoreSummaryP = document.getElementById('score-summary');
const breakdownDiv = document.getElementById('question-breakdown');
const submitButton = document.getElementById('submitquiz');

// Pass threshold (percentage)
const passThreshold = 70;

/** 
 *
 */
function resetQuiz() {
    form.reset();

    if (resultDiv) resultDiv.style.display = 'none';

    submitButton.disabled = false;
    submitButton.textContent = 'Submit Quiz';

    const blocks = document.querySelectorAll('.question-block');
    blocks.forEach(block => {
        block.style.borderColor = '#ddd';
    });

    console.log('Quiz reset.');
}

/**
 * Calculate score and show results
 */
function calculateScore(event) {
    event.preventDefault();

    let score = 0;
    breakdownDiv.innerHTML = '';

    submitButton.disabled = true;
    submitButton.textContent = 'Submitted';

    quizData.forEach((q) => {
        let isCorrect = false;
        let userAnswer = '';
        const questionBlock = document.querySelector(`[data-question-id="${q.id}"]`);

        if (questionBlock) {
            questionBlock.style.borderColor = 'var(--incorrect-color, #ef4444)';
        }

        if (q.type === 'fill-blank') {
            const inputElement = document.getElementById(`${q.id}-input`);
            userAnswer = inputElement ? inputElement.value.trim() : '';
            if (userAnswer.toUpperCase() === q.correctAnswer.toUpperCase()) {
                isCorrect = true;
            }

        } else if (q.type === 'multiple-choice') {
            const radios = form.elements[`${q.id}_choice`];
            let selectedValue = '';

            if (radios) {
                if (radios.length === undefined) {
                    // single element
                    selectedValue = radios.value || '';
                } else {
                    const checked = Array.from(radios).find(r => r.checked);
                    selectedValue = checked ? checked.value : '';
                }
            }

            userAnswer = selectedValue;
            if (selectedValue === q.correctAnswer) {
                isCorrect = true;
            }

        } else if (q.type === 'multi-select') {
            const elements = form.elements[`${q.id}_multichoice`];
            const checkboxes = elements ? Array.from(elements) : [];
            const selectedCheckboxes = checkboxes
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            userAnswer = selectedCheckboxes.join(',');

            if (
                selectedCheckboxes.length === q.correctAnswer.length &&
                selectedCheckboxes.every(val => q.correctAnswer.includes(val))
            ) {
                isCorrect = true;
            }
        }

        if (isCorrect) {
            score++;
            if (questionBlock) questionBlock.style.borderColor = 'var(--correct-color, #10b981)';
        }

        const selectionHtml = q.type !== 'fill-blank' ? `<p>Your selection: ${userAnswer || 'No answer provided'}</p>` : '';

        breakdownDiv.innerHTML += `
        <div class="question-result">
           <p><strong>${q.question}</strong></p>
           <p class="result-status ${isCorrect ? 'correct' : 'incorrect'}">
                Result: ${isCorrect ? 'Correct' : 'Incorrect'}
           </p>
           <p class="correct-answer">
                Correct Answer: ${q.correctDisplay}
           </p>
           ${selectionHtml}
        </div>
        `;
    });

    const percentageVal = (score / totalQuestions) * 100;
    const percentage = percentageVal.toFixed(2);
    const overallPass = percentageVal >= passThreshold;

    overallResultDiv.textContent = overallPass ? 'Pass!' : 'Fail';
    overallResultDiv.className = overallPass ? 'pass' : 'fail';

    scoreSummaryP.textContent = `You scored ${score} out of ${totalQuestions} (${percentage}%)`;

    if (resultDiv) resultDiv.style.display = 'block';

    if (resultDiv) resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Register submit handler once (outside the scoring function)
if (form) {
    form.addEventListener('submit', calculateScore);
}
    