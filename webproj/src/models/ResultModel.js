// src/models/ResultModel.js
export class ResultModel {
    constructor(
      id,
      userId,
      quizId,
      correctAnswers,
      totalQuestions,
      scorePercent,
      durationSeconds,
      takenAt,
      userName = null,
      quizTitle = null,
      answers = null
    ) {
      this.id = id;
      this.userId = userId;
      this.quizId = quizId;
      this.correctAnswers = correctAnswers;
      this.totalQuestions = totalQuestions;
      this.scorePercent = scorePercent;
      this.durationSeconds = durationSeconds;
      this.takenAt = takenAt;
      this.userName = userName;
      this.quizTitle = quizTitle;
      this.answers = answers;
    }
  }
  