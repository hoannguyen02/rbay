import { itemsKey, userLikesKey } from '$services/keys';
import { client } from '$services/redis';
import { getItems } from './items';

export const userLikesItem = async (itemId: string, userId: string) => {
	return client.sIsMember(userLikesKey(userId), itemId);
};

export const likedItems = async (userId: string) => {
	// Fetch all items Id's from this user's liked set
	const ids = await client.sMembers(userLikesKey(userId));

	// Fetch all the items hash
	return getItems(ids);
};

export const likeItem = async (itemId: string, userId: string) => {
	const liked = await client.sAdd(userLikesKey(userId), itemId);
	if (liked) {
		return client.hIncrBy(itemsKey(itemId), 'likes', 1);
	}
};

export const unlikeItem = async (itemId: string, userId: string) => {
	const unlike = await client.sRem(userLikesKey(userId), itemId);
	if (unlike) {
		return client.hIncrBy(itemsKey(itemId), 'likes', -1);
	}
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {};
