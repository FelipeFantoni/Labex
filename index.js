const axios = require("axios");
const fs = require("fs");
const Json2Csv = require("json2csv").parse;
var after = "";
var resposta = [];
var pagina = 0;
var atual = 0;
const limite = 20;
var csv;

axios.defaults.headers.common["Authorization"] =
  "Bearer 740fe9617dbd29e70f4037d48f61ea7d5eb97d37";

const getResultado = async () => {
  try {
    const query = `query RepositoriosPopulares {
            search(query: "stars:>100", type: REPOSITORY, first:20${after}) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                ... on Repository {
                  nameWithOwner
                  createdAt
                  pullRequests (states: MERGED){
                    totalCount
                  }
                  releases {
                    totalCount
                  }
                  updatedAt
                  primaryLanguage {
                    name
                  }
                  closedIssues: issues(states: CLOSED) {
                    totalCount
                  }
                  totalIssues: issues {
                    totalCount
                  }
                  stargazers {
                    totalCount
                  }
                }
              }
            }
          }`;
    const consulta = await axios.post("https://api.github.com/graphql", {
      query: query
    });
    const resultado = consulta.data.data.search;
    if (resultado.pageInfo.hasNextPage && atual <= limite) {
      after = `, after: "${resultado.pageInfo.endCursor}"`;
      resposta = resposta.concat(resultado.nodes);
      pagina += 20;
      atual += 20;
      console.log("Página número: " + pagina);
      await getResultado();
    } else {
      //fs.writeFile("resultadoConsulta.json", JSON.stringify(resposta), err => console.log(err));
      csv = Json2Csv(resposta, {fields: ["nameWithOwner", "createdAt", "pullRequests", "releases", "updatedAt", "primaryLanguage", "closedIssues", "totalIssues", "stargazers"]});
      fs.writeFileSync("resultadoFinal.csv", csv);
      console.log("Arquivo criado");
    }
  } catch (e) {
    console.log(e);
    await getResultado();
  }
};

getResultado();
