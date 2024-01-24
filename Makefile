TARGET_HEADER=@echo -e '===== \e[34m' $@ '\e[0m'

.PHONY: node_modules
node_modules: package.json web-next/package.json yarn.lock ## installs dependencies
	$(TARGET_HEADER)
	@docker-compose run --rm node yarn install --silent
	@touch node_modules || true

.PHONY: up
up: ## starts the server
	$(TARGET_HEADER)
	@docker-compose up -d

.PHONY: down
down: ## stops the server and removes its container
	$(TARGET_HEADER)
	@docker-compose down

restart: down up

build-legacy:
	$(TARGET_HEADER)
	@docker-compose run --rm node yarn build:legacy

build-next:
	$(TARGET_HEADER)
	@docker-compose run --rm node yarn build:next

build: build-next build-legacy

.PHONY: help
help: ## Calls recipes list
	@cat $(MAKEFILE_LIST) | grep -e "^[a-zA-Z_\-]*: *.*## *" | awk '\
	    BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# Colors
$(call computable,CC_BLACK,$(shell tput -Txterm setaf 0 2>/dev/null))
$(call computable,CC_RED,$(shell tput -Txterm setaf 1 2>/dev/null))
$(call computable,CC_GREEN,$(shell tput -Txterm setaf 2 2>/dev/null))
$(call computable,CC_YELLOW,$(shell tput -Txterm setaf 3 2>/dev/null))
$(call computable,CC_BLUE,$(shell tput -Txterm setaf 4 2>/dev/null))
$(call computable,CC_MAGENTA,$(shell tput -Txterm setaf 5 2>/dev/null))
$(call computable,CC_CYAN,$(shell tput -Txterm setaf 6 2>/dev/null))
$(call computable,CC_WHITE,$(shell tput -Txterm setaf 7 2>/dev/null))
$(call computable,CC_END,$(shell tput -Txterm sgr0 2>/dev/null))