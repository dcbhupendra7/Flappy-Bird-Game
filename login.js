document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const grade = parseInt(document.getElementById("grade").value);

  if (firstName && lastName && grade >= 0 && grade <= 12) {
    const student = {
      firstName,
      lastName,
      grade,
      timestamp: new Date().toISOString(),
      bestScore: 0, // Placeholder for future score tracking
    };

    // Load existing data from localStorage
    let students = JSON.parse(localStorage.getItem("flappyStudents") || "[]");
    students.push(student);

    // Save back to localStorage
    localStorage.setItem("flappyStudents", JSON.stringify(students));

    // Hide the form and show the game link with export option
    document.getElementById("login-form").style.display = "none";
    document.getElementById("game-link").style.display = "block";
  }
});

// Add event listener for the export button
document.getElementById("export-btn").addEventListener("click", () => {
  const students = JSON.parse(localStorage.getItem("flappyStudents") || "[]");
  if (students.length > 0) {
    downloadLoginData(students);
  } else {
    alert("No login data to export yet!");
  }
});

function downloadLoginData(students) {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(students, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "login.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
}
