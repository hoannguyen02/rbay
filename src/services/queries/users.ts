import { usernamesKey, usernamesUniqueKey, usersKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';

export const getUserByUsername = async (username: string) => {
	// Get user id based on usernames sorted set
	const decimalId = await client.zScore(usernamesKey(), username);
	if (!decimalId) {
		throw new Error('User does not exist');
	}
	// Take user id and convert it back to hex (instead of integer in sorted set)
	const id = decimalId.toString(16);
	// Get user based on userId
	const user = await client.hGetAll(usersKey(id));
	// Return user
	return deserialize(id, user);
};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));
	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId();

	const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username);
	if (exists) {
		throw new Error('Username is taken');
	}
	await client.hSet(usersKey(id), serialize(attrs));
	await client.sAdd(usernamesUniqueKey(), attrs.username);
	await client.zAdd(usernamesKey(), {
		value: attrs.username,
		score: parseInt(id, 16)
	});

	return id;
};

const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

const deserialize = (id: string, user: { [key: string]: string }) => {
	return {
		id,
		username: user.username,
		password: user.password
	};
};
