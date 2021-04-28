#!/usr/bin/env node
var fs = require("fs");
var luhn = require("luhn");
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const fileData = (() => {
	if (argv._.length) {	
		return fs.readFileSync(argv._[0], {encoding:'utf8', flag:'r'});	
	}

	return fs.readFileSync(0).toString();
})();

const summary = fileData.split("\n").reduce((summary, statement) => {
	const [op, name, accountOrAmount, limit] = statement.split(" ");
	if (op === "Add") {		 		
		summary[name] = {
			account: accountOrAmount,
			limit: parseInt(limit.split("$")[1]),
			balance: 0,
			error: luhn.validate(accountOrAmount) ? null : 'error'
		};
		return summary;
	}

	if (op === "Charge") {
		if (summary[name].error) {
			return summary;
		}

		const charge = parseInt(accountOrAmount.split("$")[1]);
		const newBalance = parseInt(summary[name].balance + charge);
		if (newBalance > summary[name].limit) {
			return summary;
		}

		summary[name].balance = newBalance;
		return summary;
	}

	if (op === "Credit") {			
		if (summary[name].error) {
			return summary;
		}

		const credit = parseInt(accountOrAmount.split("$")[1]);	
		summary[name].balance = parseInt(summary[name].balance - credit);
		return summary;
	}

	return summary;	
}, {});

Object.keys(summary).sort((a, b) => a.trim().localeCompare(b.trim())).forEach((name) => {	
	const statement = summary[name].error ? summary[name].error : `$${summary[name].balance}`;
	console.log(`${name}: ${statement}`);
});
