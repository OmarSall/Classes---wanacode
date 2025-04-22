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
        const answer = prompt(`${this.questionText} (Answer "yes" or "no")`);
        this.userAnswer = answer;
        return this.checkAnswer(answer);
    }
}

class ShortAnswerQuestion extends Question {
    ask() {
        const answer = prompt(`${this.questionText}`);
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
        const userAnswer = prompt(question);
        this.userAnswer = userAnswer;
        return this.checkAnswer(userAnswer);
    }
}

class MultipleChoicesQuestion extends Question {
    constructor(questionText, options, correctAnswer) {
        const normalizedAnswers = correctAnswer.map(answer => answer.toLowerCase());
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
        const userAnswer = prompt(question);
        this.userAnswer = userAnswer;

        const cleanedUserAnswer = userAnswer
            .toLowerCase()
            .split(",")
            .map(answer => answer.trim())
            .filter(Boolean);
        const userAnswerCleanedSet = new Set(cleanedUserAnswer); 

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
    }

    start() {
        const attempt = new QuizAttempt();
        for (let question of this.questions) {
            const isCorrect = question.ask();
            attempt.addResult(question, question.userAnswer, isCorrect);
        }
        attempt.showResults();
        return attempt.score;
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