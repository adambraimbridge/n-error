export const removeObjectKeys = obj => keys => {
	const output = obj;
	if (Array.isArray(keys)) {
		Object.keys(obj).forEach(key => {
			if (keys.includes(key)) {
				delete output[key];
			}
		});
		// if (obj instanceof Error) {
		// 	['message', 'stack', 'code'].forEach(key => {
		// 		if (keys.includes(key)) {
		// 			Object.assign(obj, { [key]: undefined });
		// 		}
		// 	});
		// }
		return output;
	} else if (typeof keys === 'string' && keys !== '') {
		const k = keys;
		Object.keys(obj).forEach(key => {
			if (key === k) {
				delete output[key];
			}
		});
		// if (obj instanceof Error && ['message', 'stack', 'code'].includes(k)) {
		// 	Object.assign(output, { [k]: undefined });
		// }
		return output;
	}
	throw Error('keys need to be formatted in [string] or non-empty string');
};

export default {
	removeObjectKeys,
};
