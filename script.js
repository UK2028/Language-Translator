let input = document.getElementById("inputText");
let output = document.getElementById("outputText");
let translate = document.getElementById("translateText");
let selectElem = document.querySelectorAll("select");
let speak = document.querySelectorAll(".speak");
let copy = document.querySelectorAll(".copyText");
let exchange = document.querySelector(".exchange");

translate.addEventListener("click", translateText);

selectElem.forEach((ele, index) => {
  for (let country in countries) {
    // let selected = index == 0 ? country == "en-GB" ? "selected" : "" : country == "hi-IN" ? "selected" : "";
    // let option = `<option ${selected} value="${country}">${countries[country]}</option>`;
    // ele.insertAdjacentHTML('beforeend',option);
    let option = document.createElement("option");
    option.value = `${country}`;
    option.selected =
      index == 0
        ? country == "en-GB"
          ? true
          : false
        : country == "hi-IN"
        ? true
        : false;
    option.textContent = `${countries[country]}`;
    ele.appendChild(option);
  }
});

async function translateText() {
  if (input.value==="") {
    output.innerText = "";
  } else {
    output.setAttribute("placeholder", "Translating...");
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${input.value}&langpair=${selectElem[0].value}|${selectElem[1].value}`
    );
    const data = await res.json();
    output.innerText = data.responseData.translatedText;
    for (let text of data.matches) {
      if (text.id === 0) {
        output.innerText = text.translation;
      }
    }
    output.setAttribute("placeholder", "Translate");
  }
}

speak.forEach((ele, index) => {
  ele.addEventListener("click", () => {
    let content = index == 0 ? input.value : output.value;
    let sound = new SpeechSynthesisUtterance(content);
    sound.lang = selectElem[index].value;
    speechSynthesis.speak(sound);
  });
});

copy.forEach((ele, index) => {
  ele.addEventListener("click", async () => {
    let copyContent = index == 0 ? input.value : output.value;
    navigator.clipboard.writeText(copyContent).then(()=>{
        let temp = ele.innerHTML;
        ele.innerHTML = "Copied to Clipboard";
        setTimeout(()=>ele.innerHTML=temp,1000);
    });
    // let res = await navigator.clipboard.readText();
    // console.log("Res:",res);
  });
});

exchange.addEventListener("click", () => {
  let temp = input.value;
  input.value = output.value;
  output.value = temp;
  let tempSelect = selectElem[0].value;
  selectElem[0].value = selectElem[1].value;
  selectElem[1].value = tempSelect;
});
