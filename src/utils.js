export const assertError = e => {
	expect(e instanceof Error).toBe(true);
	const { message, stack, ...custom } = e;
	expect(stack).toBeDefined();
	expect({ message, ...custom }).toMatchSnapshot();
};

export default {
	assertError,
};
