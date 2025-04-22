class Question {
    constructor(questionText, correctAnswer) {
        this.questionText = questionText;
        this.correctAnswer = correctAnswer;
    }

    ask() {
        throw new Error("Method 'ask() must be implemented.");
    }

    checkAnswer(userAnswer) {
        const isAnswerCorrect = userAnswer.trim().toLowerCase() === this.correctAnswer.trim().toLowerCase();
        return isAnswerCorrect;
    }
}

class YesNoQuestion extends Question {
    ask() {
        let answer;
        do {
            answer = prompt(`${this.questionText} (Answer "yes" or "no")`).trim().toLowerCase();
            if (answer !== "yes" && answer !== "no") {
                alert("Invalid answer. Please answer with 'yes' or 'no'.");
            }
        } while (answer !== "yes" && answer !== "no")

        this.userAnswer = answer;
        return this.checkAnswer(answer);
    }
}

class ShortAnswerQuestion extends Question {
    ask() {
        let answer;
        do {
            answer = prompt(`${this.questionText}`).trim();
            if (!answer) {
                alert("Answer cannot be empty. Please provide a valid response.");
            }
        } while (!answer);

        this.userAnswer = answer;
        return this.checkAnswer(answer);
    }
}

class SingleChoiceQuestion extends Question {
    constructor(questionText, options, correctAnswer) {
        super(questionText, correctAnswer);
        this.options = options;
    }

    ask() {
        let question = `${this.questionText}\n`;
        for (let key in this.options) {
            question += `${key}) ${this.options[key]}\n`;
        }
        question += "Answer a, b, c or d.";

        let answer;
        do {
            answer = prompt(question).trim().toLowerCase();
            if(!["a", "b", "c", "d"].includes(answer)) {
                alert("Invalid choice. Please select 'a', 'b', 'c', or 'd'.");
            }
        } while (!["a", "b", "c", "d"].includes(answer))

        this.answer = answer;

        return this.checkAnswer(answer);
    }
}

class MultipleChoicesQuestion extends Question {
    constructor(questionText, options, correctAnswers) {
        const normalizedAnswers = correctAnswers.map(answer => answer.toLowerCase());
        super(questionText, normalizedAnswers.sort().join(","));
        this.options = options;
        this.correctAnswersSet = new Set(normalizedAnswers);
    }

    ask() {
        let question = `${this.questionText}\n`;
        for (let key in this.options) {
            question += `${key}) ${this.options[key]}\n`;
        }
        question += "Answer a, b, c or d. Divide your answers using commas.";
        let answer;
        let cleanedAnswer;
        do {
            answer = prompt(question).trim().toLowerCase();
            cleanedAnswer = answer
                .split(",")
                .map(answer => answer.trim())
                .filter(Boolean);
            if (cleanedAnswer.length === 0 || cleanedAnswer.some(answer => !["a", "b", "c", "d"].includes(answer))) {
                alert("Invalid input. Please enter valid options (a, b, c, d), separated by commas.");
            }
        } while (cleanedAnswer.length === 0 || cleanedAnswer.some(answer => !["a", "b", "c", "d"].includes(answer)));
         
        this.userAnswer = answer;

        const userAnswerCleanedSet = new Set(cleanedAnswer); 

        if (userAnswerCleanedSet.size !== this.correctAnswersSet.size) {
            return false;
        }

        for (let value of this.correctAnswersSet) {
            if (!userAnswerCleanedSet.has(value)) {
                return false;
            }
        }

        return true;
    }
}

class QuizAttempt {
    constructor() {
        this.answers = [];
        this.score = 0;
    }

    addResult(question, userAnswer, isCorrect) {
        this.answers.push({ question, userAnswer, isCorrect })
        if (isCorrect) {
            this.score++;
        }
    }

    showResults() {
        let summary = "Quiz Results: \n\n";
        this.answers.forEach((questionObject, index) => {
            summary += `Question ${index + 1}: ${questionObject.question.questionText}\n`;
            summary += `Your answer: ${questionObject.userAnswer}\n`;
            summary += `Is Your answer correct: ${questionObject.isCorrect ? "Yes" : "No"}\n\n`;
        });
        summary += `Total Score: ${this.score} / ${this.answers.length}`;
        alert(summary);
        console.log("The user got " + this.score + " points");  
    }
}

class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.attempt = new QuizAttempt();
    }

    start() {
        this.askAllQuestions();
        this.showFinalResults();
        return this.attempt.score;
    }

    askAllQuestions() {
        for (let question of this.questions) {
            const isCorrect = question.ask();
            this.attempt.addResult(question, question.userAnswer, isCorrect);
        }
    }

    showFinalResults() {
        this.attempt.showResults()
    }

}

window.onload = function () {
    const quiz = new Quiz([
        new YesNoQuestion("Can a square be considered a rectangle?", "yes"),
        new ShortAnswerQuestion("What is the capital city of France?", "Paris"),
        new SingleChoiceQuestion(
            "Which gas is most abundant in the Earth's atmosphere?",
            {
                a: "oxygen",
                b: "hydrogen",
                c: "carbon dioxide",
                d: "nitrogen"
            },
            "d"
        ),
        new MultipleChoicesQuestion(
            "Which of the following countries are in Europe?",
            {
                a: "Australia",
                b: "France",
                c: "Spain",
                d: "Brazil"
              },
              ["b", "c"]
        )
    ]);

    quiz.start();
};