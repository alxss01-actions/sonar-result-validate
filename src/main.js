const core = require("@actions/core");
const axios = require("axios");

async function run() {
  try {
    // Captura os inputs
    const projectKey = core.getInput("projectKey", { required: true });
    const token = core.getInput("token", { required: true });
    const sonarUrl = core.getInput("sonarUrl", { required: true });

    // Define o endpoint
    const url = `${sonarUrl}/api/qualitygates/project_status?projectKey=${projectKey}`;

    // Faz a requisição ao SonarQube
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Analisa a resposta
    const resultado = response.data.projectStatus.status;

    if (resultado === "OK") {
      console.log("Gate Passou com Sucesso ✅");
      console.log(JSON.stringify(response.data, null, 2));
    } else {
      console.error("Gate Falhou ❌");
      console.error(JSON.stringify(response.data, null, 2));
      core.setFailed("A qualidade do código falhou no Gate.");
    }
  } catch (error) {
    core.setFailed(`Erro ao validar o SonarQube: ${error.message}`);
  }
}

module.exports = {
  run,
};
