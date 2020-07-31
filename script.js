let beforePath = "";
let currentPath = "root";
let historyIndex = -1;
const files = {
  "root": {
    "me.txt": `
      Hi, my name is Acar! I am student who dreaming of becoming a developer. You can find me on <a href="https://github.com/acarsy01">Github</a>, <a href="https://twitter.com/acarsy01">Twitter</a> and Discord. (acarsy01#0585)
    `,
    "skills": {
      "javascript.txt": `
        I have started to learn javascript with Discord bots since 2018. I have made many sites and Discord bots so far using Javascript.
      `,
      "typescript.txt": `
        I have started to learn typescript for a month. The reason is that i don't like JSDOC for integrate autocomplete in Visual Studio Code.
        Typescript do it a simple way.
      `,
      "html.txt": `
        Maybe i learned this a month before learned javascript.
      `,
      "css.txt": `
        I'm not good at this. I know this enough for me. I learned this with HTML.
      `
    },
    "projects": {
      "shivers.txt": `
        Soon ;)
      `
    }
  }
};






function onError(errorText) {
  document.getElementsByClassName("panel")[0].innerHTML = (`
    ${document.getElementsByClassName("panel")[0].innerHTML}
    <br />
    <div class=\"resultText\"><div style=\"color: red; display: inline-block;\">Error:</div> ${errorText}</div>`);
}

function text(text) {
  document.getElementsByClassName("panel")[0].innerHTML = (`
    ${document.getElementsByClassName("panel")[0].innerHTML}
    <br />
    <div class=\"resultText\">${text}</div>`);
}

function newCommand() {
  if (typeof document.getElementsByClassName("cliText")[0] !== "undefined") {
    document.getElementsByClassName("cliText")[0].setAttribute("contenteditable", "false");
    document.getElementsByClassName("cliText")[0].setAttribute("class", "_cliText");
    document.getElementsByClassName("pathText")[0].setAttribute("class", "_pathText");
    document.getElementsByClassName("panel")[0].innerHTML = (`
      ${document.getElementsByClassName("panel")[0].innerHTML}
      <br />
      <div class="pathText">${currentPath} $</div>
      <div class="cliText" contenteditable="true"></div>
    `);
  } else {
    document.getElementsByClassName("panel")[0].innerHTML = (`
    <div class="pathText">${currentPath} $</div>
    <div class="cliText" contenteditable="true"></div>
  `);
  }

  document.getElementsByClassName("cliText")[0].focus();
}

function getPath(path) {
  let result = currentPath.split("/").reduce(function (a, b) {
    beforePath = a;
    return a[b];
  }, files);

  for (let pathKey of path.split("/").filter((el) => (typeof el !== "undefined") && (el !== ""))) {
    console.log(pathKey)
    if (typeof result !== "undefined") {
      if (pathKey !== ".") {
        if (pathKey !== "..") {
          beforePath = result;
          result = result[pathKey];
        } else {
          result = beforePath;
        }
      }
    } else {
      break;
    }
  }

  console.log(result)

  return result;
}




const commands = {
  "help": {
    "description": "display commands",
    "code": function () {
      text(`<ul>${Object.keys(commands).map((key) => `<li><b>${commands[key].usage || key}</b> - ${commands[key].description}</li>`).join("")}</ul>`);
    }
  },
  "clear": {
    "description": "clear the terminal",
    "code": function () {
      document.getElementsByClassName("panel")[0].innerHTML = "";
    }
  },
  "history": {
    "description": "display command history",
    "code": function () {
      text(`<ul>${localStorage.getItem("history").split(",").map((command) => `<li>${command}</li>`).join("")}</ul>`);
    }
  },
  "cd": {
    "usage": "cd DIRECTORY",
    "description": "move into DIRECTORY",
    "code": function (directory) {
      const path = getPath(directory);

      if (JSON.stringify(path) === JSON.stringify(files)) {
        beforePath = "";
        currentPath = "root";
      } else if (typeof path === "object") {
        currentPath = directory.split("/").filter((el) => el !== ".").reduce(function (a, b) {
          if (b == "..") {
            return a.split("/").slice(0, -1).join("/");
          } else {
            return a + "/" + b;
          }
        }, "root");
        currentPath = ((currentPath == "/") ? "root" : currentPath);
      } else if (typeof directory === "string") {
        onError(`${directory} isn't valid directory.`);
      } else {
        onError("arguments isn't valid.");
      }
    }
  },
  "cat": {
    "usage": "cat FILENAME",
    "description": "display content of FILENAME",
    "code": function (directory) {
      const file = getPath(directory);

      if (typeof file === "string") {
        text(file);
      } else if (typeof directory === "string") {
        onError(`${directory} isn't valid file.`);
      } else {
        onError("arguments isn't valid.");
      }
    }
  },
  "ls": {
    "usage": "ls",
    "description": "display files in current directory",
    "code": function () {
      const path = currentPath.split("/").slice(1).reduce((a, b) => a[b], files[currentPath.split("/")[0]]);

      text(Object.keys(path).map((el) => el.includes(".") ? `<div style="color: green; display: inline">${el}</div>` : `<div style="display: inline">${el}</div>`).join(" &nbsp;&nbsp; "));
    }
  }
};




