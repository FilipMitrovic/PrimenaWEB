// src/models/QuizModel.js
export class QuizModel {
    constructor(id, title, description, category, difficulty, timeLimit) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.category = category;
      this.difficulty = difficulty;
      this.timeLimit = timeLimit;
    }
  }
  