const report = document.getElementById("report-form");
document.getElementById("studentSearch").focus();

const search = document.getElementById("studentSearch");
const matrix = document.getElementById("matrix");
let selectedStudent = null;

search.addEventListener("input", async () => {
  const value = search.value.trim();
  matrix.value = "";

  const res = await fetch(
    `/emc-system/api/searchStudent.php?q=${encodeURIComponent(value)}`,
  );
  const students = await res.json();
  const result = document.querySelector(".studentResults");
  result.innerHTML = "";

  students.forEach((student) => {
    if (student < 2)return;

    const div = document.createElement("div");
    div.style.cursor = 'pointer';
    div.textContent = `${student.fullName} - ${student.matrix}`;
    div.addEventListener("click", () => {
      search.value = student.fullName;
      matrix.value = student.matrix;

      selectedStudent = student;

      result.innerHTML = "";
    });

    result.append(div);
  });
});

report.addEventListener("submit", async (e) => {
  e.preventDefault();

  const course_id = document.getElementById("course");
  const exam_date = document.getElementById("exam_date");
  const exam_time = document.getElementById("exam_time");
  const misconduct_type = document.getElementById("misconduct");
  const venue = document.getElementById("venue");
  const description = document.getElementById("describe");
  const evidence = document.getElementById("file");

  if (!selectedStudent) {
    alert("Select a Student.");
    return;
  }

  const caseData = {
    student_id: selectedStudent.id,
    course_id: course_id.value,
    exam_date: exam_date.value,
    exam_time: exam_time.value,
    misconduct_type: misconduct_type.value,
    venue: venue.value,
    description: description.value,
  };

  const res = await fetch("/emc-system/api/reportCase.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(caseData),
  });

  const data = await res.json();

  report.reset();
  document.getElementById("studentSearch").focus();
});
