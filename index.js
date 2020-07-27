//1 Fake login
const el = document.getElementById("el");
const inputName = document.getElementById("name");
inputName.setAttribute("style", "margin: 10px 3px; width: 90%;");
const inputPassword = document.getElementById("password");
inputPassword.setAttribute("style", "margin: 5px 3px; width: 90%");
const submit = document.getElementById("btn");
submit.setAttribute("style", "margin: 10px 38px; width: 50%");
const form = document.getElementById("form");
form.setAttribute("style", "padding: 5px; border: 1px solid black; display:flex;  flex-direction: column;  border-radius: 10px; margin: 0 auto; width: 150px;");

const users = [
  {
    "name": "John",
    "password": "1"
  },
  {
    "name": "Ivan",
    "password": "2"
  },
  {
    "name": "Petr",
    "password": "3"
  },
]

function wait (ms) {
  return new Promise(resolve => {
      setTimeout(() => resolve("ok"), ms)
  })
}

function validat (nam, pass) {
  return new Promise((resolve, reject) => {
    for (let i of users) {
      const {name, password} = i;
      if (nam == name && pass == password) {
        resolve("ok") 
      }
    }
    reject("error")
  })
}

async function getData () {
  submit.disabled = true
  await wait(2000)
  try {
    await validat(inputName.value, inputPassword.value)
    form.style.display = "none";
    const div = document.createElement("div");
    div.setAttribute("style", "border: 2px solid gray; border-radius: 5px; margin: 0 auto; width: 300px; height: 50px; line-height: 50px; text-align:center");
    div.innerText = "You have successfully logged in";
    el.appendChild(div);
    await wait(2000);
    div.remove();
  }
  catch {
    const div = document.createElement("div");
    div.setAttribute("style", "border: 2px solid gray; border-radius: 5px; margin: 10px auto; width: 300px; height: 50px; line-height: 50px; background: red; text-align:center");
    div.innerText = "You entered incorrect data";
    el.appendChild(div);
    inputName.value = "";
    inputPassword.value = "";
    await wait(2000);
    div.remove();
  }
  submit.disabled = false
}

function attachEvent (event, handler, node) {
  node.addEventListener(event, handler);
  return () => {
    node.removeEventListener(event, handler);
  };
};

attachEvent("click", getData, submit)

//2 asyncButton
const elem = document.getElementById("elem");
elem.setAttribute("style", "text-align: center;");

function randomNumbersPromise() {
  return new Promise((resolve, reject) => {
    const randomNumber = Math.random();
    console.log("random", randomNumber);
    if (randomNumber >= 0.5) {
      setTimeout(() => resolve("ok"), 2000);
    }
    else {
      setTimeout(() => reject("not ok"), 2000);
    }
  })
}

function progressBar(time, container) {
  let curTime = 0
  const progress = document.createElement("progress");
  progress.setAttribute("style", "width: 75%;");
  container.appendChild(progress);
  progress.max = time;
  let intervalID =  setInterval(() => {
    progress.value = curTime;
    curTime += 10;
    if(curTime === time) {
      clearInterval(intervalID);
      progress.remove()
    }
  }, 10)
}

function createAsyncButton(container, handler, options) {
  const button = document.createElement("button");
  button.setAttribute("style", "margin: 10px; width: 200px; height: 50px;");
  container.appendChild(button);
  for (let i in options) {
    button[i] = options[i]
  }
  async function clickButton() {
    button.disabled = true;
    try {
      progressBar(2000, button);
      await handler();
      button.style.backgroundColor = "#2EFEF7";
    }
    catch {
      button.style.backgroundColor = "#F7819F";
    }
    button.disabled = false;
  }
  attachEvent("click", clickButton, button)
}

createAsyncButton(elem, randomNumbersPromise, {
  innerText: "Click me",
  id: "test-button"
})

//3 Функция неглубокого копирования объектов и массивов.
function shallowCopy(obj) {
  let newObj = Array.isArray(obj) ? [] : {};
  if (obj instanceof Date) {
    newObj = new Date(obj)
  }
  else  {
    for (let i in obj) {
      newObj[i] = obj[i];
    }
  }
  return newObj
}

var a = { x: 1, y: 2, z: [1, 2, 3] };
var b = shallowCopy(a); // b — это отдельный объект
b.x = 10;
console.log(a.x); // 1
// Но a.z и b.z указывают на один и тот же массив:
b.z.push(4);
console.log(a.z); // [1, 2, 3, 4]

var c = new Date(2020, 1, 1);
var d = shallowCopy(c);
d.setFullYear(2021);
console.log(c.getFullYear()); // 2020