const fetch = require('node-fetch');

const API_URL = process.env.DATOCMS_API_URL;
const API_TOKEN = process.env.DATOCMS_API_TOKEN;
const RECORD_LIMIT = 100;

async function fetchAPI(query, { variables = null, preview = false } = {}) {
  const res = await fetch(API_URL + (preview ? '/preview' : ''), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error(
      'There was an error fetching content from DatoCMS: ',
      json.errors,
    );
    return {};
  }
  return json.data;
}

async function paginateQuery(
  queryModel,
  queryParams = { preview: false, first: RECORD_LIMIT, skip: 0 },
  accumulatedData = [],
) {
  if (!QUERIES[queryModel]) {
    throw new Error(
      `DATACMS CONNECTOR: Query for ${queryModel} not configured`,
    );
  }

  const RECORD_COUNT = queryParams.first;

  const response = await QUERIES[queryModel](queryParams);

  if (!response || !response[queryModel]) {
    return [];
  }

  accumulatedData = accumulatedData.concat(response[queryModel]);
  
  let loadQueue = [];

  for (
    let i = 1;
    i < Math.ceil(response[`_${queryModel}Meta`].count / RECORD_COUNT);
    i++
  ) {
    loadQueue.push(
      QUERIES[queryModel]({
        preview: queryParams.preview,
        first: RECORD_COUNT,
        skip: queryParams.skip + RECORD_COUNT * i,
      }),
    );
  }

  let paginationResponse = await Promise.all(loadQueue);

  paginationResponse.forEach((item) => {
    if (item && item[queryModel]) {
      accumulatedData = accumulatedData.concat(item[queryModel]);
    }
  });
  return accumulatedData;
}

// QUERIES

async function allLandingPages(query) {
  const { preview = false, first = RECORD_LIMIT, skip = 0 } = query || {};

  return fetchAPI(
    `
      query {
        allLandingPages(first: ${first}, skip: ${skip}, orderBy: [createdAt_ASC] ) {
          id
          name
          slug
          updatedAt
          createdAt
          _status
        },
        _allLandingPagesMeta {
          count
        }
      }
    `,
    {
      preview,
    },
  );
}


const QUERIES = {
  allLandingPages
};

module.exports = {
  getAllLandingPages: async (queryParams) => {
    return paginateQuery('allLandingPages', queryParams);
  }
};
