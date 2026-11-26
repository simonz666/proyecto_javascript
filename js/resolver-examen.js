document.addEventListener('DOMContentLoaded', () => {
  const catalogSection = document.getElementById('exam-catalog-section');
  const availableExamsList = document.getElementById('available-exams-list');

  const studentInfoSection = document.getElementById('student-info-section');
  const chosenExamTitle = document.getElementById('chosen-exam-title');
  const studentInfoForm = document.getElementById('student-info-form');
  const studentIdInput = document.getElementById('student-identification');
  const studentNameInput = document.getElementById('student-fullname');
  const backToCatalogBtn = document.getElementById('back-to-catalog-btn');

  const takeExamSection = document.getElementById('take-exam-section');
  const runnerExamTitle = document.getElementById('runner-exam-title');
  const runnerExamMeta = document.getElementById('runner-exam-meta');
  const timerDisplay = document.getElementById('timer-display');
  const examQuestionsForm = document.getElementById('exam-questions-form');
  const runnerQuestionsContainer = document.getElementById('runner-questions-container');

  const resultSection = document.getElementById('exam-result-section');
  const resultStudent = document.getElementById('result-student');
  const resultScore = document.getElementById('result-score');
  const resultStatus = document.getElementById('result-status');
  const newAttemptBtn = document.getElementById('new-attempt-btn');

  let currentExam = null;
  let currentStudent = null;
  let examSubmitted = false;
  let timerIntervalId = null;
  let remainingSeconds = 0;

  function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function stopTimer() {
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
    }
  }

  function startTimer(minutes, onFinish) {
    stopTimer();
    remainingSeconds = Math.max(1, Number(minutes) * 60);
    timerDisplay.textContent = formatTime(remainingSeconds);

    timerIntervalId = setInterval(() => {
      remainingSeconds -= 1;
      timerDisplay.textContent = formatTime(remainingSeconds);

      if (remainingSeconds <= 0) {
        stopTimer();
        if (typeof onFinish === 'function') {
          onFinish();
        }
      }
    }, 1000);
  }

  function showSection(target) {
    [catalogSection, studentInfoSection, takeExamSection, resultSection].forEach((sec) => {
      sec.hidden = sec !== target;
    });
  }

  function renderCatalog() {
    const exams = getData(STORAGE_KEYS.EXAMS);
    availableExamsList.replaceChildren();

    if (exams.length === 0) {
      const emptyP = document.createElement('p');
      emptyP.textContent = 'No hay exámenes disponibles en este momento.';
      availableExamsList.appendChild(emptyP);
      return;
    }

    exams.forEach((exam) => {
      const article = document.createElement('article');
      const heading = document.createElement('h3');
      heading.textContent = `${exam.title} (${exam.code})`;

      const desc = document.createElement('p');
      desc.textContent = exam.description;

      const meta = document.createElement('p');
      meta.textContent =
        `Tiempo para resolverlo: ${exam.durationMinutes} minutos | ` +
        `Porcentaje para aprobación: ${exam.passPercentage}% | ` +
        `Preguntas: ${exam.questions.length}`;

      const selectBtn = document.createElement('button');
      selectBtn.type = 'button';
      const hasQuestions = exam.questions.length > 0;
      selectBtn.disabled = !hasQuestions;
      selectBtn.textContent = hasQuestions ? 'Seleccionar examen' : 'Sin preguntas';
      selectBtn.addEventListener('click', () => {
        currentExam = exam;
        chosenExamTitle.textContent =
          `${exam.title} (${exam.durationMinutes} min — Aprobación: ${exam.passPercentage}%)`;
        studentInfoForm.reset();
        showSection(studentInfoSection);
      });

      article.append(heading, desc, meta, selectBtn, document.createElement('hr'));
      availableExamsList.appendChild(article);
    });
  }

  backToCatalogBtn.addEventListener('click', () => {
    currentExam = null;
    showSection(catalogSection);
  });

  studentInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentExam) return;

    currentStudent = {
      identification: studentIdInput.value.trim(),
      fullName: studentNameInput.value.trim()
    };

    startExamRunner(currentExam);
  });

  function startExamRunner(exam) {
    examSubmitted = false;
    runnerExamTitle.textContent = exam.title;
    runnerExamMeta.textContent =
      `Total de preguntas: ${exam.questions.length} | Porcentaje para aprobar: ${exam.passPercentage}%`;

    runnerQuestionsContainer.replaceChildren();

    exam.questions.forEach((q, idx) => {
      const fieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = `Pregunta ${idx + 1}: ${q.text}`;
      fieldset.appendChild(legend);

      q.answers.forEach((ans) => {
        const wrapper = document.createElement('div');
        const inputId = `q_${q.id}_a_${ans.id}`;

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = inputId;
        radio.name = `question_${q.id}`;
        radio.value = ans.id;

        const label = document.createElement('label');
        label.htmlFor = inputId;
        label.textContent = ans.text;

        wrapper.append(radio, ' ', label);
        fieldset.appendChild(wrapper);
      });

      runnerQuestionsContainer.appendChild(fieldset);
    });

    showSection(takeExamSection);

    startTimer(exam.durationMinutes, () => {
      finalizeExam();
    });
  }

  function finalizeExam() {
    if (examSubmitted || !currentExam || !currentStudent) return;
    examSubmitted = true;
    stopTimer();

    const totalQuestions = currentExam.questions.length;
    let correctCount = 0;

    currentExam.questions.forEach((q) => {
      const checked = examQuestionsForm.querySelector(`input[name="question_${q.id}"]:checked`);
      const chosenAnswerId = checked ? checked.value : null;
      const correctAnswer = q.answers.find((a) => a.isCorrect);

      if (correctAnswer && chosenAnswerId === correctAnswer.id) {
        correctCount += 1;
      }
    });

    const percentage = totalQuestions > 0
      ? Number(((correctCount / totalQuestions) * 100).toFixed(2))
      : 0;
    const approved = percentage >= Number(currentExam.passPercentage);

    resultStudent.textContent =
      `Estudiante: ${currentStudent.fullName} (${currentStudent.identification}) — Examen: ${currentExam.title}`;
    resultScore.textContent =
      `Porcentaje de respuestas acertadas: ${percentage}% (${correctCount} de ${totalQuestions}) — Mínimo requerido: ${currentExam.passPercentage}%`;
    resultStatus.textContent = approved
      ? 'Resultado: APROBADO'
      : 'Resultado: NO APROBADO';

    showSection(resultSection);
  }

  examQuestionsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    finalizeExam();
  });

  newAttemptBtn.addEventListener('click', () => {
    currentExam = null;
    currentStudent = null;
    renderCatalog();
    showSection(catalogSection);
  });

  renderCatalog();
});