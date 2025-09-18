
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestionsByQuiz, createQuestion, deleteQuestion } from "./services/questionService";
import { createOption, deleteOption } from "./services/optionService";
import "./ManageQuestions.css";

const emptyQ = { text: "", type: "single", quizId: 0, answer: "", options: [] };

const ManageQuestions = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ ...emptyQ, quizId: Number(quizId) });

  const load = async () => {
    const res = await getQuestionsByQuiz(quizId);
    setQuestions(res.data || []);
  };

  useEffect(() => {
    load();
  }, [quizId]);

  const addQuestion = async (e) => {
    e.preventDefault();
    if (!form.text) return alert("Text required");
    await createQuestion(form);
    setForm({ ...emptyQ, quizId: Number(quizId) });
    load();
  };

  const addOption = async (questionId) => {
    const text = prompt("Option text:");
    if (!text) return;
    const isCorrect = window.confirm("Is this option correct?");
    await createOption({ text, isCorrect, questionId });
    load();
  };

  return (
    <div className="manage-container">
      <h2>Manage Questions (Quiz #{quizId})</h2>
      <button className="manage-back" onClick={() => navigate(`/quizzes/${quizId}`)}>
        Back
      </button>

      {/* Forma za dodavanje pitanja */}
      <form onSubmit={addQuestion} className="manage-form">
        <input
          placeholder="Question text"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="single">single</option>
          <option value="multiple">multiple</option>
          <option value="truefalse">truefalse</option>
          <option value="fill">fill</option>
        </select>
        {(form.type === "fill" || form.type === "truefalse") && (
          <input
            placeholder={form.type === "fill" ? "Correct text answer" : "true/false"}
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
          />
        )}
        <button type="submit">Add Question</button>
      </form>

      {/* Lista pitanja */}
      {questions.map((q) => (
        <div key={q.id} className="manage-question-card">
          <div><strong>Q#{q.id}</strong> [{q.type}] {q.text}</div>
          {["fill", "truefalse"].includes((q.type || "").toLowerCase()) && (
            <div>Answer: {q.answer}</div>
          )}
          <div style={{ marginTop: 8 }}>
            <button onClick={() => addOption(q.id)}>+ Add Option</button>
            <button
              onClick={async () => {
                if (window.confirm("Delete question?")) {
                  await deleteQuestion(q.id);
                  load();
                }
              }}
            >
              Delete Question
            </button>
          </div>
          <ul className="manage-options">
            {(q.options || []).map((o) => (
              <li key={o.id}>
                {o.text} {o.isCorrect ? "(correct)" : ""}
                <button
                  onClick={async () => {
                    if (window.confirm("Delete option?")) {
                      await deleteOption(o.id);
                      load();
                    }
                  }}
                >
                  Delete option
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ManageQuestions;
