const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios");

async function run() {
  try {
    const projectKey = core.getInput("projectKey");
    const token = core.getInput("token");
    const sonarUrl = core.getInput("sonarUrl");

    const url = `${sonarUrl}/api/qualitygates/project_status?projectKey=${projectKey}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resultado = response.data.projectStatus.status;

    if (resultado === "OK") {
      console.log("Gate Passou com Sucesso ✅");
      console.log(JSON.stringify(response.data, null, 2));
    } else {
      console.log("Gate Falhou ❌");
      console.log(JSON.stringify(response.data, null, 2));
      core.setFailed("Qualidade do código não passou no Gate do Sonar");
    }
  } catch (error) {
    core.setFailed(`Erro ao validar SonarQube: ${error.message}`);
  }
}

run();
