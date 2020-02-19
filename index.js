const axios = require("axios");
const fs = require("fs");

axios.defaults.headers.common["Authorization"] =
  "Bearer 4a812102a155a55014d92388d2e7cea254478569";

const getResultado = async () => {
  try {
    const query = `query RepositoriosPopulares {
            search(query: "stars:>100", type: REPOSITORY, first: 100) {
              nodes {
                ... on Repository {
                  nameWithOwner
                  primaryLanguage {
                    id: id
                    name: name
                  }
                }
              }
            }
          }`;
    const consulta = await axios.post("https://api.github.com/graphql", {
      query: query
    });
    const resultado = consulta.data.data.search;
    fs.writeFile("resultadoConsulta.json", JSON.stringify(resultado), err =>
      console.log(err)
    );
    console.log("Arquivo criado");
  } catch (e) {
    console.log(e);
  }
};

getResultado();
