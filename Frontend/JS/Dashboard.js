// * Variables and Constants
let marker = document.querySelector("#Marker");
let list = document.querySelectorAll(".Chart-Sidebar > li");

// * Onload
window.customFunctions.Python.generatePassword();
window.customFunctions.Python.getSizeofSystemFiles();
createChart("CPU");

// * Functions
function addChangingFunctionalityForLoadManager(e) {
  marker.style.left = e.offsetLeft + "px";
  marker.style.width = e.offsetWidth + "px";

  var classNameOfTag = e.classList[0];

  createChart(classNameOfTag);
}

function activeLink() {
  list.forEach((item) => item.classList.remove("active"));
  this.classList.add("active");
}

function Notify(Text) {
  Toastify({
    text: Text,
    duration: 2000,
    close: true,
  }).showToast();
}

function fetchFromFile(FilePath) {
  return fetch(FilePath)
    .then((response) => response.text())
    .then((text) => {
      Load = text.split(",");
      return Load;
    });
}

function createChart(TypeOfChart) {
  const canvasChart = document.getElementById("myChart");

  const newElement = document.createElement("canvas");
  newElement.id = "myChart";

  canvasChart.parentNode.replaceChild(newElement, canvasChart);

  var Color;

  if (TypeOfChart == "CPU") {
    Color = "#5da6ff";
  } else if (TypeOfChart == "RAM") {
    Color = "#00ff55";
  } else if (TypeOfChart == "Hard-Drive") {
    Color = "#db2777";
  } else if (TypeOfChart == "Network") {
    Color = "#ef4444";
  } else if (TypeOfChart == "Battery") {
    Color = "#ff0";
  }
  const Canvas = document.getElementById("myChart").getContext("2d");

  let gradient = Canvas.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, Color);
  gradient.addColorStop(1, "rgba(0, 210, 255, 0.3)");

  const labels = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ];

  var data = {
    labels,
    datasets: [
      {
        data: "Loads",
      },
    ],
  };

  var config = {};

  if (TypeOfChart !== "Network") {
    config = {
      type: "line",
      labels,
      data: data,

      options: {
        radius: 3,
        responsive: true,
        interaction: {
          intersect: false,
        },
        hitRadius: 30,
        hoverRadius: 10,
        scales: {
          y: {
            ticks: {
              callback: function (value) {
                return value + "%";
              },
              color: Color,
              stepSize: 10,
            },
            title: {
              display: true,
              text: `${TypeOfChart} Load`,
              color: Color,
            },
            min: 0,
            max: 100,
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: Color,
            },
          },
        },
      },
    };
  } else {
    config = {
      type: "line",
      data: data,

      options: {
        radius: 3,
        responsive: true,
        interaction: {
          intersect: false,
        },
        hitRadius: 30,
        hoverRadius: 10,
        scales: {
          y: {
            ticks: {
              callback: function (value) {
                return value + " Packets";
              },
              color: Color,
            },
            title: {
              display: true,
              text: `${TypeOfChart} Load`,
              color: Color,
            },
          },
        },
      },
    };
  }
  const myChart = new Chart(Canvas, config);

  setInterval(function () {
    if (TypeOfChart === "Network") {
      var NetworkOutAccess = fetchFromFile("../Data/Network_Out_Packet_Load.txt");
      var NetworkInAccess = fetchFromFile("../Data/Network_In_Packet_Load.txt");

      var NetworkOutPacketLoad = async () => {
        var Out_Packet = await NetworkOutAccess;

        var NetworkInPacketLoad = async () => {
          var In_Packet = await NetworkInAccess;

          myChart.data = {
            labels: labels,
            datasets: [
              {
                data: Out_Packet,
                label: "Network Outgoing Packets",
                fill: true,
                backgroundColor: Color,
                borderColor: Color,
                pointBackgroundColor: Color,
                tension: 0.4,
              },
              {
                data: In_Packet,
                label: "Network Incoming Packets",
                fill: true,
                backgroundColor: gradient,
                borderColor: Color,
                pointBackgroundColor: Color,
                tension: 0.4,
              },
            ],
          };

          myChart.update("none");
        };

        NetworkInPacketLoad();
      };

      NetworkOutPacketLoad();
    } else {
      var LoadOfSystemAccess = fetchFromFile(`../Data/${TypeOfChart}_Load.txt`);

      var LoadOfSystem = async () => {
        var Load = await LoadOfSystemAccess;

        myChart.data = {
          labels,
          datasets: [
            {
              data: Load,
              label: `${TypeOfChart} Load`,
              fontColor: Color,
              fill: true,
              backgroundColor: gradient,
              borderColor: Color,
              pointBackgroundColor: Color,
              tension: 0.4,
            },
          ],
        };
        myChart.update("none");
      };

      LoadOfSystem();
    }
  }, 2100);
}

function AnalysePassword() {
  var InputValueOfPassword = document.getElementById(
    "Password-Analyser-Input"
  ).value;
  window.customFunctions.Python.analysePassword(InputValueOfPassword);

  document.getElementById("Vertical-Box").className +=
    " Vertical-with-Analysed";
  document.getElementById("Analysed-Section").className +=
    " Analysed-Section-Expanded";
}

// * Event Listeners
document.getElementById("Copy").addEventListener("click", () => {
  window.customFunctions.sysFuncs.copyText("Generated-Password"),
    Notify("Password successfully copied");
});

document.getElementById("Generate").addEventListener("click", () => {
  window.customFunctions.Python.generatePassword(),
    Notify("New Password Generated");
});

document.getElementById("Analyse").addEventListener("click", () => {
  AnalysePassword(), Notify("Password Analysed");
});

list.forEach((link) => {
  link.addEventListener("click", (e) => {
    addChangingFunctionalityForLoadManager(e.target);
    list.onclick = null;
  });
  link.addEventListener("click", activeLink);
});
