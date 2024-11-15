import { runQuery } from "@repo/neo4j_database/client";
import { getUserId } from "../userId/userID";

export const create_userNode_graph = async (userId: string) => {
    try {
        const query = `
            CREATE (u:User {userId: $userId})
        `;
        const params = { userId}; // map parameters to the query
        const record = await runQuery(query, params); // Run the query
        return record; // Return the result
    } catch (error) {
        console.log('Error running query', error);
    }
};


export const follower_relationship_status = async (followerUserId: string) => {
  console.log('followerUserId:', followerUserId);
  
  const followeringUserId = await getUserId();
  console.log('followeringUserId:', followeringUserId);
  
  if (!followeringUserId) {
    console.error('Error: followeringUserId is undefined.');
    return null;
  }
  
  if (!followerUserId) {
    console.error('Error: followerUserId is undefined.');
    return null;
  }
  
  try {
    const query = `
      MATCH (followering:User {userId: $followeringUserId})
      MATCH (follower:User {userId: $followerUserId})
      CREATE (followering)-[relation:FOLLOWS {status: "pending"}]->(follower)
      RETURN relation
    `;
    
    const params = { followeringUserId, followerUserId };
    const records = await runQuery(query, params);
    
    console.log('records:', records);
    return records;
    
  } catch (error) {
    console.error('Error running query:', error);
  }
};
