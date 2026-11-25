document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth('../index.html')) return;

  const examForm = document.getElementById('exam-form');
  const examFormTitle = document.getElementById('exam-form-title');
  const examIdInput = document.getElementById('exam-id');
  const codeInput = document.getElementById('exam-code');
  const titleInput = document.getElementById('exam-title');
  const durationInput = document.getElementById('exam-duration');
  const passInput = document.getElementById('exam-pass');
  const descInput = document.getElementById('exam-description');
  const cancelExamBtn = document.getElementById('exam-cancel-btn');
  const examFeedback = document.getElementById('exam-feedback');
  const examsTbody = document.getElementById('exams-table-body');

  const questionsManager = document.getElementById('questions-manager');
  const selectedExamName = document.getElementById('selected-exam-name');
  const questionForm = document.getElementById('question-form');
  const questionTextInput = document.getElementById('question-text');
  const answersDraftList = document.getElementById('answers-draft-list');
  const addAnswerRowBtn = document.getElementById('add-answer-row-btn');
  const questionFeedback = document.getElementById('question-feedback');
  const examQuestionsList = document.getElementById('exam-questions-list');

  let activeExamIdForQuestions = null;

  function createAnswerRow(text = '', isCorrect = false) {
    const row = document.createElement('div');
    row.className = 'answer-draft-row';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'correct-answer-radio';
    radio.checked = isCorrect;
    radio.required = true;

    const correctLabel = document.createElement('label');
    correctLabel.textContent = 'Correcta';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'answer-text-input';
    textInput.placeholder = 'Descripción de la respuesta';
    textInput.value = text;
    textInput.required = true;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Quitar';
    removeBtn.addEventListener('click', () => {
      const rows = answersDraftList.querySelectorAll('.answer-draft-row');
      if (rows.length <= 2) {
        questionFeedback.textContent = 'Cada pregunta debe tener al menos 2 respuestas.';
        return;
      }
      const wasChecked = radio.checked;
      row.remove();
      if (wasChecked) {
        const firstRadio = answersDraftList.querySelector('input[type="radio"]');
        if (firstRadio) firstRadio.checked = true;
      }
    });

    row.append(radio, ' ', correctLabel, ' ', textInput, ' ', removeBtn);
    answersDraftList.appendChild(row);
  }

  function resetAnswerDrafts() {
    answersDraftList.replaceChildren();
    createAnswerRow('', true);
    createAnswerRow('', false);
  }

  function resetExamForm() {
    examForm.reset();
    examIdInput.value = '';
    examFormTitle.textContent = 'Crear Examen';
  }

  function renderExams() {
    const exams = getData(STORAGE_KEYS.EXAMS);
    examsTbody.replaceChildren();

    exams.forEach((exam) => {
      const tr = document.createElement('tr');
      const cells = [
        exam.code,
        exam.title,
        String(exam.durationMinutes),
        `${exam.passPercentage}%`,
        String(exam.questions.length)
      ];

      cells.forEach((value) => {
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
      });

      const actionsTd = document.createElement('td');

      const questionsBtn = document.createElement('button');
      questionsBtn.type = 'button';
      questionsBtn.textContent = 'Preguntas';
      questionsBtn.addEventListener('click', () => {
        activeExamIdForQuestions = exam.id;
        questionFeedback.textContent = '';
        resetAnswerDrafts();
        renderQuestionsForActiveExam();
      });

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.textContent = 'Actualizar';
      editBtn.addEventListener('click', () => {
        examIdInput.value = exam.id;
        codeInput.value = exam.code;
        titleInput.value = exam.title;
        durationInput.value = exam.durationMinutes;
        passInput.value = exam.passPercentage;
        descInput.value = exam.description;
        examFormTitle.textContent = 'Actualizar Examen';
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.addEventListener('click', () => {
        const filtered = getData(STORAGE_KEYS.EXAMS).filter((ex) => ex.id !== exam.id);
        setData(STORAGE_KEYS.EXAMS, filtered);
        if (activeExamIdForQuestions === exam.id) {
          activeExamIdForQuestions = null;
          questionsManager.hidden = true;
        }
        examFeedback.textContent = 'Examen eliminado.';
        renderExams();
      });

      actionsTd.append(questionsBtn, ' ', editBtn, ' ', deleteBtn);
      tr.appendChild(actionsTd);
      examsTbody.appendChild(tr);
    });
  }

  function renderQuestionsForActiveExam() {
    const exams = getData(STORAGE_KEYS.EXAMS);
    const exam = exams.find((ex) => ex.id === activeExamIdForQuestions);

    if (!exam) {
      questionsManager.hidden = true;
      return;
    }

    questionsManager.hidden = false;
    selectedExamName.textContent = `${exam.code} - ${exam.title}`;
    examQuestionsList.replaceChildren();

    if (exam.questions.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.textContent = 'Este examen aún no tiene preguntas.';
      examQuestionsList.appendChild(emptyMsg);
      return;
    }

    exam.questions.forEach((q, qIndex) => {
      const container = document.createElement('div');
      const headerP = document.createElement('p');
      const strongTitle = document.createElement('strong');
      strongTitle.textContent = `${qIndex + 1}. ${q.text} `;

      const delQuestionBtn = document.createElement('button');
      delQuestionBtn.type = 'button';
      delQuestionBtn.textContent = 'Eliminar pregunta';
      delQuestionBtn.addEventListener('click', () => {
        const currentExams = getData(STORAGE_KEYS.EXAMS);
        const currentExam = currentExams.find((ex) => ex.id === activeExamIdForQuestions);
        if (!currentExam) return;
        currentExam.questions = currentExam.questions.filter((item) => item.id !== q.id);
        setData(STORAGE_KEYS.EXAMS, currentExams);
        renderExams();
        renderQuestionsForActiveExam();
      });

      headerP.append(strongTitle, delQuestionBtn);

      const ul = document.createElement('ul');
      q.answers.forEach((ans) => {
        const li = document.createElement('li');
        li.textContent = ans.text;
        if (ans.isCorrect) {
          const badge = document.createElement('strong');
          badge.textContent = ' (Correcta)';
          li.appendChild(badge);
        }
        ul.appendChild(li);
      });

      container.append(headerP, ul);
      examQuestionsList.appendChild(container);
    });
  }

  examForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const exams = getData(STORAGE_KEYS.EXAMS);
    const editingId = examIdInput.value;
    const existingExam = editingId ? exams.find((ex) => ex.id === editingId) : null;

    const examData = {
      id: editingId || `ex-${Date.now()}`,
      code: codeInput.value.trim(),
      title: titleInput.value.trim(),
      durationMinutes: Number(durationInput.value),
      passPercentage: Number(passInput.value),
      description: descInput.value.trim(),
      questions: existingExam ? existingExam.questions : []
    };

    if (editingId) {
      const idx = exams.findIndex((ex) => ex.id === editingId);
      if (idx !== -1) exams[idx] = examData;
      examFeedback.textContent = 'Examen actualizado.';
    } else {
      exams.push(examData);
      examFeedback.textContent = 'Examen creado.';
    }

    setData(STORAGE_KEYS.EXAMS, exams);
    resetExamForm();
    renderExams();
    if (activeExamIdForQuestions === examData.id) {
      renderQuestionsForActiveExam();
    }
  });

  cancelExamBtn.addEventListener('click', () => {
    resetExamForm();
    examFeedback.textContent = '';
  });

  addAnswerRowBtn.addEventListener('click', () => createAnswerRow('', false));

  questionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeExamIdForQuestions) return;

    const rows = Array.from(answersDraftList.querySelectorAll('.answer-draft-row'));
    const checkedRadios = rows.filter((r) => r.querySelector('input[type="radio"]').checked);

    if (checkedRadios.length !== 1) {
      questionFeedback.textContent = 'Debe marcar una respuesta correcta.';
      return;
    }

    const answers = rows.map((row, index) => ({
      id: `ans-${Date.now()}-${index}`,
      text: row.querySelector('.answer-text-input').value.trim(),
      isCorrect: row.querySelector('input[type="radio"]').checked
    }));

    const exams = getData(STORAGE_KEYS.EXAMS);
    const exam = exams.find((ex) => ex.id === activeExamIdForQuestions);
    if (!exam) return;

    exam.questions.push({
      id: `q-${Date.now()}`,
      text: questionTextInput.value.trim(),
      answers
    });

    setData(STORAGE_KEYS.EXAMS, exams);
    questionForm.reset();
    resetAnswerDrafts();
    questionFeedback.textContent = 'Pregunta guardada con éxito.';
    renderExams();
    renderQuestionsForActiveExam();
  });

  resetAnswerDrafts();
  renderExams();
});