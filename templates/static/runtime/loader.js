(function () {
  Confirmit.pageView.registerCustomQuestion(
    "__MY_COMPONENT_ID__",
    function (question, customQuestionSettings, questionViewSettings) {
      // TODO: put your code here
      document.getElementById(question.id).innerText = 'hello world';
    }
  );
})();
