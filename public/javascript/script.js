let checkbox = document.getElementById("box");
let text = document.getElementsByClassName("list-text");

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    text.innerHTML = "<s>" + text.innerHTML + "</s>";
    console.log(text.innerHTML);
  }
});
