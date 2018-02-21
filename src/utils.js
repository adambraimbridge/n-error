export const assertError = e => {
	expect(e instanceof Error).toBe(true);
	const { message, stack, ...custom } = e;
	expect(stack).toBeDefined();
	expect({ message, ...custom }).toMatchSnapshot();
};

export const removeObjectKeys = obj => keys => {
	let output = {};
	if (Array.isArray(keys)) {
		Object.keys(obj).forEach(key => {
			const toBeRemoved = keys.includes(key);
			if (!toBeRemoved) {
				output[key] = obj[key];
			}
		});
	} else if (typeof keys === 'string' && keys !== '') {
		output = obj;
		delete output[keys];
	} else {
		throw Error('keys need to be formatted in [string] or non-empty string');
	}
	return output;
};
