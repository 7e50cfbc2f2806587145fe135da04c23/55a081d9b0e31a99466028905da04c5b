export function validate(data: { [key: string]: any }, rules: { [key: string]: string[] }) {
	const errors = {} as any;
	const keys = Object.keys(rules);

	function valid(key: string, rule: string, name: string) {
		const spl = rule.split(':');
		const vld = validators[spl[0]];
		if (vld) {
			const res = vld(name, data[key], spl[1] ? spl[1].split(',') : []);
			if (res) {
				errors[key] = res;
				return true
			}
		}
		return false;
	}


	for (let key of keys) {
		const rule = rules[key];
		let name = '';
		let i = 0;
		for (let sub of rule) {
			if(i == 0) {
				name = sub;
			} else if (valid(key, sub, name)) {
				break
			}
			i ++;
		}
	}
	return errors;
}

export const validators: any = {
	required: function (field: string, value: any, params: string[]) {
		if (!value)
			return `فیلد ${field} الزامی است.`;
	},
	nationalCode: function (field: string, value: any, params: string[]) {
		if (typeof value !== 'string')
			return `فیلد ${field} باید یک رشته باشد.`;
		if (!isValidIranianNationalCode(value)) {
			return `فیلد ${field} باید یک کدملی معتبر باشد.`;
		}
	},
	iranianCard: function (field: string, value: any, params: string[]) {
		const message = `فیلد ${field} باید یک شماره کارت باشد.`;
		if (typeof value !== 'string')
			return message;

		if (value.length != 16 || value.split('').some(a => a === '-' || a === ' ') || !/^[0-9]+$/.test(value))
			return message;

	},
	sheba: function (field: string, value: any, params: string[]) {
		const message = `${field} باید معتبر باشد.`;
		if (typeof value !== 'string')
			return message;

		if (!/^(?=.{24}$)[0-9]*$/.test(value))
			return message;
	},
	minLength: function (field: string, value: any, params: string[]) {
		const message = `${field} نباید کمتر از ${params[0]} کاراکتر باشد.`;
		if (typeof value !== 'string')
			return message;

		if (value.length < +params[0])
			return message;
	},
	min: function (field: string, value: any, params: string[]) {
		const message = `${field} نباید کمتر از ${params[0]} باشد.`;
		if (typeof value !== 'number')
			return message;

		if (value < +params[0])
			return message;
	},
	max: function (field: string, value: any, params: string[]) {
		const message = `${field} نباید بیشتر از ${params[0]} باشد.`;
		if (typeof value !== 'number')
			return message;

		if (value > +params[0])
			return message;
	},
	mobile: function (field: string, value: any, params: string[]) {
		const message = `${field} باید معتبر باشد.`;
		if (typeof value !== 'string')
			return message;

		if (!/^(09)[0-9]{9}$/.test(value))
			return message;
	},
	maxLength: function (field: string, value: any, params: string[]) {
		const message = `${field} نباید بیشتر از ${params[0]} کاراکتر باشد.`;
		if (typeof value !== 'string')
			return message;

		if (value.length > +params[0])
			return message;
	},
	length: function (field: string, value: any, params: string[]) {
		const message = `${field} باید ${params[0]} کاراکتر باشد.`;
		if (typeof value !== 'string')
			return message;

		if (value.length != +params[0])
			return message;
	},
	integer: function (field: string, value: any, params: string[]) {
		const message = `${field} باید فقط عدد باشد.`;
		if (typeof value !== 'string')
			return message;

		if (!/^[0-9]+$/.test(value))
			return message;
	},
	persian: function (field: string, value: any, params: string[]) {
		const message = `${field} باید فقط حروف الفبای فارسی باشد.`;
		if (typeof value !== 'string')
			return message;

		if (!/^[\u0600-\u06FF\s0-9\-_.*]+$/.test(value))
			return message;
	},
	alpha: function (field: string, value: any, params: string[]) {
		const message = `${field} باید فقط حروف الفبا باشد.`;
		if (typeof value !== 'string')
			return message;

		if (!/^[a-zA-Z0-9\-_.*]+$/.test(value))
			return message;
	},
	string: function (field: string, value: any, params: string[]) {
		const message = `${field} باید فقط حروف الفبا باشد.`;
		if (typeof value !== 'string')
			return message;

		if (!/^[\u0600-\u06FF\s0-9a-zA-Z\-_.*]+$/.test(value))
			return message;
	}
};

function isValidIranianNationalCode(input: string) {
	if (!/^\d{10}$/.test(input))
		return false;
	const check = parseInt(input[9]);
	let sum = 0;
	let i;
	for (i = 0; i < 9; ++i) {
		sum += parseInt(input[i]) * (10 - i);
	}
	sum %= 11;
	return (sum < 2 && check == sum) || (sum >= 2 && check + sum == 11);
}
