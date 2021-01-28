var inputElement = document.getElementById("input1");

function setInputValue(settings) {
  inputElement.value = settings.mySetting1;
}

function saveChanges() {
  var settings = { mySetting1: inputElement.value };
  var hasError = inputElement.value === "";
  customQuestion.saveChanges(settings, hasError);
}

customQuestion.onSettingsReceived = setInputValue;
inputElement.addEventListener("input", saveChanges);
