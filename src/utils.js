export const removeObjectKeys = obj => keys => {
	const output = Object.create(obj);
	Object.assign(output, obj);
	if (Array.isArray(keys)) {
		Object.keys(obj).forEach(key => {
			if (keys.includes(key)) {
				delete output[key];
			}
		});
		return output;
	} else if (typeof keys === 'string' && keys !== '') {
		const k = keys;
		Object.keys(obj).forEach(key => {
			if (key === k) {
				delete output[key];
			}
		});
		return output;
	}
	throw Error('keys need to be formatted in [string] or non-empty string');
};

export default {
	removeObjectKeys,
};
