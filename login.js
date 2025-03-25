// Get a reference to Firestore
const db = firebase.firestore();

// Handle form submission
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const grade = document.getElementById("grade").value; // Keep as string to match Firestore schema

  // Validate grade as a number, but store as string
  const gradeNum = parseInt(grade);
  if (firstName && lastName && gradeNum >= 6 && gradeNum <= 12) {
    const student = {
      firstName,
      lastName,
      grade, // Stored as string (e.g., "5") to match Firestore schema
      timestamp: new Date().toISOString(),
      bestScore: 0, // Placeholder for future score tracking
    };

    // Save the student data to Firestore
    db.collection("students")
      .add(student)
      .then((docRef) => {
        console.log("Student info saved with ID:", docRef.id);
        // Update the game link with student info in URL parameters
        const queryString = new URLSearchParams({
          firstName: student.firstName,
          lastName: student.lastName,
          grade: student.grade,
        }).toString();
        const gameLink = document.querySelector(".game-button");
        gameLink.href = `game.html?${queryString}`;
        // Hide the form and show the game link (maintains current UI behavior)
        document.getElementById("login-form").style.display = "none";
        document.getElementById("game-link").style.display = "block";
      })
      .catch((error) => {
        console.error("Error saving student info:", error);
        alert("Failed to save student information. Please try again.");
      });
  } else {
    alert(
      "Please fill in all fields correctly. Grade must be between 6 and 12."
    );
  }
});
