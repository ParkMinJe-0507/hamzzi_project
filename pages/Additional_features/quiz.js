document.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('.step');
  const nextButtons = document.querySelectorAll('.next-btn');
  const form = document.getElementById('quiz-form');
  const quizSection = document.getElementById('quiz-section');
  const resultSection = document.getElementById('result-container');
  const resultContent = document.getElementById('result-content');
  const restartBtn = document.getElementById('restart-btn');

  let currentStep = 0;

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });
  }

  nextButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const inputs = steps[index].querySelectorAll('input[type="radio"]');
      const isChecked = Array.from(inputs).some(input => input.checked);
      if (!isChecked) {
        alert('답변을 선택해주세요.');
        return;
      }
      currentStep++;
      showStep(currentStep);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const answers = [
      document.querySelector('input[name="q1"]:checked')?.value,
      document.querySelector('input[name="q2"]:checked')?.value,
      document.querySelector('input[name="q3"]:checked')?.value
    ];

    if (answers.includes(undefined)) {
      alert('모든 문항에 응답해주세요!');
      return;
    }

    const score = answers.filter(v => v === 'active').length;
    const result = score >= 2 ? 'active' : 'quiet';

    const results = {
      active: {
        title: "활발한 햄찌와 잘 맞아요!",
        desc: "당신은 호기심 많고 에너지 넘치는 햄스터와 찰떡궁합이에요. <br>로보로브스키나 펄 햄스터가 어울릴 수 있어요.",
        emoji: "🎯",
        image: "img/robo.jpg"
      },
      quiet: {
        title: "조용한 햄찌와 잘 맞아요!",
        desc: "당신은 차분하고 조용한 햄스터에게 잘 맞아요. <br>윈터화이트나 캄벨 햄스터를 추천드려요.",
        emoji: "🌙",
        image: "img/winter.jpg"
      }
    };

    const res = results[result];
    resultContent.innerHTML = `
      <img src="${res.image}" alt="추천 햄스터" class="result-img" />
      <h3>${res.emoji} ${res.title}</h3>
      <p>${res.desc}</p>
    `;

    quizSection.style.display = 'none';
    resultSection.style.display = 'block';
  });

  restartBtn.addEventListener('click', () => {
    // reset all form inputs
    form.reset();
    currentStep = 0;
    showStep(currentStep);
    quizSection.style.display = 'block';
    resultSection.style.display = 'none';
  });

  showStep(currentStep);
});
