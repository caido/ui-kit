.PHONY: build-ui deploy-netlify

build-ui:
	pnpm install && pnpm build:ui

deploy-netlify:
	curl https://mise.run/zsh | sh
	mise exec -- pnpm install
	mise exec -- pnpm build:ui
