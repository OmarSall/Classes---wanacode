class Question {
  constructor(questionText, correctAnswer) {
    this.questionText = questionText;
    this.correctAnswer = correctAnswer;
  }

  ask() {
    throw new Error("Method 'ask()' must be implemented.");
  }

  checkAnswer(userAnswer) {
    const isAnswerCorrect =
      userAnswer.trim().toLowerCase() ===
      this.correctAnswer.trim().toLowerCase();
    return isAnswerCorrect;
  }
}

class YesNoQuestion extends Question {
  ask() {
    let answer;
    do {
      answer = prompt(`${this.questionText} (Answer "yes" or "no")`)
        .trim()
        .toLowerCase();
      if (answer !== "yes" && answer !== "no") {
        alert("Invalid answer. Please answer with 'yes' or 'no'.");
      }
    } while (answer !== "yes" && answer !== "no");

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
      if (!["a", "b", "c", "d"].includes(answer)) {
        alert("Invalid choice. Please select 'a', 'b', 'c', or 'd'.");
      }
    } while (!["a", "b", "c", "d"].includes(answer));

    this.answer = answer;

    return this.checkAnswer(answer);
  }
}

class MultipleChoicesQuestion extends Question {
  constructor(questionText, options, correctAnswers) {
    const normalizedAnswers = correctAnswers.map((answer) =>
      answer.toLowerCase()
    );
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
        .map((answer) => answer.trim())
        .filter(Boolean);
      if (
        cleanedAnswer.length === 0 ||
        cleanedAnswer.some((answer) => !["a", "b", "c", "d"].includes(answer))
      ) {
        alert(
          "Invalid input. Please enter valid options (a, b, c, d), separated by commas."
        );
      }
    } while (
      cleanedAnswer.length === 0 ||
      cleanedAnswer.some((answer) => !["a", "b", "c", "d"].includes(answer))
    );

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
    this.answers.push({ question, userAnswer, isCorrect });
    if (isCorrect) {
      this.score++;
    }
  }

  showResults() {
    let summary = "Quiz Results: \n\n";
    this.answers.forEach((questionObject, index) => {
      summary += `Question ${index + 1}: ${
        questionObject.question.questionText
      }\n`;
      summary += `Your answer: ${questionObject.userAnswer}\n`;
      summary += `Is Your answer correct: ${
        questionObject.isCorrect ? "Yes" : "No"
      }\n\n`;
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
    this.attempt.showResults();
  }
}

const questionData = [
  {
    type: "yesno",
    questionText: "Can a square be considered a rectangle?",
    correctAnswer: "yes",
  },
  {
    type: "short",
    questionText: "What is the capital city of France?",
    correctAnswer: "Paris",
  },
  {
    type: "single",
    questionText: "Which gas is most abundant in the Earth's atmosphere?",
    options: {
      a: "oxygen",
      b: "hydrogen",
      c: "carbon dioxide",
      d: "nitrogen",
    },
    correctAnswer: "d",
  },
  {
    type: "multiple",
    questionText: "Which of the following countries are in Europe?",
    options: {
      a: "Australia",
      b: "France",
      c: "Spain",
      d: "Brazil",
    },
    correctAnswer: ["b", "c"],
  },
];

const questionTypeMap = {
    yesno: (question) => new YesNoQuestion(question.questionText, question.correctAnswer),
    short: (question) => new ShortAnswerQuestion(question.questionText, question.correctAnswer),
    single: (question) => new SingleChoiceQuestion(question.questionText, question.options, question.correctAnswer),
    multiple: (question) => new MultipleChoicesQuestion(question.questionText, question.options, question.correctAnswer)
};

window.onload = function () {
  const questions = questionData.map(question => questionTypeMap[question.type](question));
  const quiz = new Quiz(questions);
  quiz.start();
};