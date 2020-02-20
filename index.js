const axios = require("axios");
const fs = require("fs");

axios.defaults.headers.common["Authorization"] =
  "Bearer 9bb7b70e88eb66e2030a9fa0b2d508b8a8c571e9";

const getResultado = async () => {
  try {
    const query = `query RepositoriosPopulares {
            search(query: "stars:>100", type: REPOSITORY, first: 100) {
              nodes {
                ... on Repository {
                  nameWithOwner
                  createdAt
                  pullRequests {
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
    fs.writeFile("resultadoConsulta.json", JSON.stringify(resultado), err =>
      console.log(err)
    );
    console.log("Arquivo criado");
  } catch (e) {
    console.log(e);
  }
};

getResultado();
