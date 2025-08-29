const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;
    if (select.name === "from" && currCode === "USD") option.selected = true;
    if (select.name === "to" && currCode === "INR") option.selected = true;
    select.append(option);
  }

  select.addEventListener("change", (e) => updateFlag(e.target));
}

const updateFlag = (element) => {
  let countryCode = countryList[element.value];
  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

const updateExchange = async () => {
  let amtInput = document.querySelector(".amount input");
  let amtVal = amtInput.value;
  if (!amtVal || amtVal < 1) {
    amtVal = 1;
    amtInput.value = "1";
  }

  const url = `${BASE_URL}?base=${fromCurr.value}&symbols=${toCurr.value}`;
  console.log("Fetching:", url);

  try {
    let response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP status ${response.status}`);
    let data = await response.json();

    let rate = data.rates[toCurr.value];
    if (!rate) throw new Error("Rate not available");

    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (err) {
    console.error("Error fetching rate:", err);
    msg.innerText = "❌ Unable to fetch exchange rate.";
  }
};

btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchange();
});

window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchange();
});
