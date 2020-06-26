const emailInput = $("#emailInput");
const passwordInput = $("#passwordInput");
const submit = $("#submit");
const google = $("#google");

function userCreation() {
  let emailInput = $("#emailInput").val();
  let passwordInput = $("#passwordInput").val();
  localStorage.setItem("Email", emailInput);
  localStorage.setItem("Password", passwordInput);
  console.log("test");
}

$("#submit").click(userCreation);
