import neo4j from 'neo4j-driver';

// Initialize the Neo4j connection
const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || '1lovePriyanka')
);

export const getSession = () => driver.session();

export const closeConnection = async () => {
  await driver.close();
};

export async function runQuery(query: string, params: Record<string, any> = {}) {
  const session = getSession();
  try {
    const result = await session.run(query, params);
    return result.records;
  } finally {
    await session.close();
  }
}
