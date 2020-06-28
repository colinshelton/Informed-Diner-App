// Variables
const emailInput = $("#emailInput");
const passwordInput = $("#passwordInput");
const submit = $("#submit");
const google = $("#google");

// Function to retrieve the user inputted values within email and password text fields
function userCreation() {
  let emailInput = $("#emailInput").val();
  let passwordInput = $("#passwordInput").val();
  // Set both items to local storage with their respective keys. Proof of concept before use of back end server
  localStorage.setItem("Email", emailInput);
  localStorage.setItem("Password", passwordInput);
}

// Add click event listener to submit button, run userCreation upon click
$("#submit").click(userCreation);
