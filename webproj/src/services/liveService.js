// src/services/liveService.js
import * as signalR from "@microsoft/signalr";

let connection = null;
const handlers = {}; // { eventName: Set<callbacks> }
let startPromise = null;

function getToken() {
  return localStorage.getItem("token");
}

function emit(event, payload) {
  if (!handlers[event]) return;
  for (const cb of handlers[event]) {
    try { cb(payload); } catch {}
  }
}

export function on(event, cb) {
  if (!handlers[event]) handlers[event] = new Set();
  handlers[event].add(cb);
  // vrati unsubscribe
  return () => handlers[event]?.delete(cb);
}

export async function connect() {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    return connection;
  }
  if (!startPromise) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_API_URL}/hubs/live`, {
        accessTokenFactory: () => getToken() || "",
      })
      .withAutomaticReconnect()
      .build();

    // mapiraj događaje sa servera
    connection.on("RoomUpdated", (snapshot) => emit("RoomUpdated", snapshot));
    connection.on("UserJoined", (data) => emit("UserJoined", data));
    connection.on("UserLeft", (data) => emit("UserLeft", data));
    connection.on("QuestionStarted", (q, snapshot) =>
      emit("QuestionStarted", { question: q, snapshot })
    );
    connection.on("QuestionEnded", (snapshot) => emit("QuestionEnded", snapshot));
    connection.on("LeaderboardUpdated", (snapshot) => emit("LeaderboardUpdated", snapshot));
    connection.on("AnswerResult", (res) => emit("AnswerResult", res));
    connection.on("QuizEnded", (snapshot) => emit("QuizEnded", snapshot));

    startPromise = connection.start().catch((err) => {
      startPromise = null;
      throw err;
    });
  }
  await startPromise;
  return connection;
}

// Public API
export async function createRoom(quizId, questionTimeSec = 30) {
  await connect();
  return await connection.invoke("AdminCreateRoom", Number(quizId), Number(questionTimeSec));
}

export async function joinRoom(roomCode, displayName) {
  await connect();
  return await connection.invoke("JoinRoom", String(roomCode), String(displayName || ""));
}

export async function leaveRoom(roomCode) {
  if (!connection) return;
  return await connection.invoke("LeaveRoom", String(roomCode));
}

export async function startQuiz(roomCode) {
  await connect();
  return await connection.invoke("StartQuiz", String(roomCode));
}

export async function nextQuestion(roomCode) {
  await connect();
  return await connection.invoke("NextQuestion", String(roomCode));
}

export async function submitAnswer(roomCode, answerDto) {
  await connect();
  return await connection.invoke("SubmitAnswer", String(roomCode), answerDto);
}

export async function endQuiz(roomCode) {
  await connect();
  return await connection.invoke("EndQuiz", String(roomCode));
}
