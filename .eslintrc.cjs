module.exports = {
	"extends": "eslint:recommended",
	"env": {
		"es2021": true
	},	
	"parserOptions": {
		"ecmaVersion": 12,
		"sourceType": "module"
	},
	"ignorePatterns": ["*.json", "*.md"],
	"rules": {
		"no-undef": 0,
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		]
	}
};
