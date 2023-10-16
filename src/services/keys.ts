export const usersKey = (userId: string) => `users#${userId}`;
export const sessionKey = (sessionId: string) => `session#${sessionId}`;
export const itemsKey = (itemId: string) => `items#${itemId}`;
export const usernamesUniqueKey = () => 'usernames#unique';
export const usernamesKey = () => 'usernames';
export const userLikesKey = (userId: string) => `user:likes#${userId}`;
