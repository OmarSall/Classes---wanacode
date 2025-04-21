class Question {
    constructor(questionText, correctAnswer) {
        this.text = this.text;
        this.correctAnswer = correctAnswer;
    }

    ask() {
        throw new Error("Method 'ask() must be implemented.");
    }

    checkAnswer(userAnswer) {
        isAnswerCorrect = userAnswer.trim().toLowerCase() === this.correctAnswer.toLowerCase();
        return isAnswerCorrect;
    }
}

class YesNoQuestion extends Question {

}

class ShortAnswerQuestion extends Question {

}

class SingleChoiceQuestion extends Question {
    constructor(text, options, correctAnswer) {
        super(text, correctAnswer);
        this.options = options;
    }

}

class MultipleChoicesQuestion extends Question {
    constructor(text, options, correctAnswer) {
        super(text, correctAnswers.map(answer => answer.toLowerCase()).sort().join(","));
        this.options = options;
        this.correctAnswersSet = new Set(correctAnswers.map(answer => answer.toLowerCase()));
    }
}

class QuizAttempt {
    constructor() {
        this.answers = [];
        this.score = 0;
    }

    addResult() {

    }

    showResults() {

    }
}

class Quiz {
    constructor(questions) {
        this.questions = questions;
    }

    start() {
        
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
            "Which of the following countries are in Europe?"
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
}