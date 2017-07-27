.PHONY: clear build test lint publish

clear:
	@rm -rf ./dist

build: clear
	@mkdir dist
	NODE_ENV=production ./node_modules/.bin/babel src -d dist --presets=es2015,react,react-app

test:
	@echo "No tests yet! :("
	@exit 1

lint:
	@echo "No linting yet! :("
	@exit 1

publish:
	npm publish
