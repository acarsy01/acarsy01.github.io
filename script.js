let currentPath = "root";
let historyIndex = -1;
const files = {
  "root": {
    "about.txt": `
      Hi, my name is Acar! I am student who dreaming of becoming a developer.
    `,
    "skills": {
      "javascript.txt": `
        I have started to learn javascript with Discord bots since 2018. I have made many sites and Discord bots so far using Javascript.
      `,
      "typescript.txt": `
        I have started to learn typescript for a month. The reqson is that i don't like JSDOC for integrate autocomplete in Visual Studio Code.
        Typescript do this a simple way.
      `,
      "html.txt": `
        Maybe i learned this a month before javascript.
      `,
      "css.txt": `
        I'm not good at this. I know this enough for me. I learned this with HTML.
      `
    }
  }
}

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
      const path = currentPath.split("/").slice(1).reduce((a, b) => a[b], files[currentPath.split("/")[0]]);

      if (path.hasOwnProperty(directory)) {
        currentPath += `/${directory}`;
      } else if (directory) {
        onError(`${directory} isn't valid directory.`);
      } else {
        onError("arguments isn't valid.");
      }
    }
  },
  "cat": {
    "usage": "cat FILENAME",
    "description": "display content of FILENAME",
    "code": function (fileName) {
      const path = currentPath.split("/").slice(1).reduce((a, b) => a[b], files[currentPath.split("/")[0]]);

      if (!path.hasOwnProperty(fileName)) {
        onError(`${fileName} isn't valid file.`);
      } else {
        text(path[fileName]);
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

document.body.onload = function () {
  newCommand();
}

document.body.onclick = function (e) {
  if (e.path[0].innerHTML === document.getElementsByClassName("panel")[0].innerHTML) {
    document.getElementsByClassName("cliText")[0].focus();
  }
}

document.body.onkeydown = function (e) {
  if (e.path[0].innerHTML === document.getElementsByClassName("cliText")[0].innerHTML) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();

      const command = document.getElementsByClassName("cliText")[0].innerHTML.split(" ")[0];
      const arguments = document.getElementsByClassName("cliText")[0].innerHTML.split(" ").slice(1);

      if (!Object.keys(commands).includes(command)) {
        onError(`${command} command couldn't found.`);
      } else {
        commands[command].code(...arguments);

        const history = (localStorage.getItem("history") ? localStorage.getItem("history").split(",") : []);
        history.push(command);
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