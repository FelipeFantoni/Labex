const axios = require("axios");
const fs = require("fs");
const Json2Csv = require("json2csv").parse;
var after = "";
var resposta = [];
var atual = 0;
var csv;
const limite = 1000;

axios.defaults.headers.common["Authorization"] =
  "Bearer 0fb210b936e4d84aee60a112dud28jjdndmeog7";

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
    if (resultado.pageInfo.hasNextPage || atual < limite) {
      after = `, after: "${resultado.pageInfo.endCursor}"`;
      resposta = resposta.concat(resultado.nodes);
      atual += 20;
      console.log("Dados retornados: " + atual);
      await getResultado();
    } else {
      criaArquivoCsv(resposta);
    }
  } catch (e) {
    e.response.status == 502 ? await getResultado() : console.log(e);
  }
};

function criaArquivoCsv(json) {
  csv = Json2Csv(json, {
    fields: [
      "nameWithOwner",
      "createdAt",
      "pullRequests",
      "releases",
      "updatedAt",
      "primaryLanguage",
      "closedIssues",
      "totalIssues",
      "stargazers"
    ]
  });
  fs.writeFileSync("resultadoFinal.csv", csv);
  console.log("Arquivo criado");
}

getResultado();