function finishDrag() {
  document.onmouseup = null;
  document.onmousemove = null;
}

function startDrag() {
  document.onmouseup = finishDrag;

  document.onmousemove = function (e) {
    if (document.getElementsByClassName("terminal")[0].style.width !== "98%") {
      const oldTransition = document.getElementsByClassName("terminal")[0].style.transition;
      document.getElementsByClassName("terminal")[0].style.transition = null;
      document.getElementsByClassName("terminal")[0].style.top = (document.getElementsByClassName("terminal")[0].offsetTop + e.movementY) + "px";
      document.getElementsByClassName("terminal")[0].style.left = (document.getElementsByClassName("terminal")[0].offsetLeft + e.movementX) + "px";
      document.getElementsByClassName("terminal")[0].style.transition = oldTransition;
    }
  }
}




document.body.onload = function () {
  newCommand();
}

document.body.onclick = function (e) {
  if (e.path[0].innerHTML === document.getElementsByClassName("panel")[0].innerHTML) {
    document.getElementsByClassName("cliText")[0].focus();
  }
}

document.getElementsByClassName("normalButton")[0].onclick = function () {
  document.getElementsByClassName("terminal")[0].style.top = "25%";
  document.getElementsByClassName("terminal")[0].style.left = "30%";
}

document.getElementsByClassName("maximizeButton")[0].onclick = function () {
  if (document.getElementsByClassName("terminal")[0].style.width !== "98%") {
    document.getElementsByClassName("terminal")[0].style.width = "98%";
    document.getElementsByClassName("terminal")[0].style.height = window.innerHeight - (document.getElementsByClassName("titleBar")[0].clientHeight * 1.5);
    document.getElementsByClassName("terminal")[0].style.top = "0.5%";
    document.getElementsByClassName("terminal")[0].style.left = "1%";
  } else {
    document.getElementsByClassName("terminal")[0].style.width = "40%";
    document.getElementsByClassName("terminal")[0].style.height = "40%";
    document.getElementsByClassName("terminal")[0].style.top = "30%";
    document.getElementsByClassName("terminal")[0].style.left = "25%";
    document.getElementsByClassName("normalButton")[0].click();

  }
}

document.getElementsByClassName("titleBar")[0].addEventListener("mousedown", function (e) {
  startDrag();
});

document.body.onkeydown = function (e) {
  if (e.path[0].innerHTML === document.getElementsByClassName("cliText")[0].innerHTML) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();

      const command = document.getElementsByClassName("cliText")[0].innerHTML.split(" ")[0];
      const arguments = document.getElementsByClassName("cliText")[0].innerHTML.split(" ").slice(1);

      if (!Object.keys(commands).includes(command)) {
        if (command !== "") {
          onError(`${command} command couldn't found.`);
        }
      } else {
        commands[command].code(...arguments);

        const history = (localStorage.getItem("history") ? localStorage.getItem("history").split(",") : []);
        history.push(command + " " + arguments.join(" "));
        localStorage.setItem("history", history.join(","));
      }

      historyIndex = -1;
      newCommand();
    } else if (e.keyCode === 38) {
      e.preventDefault();
      e.stopPropagation();

      const history = (localStorage.getItem("history") ? localStorage.getItem("history").split(",") : []);

      if (historyIndex !== (history.length - 1)) {
        historyIndex++;
        document.getElementsByClassName("cliText")[0].innerHTML = history.reverse()[historyIndex];
      }
    } else if (e.keyCode === 40) {
      e.preventDefault();
      e.stopPropagation();

      const history = (localStorage.getItem("history") ? localStorage.getItem("history").split(",") : []);

      if ((historyIndex !== 0) && (historyIndex !== -1)) {
        historyIndex--;
        document.getElementsByClassName("cliText")[0].innerHTML = history.reverse()[historyIndex];
      }
    }
  }
}

window.onbeforeunload = function () {
  localStorage.removeItem("history");
}