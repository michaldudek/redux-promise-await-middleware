.PHONY: clear build dev test lint publish

clear:
	@rm -rf ./dist

build: clear
	@mkdir dist
	NODE_ENV=production ./node_modules/.bin/babel src -d dist --presets=es2015,react,react-app

dev: clear
	@mkdir dist
	NODE_ENV=production ./node_modules/.bin/babel src -d dist --presets=es2015,react,react-app --watch

test:
	@echo "No tests yet! :("
	@exit 1

lint:
	@echo "No linting yet! :("
	@exit 1

publish: build
	npm publish
