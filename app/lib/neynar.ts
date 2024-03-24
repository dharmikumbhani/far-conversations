import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY as string);

export const fetchAllFollowing = async (fid: number) => {
    let cursor: string | null = "";
    let users: unknown[] = [];
    do {
      const result = await client.fetchUserFollowing(fid, {
        limit: 150,
        cursor,
      });
      users = users.concat(result.result.users);
      cursor = result.result.next.cursor;
      console.log(cursor);
    } while (cursor !== "" && cursor !== null);
    return users;
  };
const currentUserFollowings = await fetchAllFollowing(rishFID);

export const fetchAllFollowers = async (fid: number) => {
    let cursor: string | null = "";
    let users: unknown[] = [];
    do {
      const result = await client.fetchUserFollowers(fid, {
        limit: 150,
        cursor,
      });
      users = users.concat(result.result.users);
      cursor = result.result.next.cursor;
      console.log(cursor);
    } while (cursor !== "" && cursor !== null);
    return users;
  };
