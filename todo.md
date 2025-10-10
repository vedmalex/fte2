# TODO

- Integrate EJS rules into other host languages (html, js, python, swift, ...).
- Explore https://github.com/pushqrdx/vscode-inline-html#readme for inline language ideas.
- Provide embedded language support similar to GraphQL (`fte` templates in JS).
- Prepare for `vsce publish`.

## VS Code integration checklist

- [ ] Restore syntax highlighting for trimmed control tags (e.g. `<#- if ... -#>` in `func.njs`) via parser-driven tokenization:
  - **Раскапываем текущее состояние**
    - [x] Проверить, как TextMate‑грамматики (`syntaxes/template-*.tmLanguage.json`) описывают конструкции `<#- … -#>`, понять, где сопоставление ломается (регэксп для `begin`/`end`, конфликт с другими правилами).
    - [x] Просмотреть генерацию семантических токенов на сервере (`server/src/semanticTokens.ts`): какие типы возвращаются для `blockStart`, `blockEnd`, `code`, и что происходит для trimmed-варианта (`<#- ... -#>`).
    - [x] Убедиться, что клиент регистрирует `semanticTokens` и что VS Code действительно получает токены; при необходимости вывести тестовый дамп (через команду сервера или юнит‑тест) с результатом для проблемного шаблона.
  - **Выбираем точку расширения**
    - [x] Решить, нужно ли править TextMate (если регэксп не покрывает trimmed) или лучше усилить семантические токены: например, гарантировать, что parser возвращает отдельные токены для trimmed-открытия/закрытия и маркирует их как `operator`/`keyword`.
    - [x] Если выбрана parser-driven подсветка, добавить/уточнить классификацию в `buildSemanticTokensFromAst`: отдельные случаи для `<#-`/`-#>` (start/end) и, при необходимости, новые modifiers, чтобы тема распознавала ключевые слова даже без TextMate.
  - **Реализация и проверка**
    - [x] Внести правки (в грамматию и/или `semanticTokens.ts`), собрать сервер, убедиться, что токены содержат trimmed‑пары.
    - [x] Добавить regression‑тест: в `server/__tests__/semantic-tokens.test.js` (или аналог) распарсить шаблон из примера и проверить, что `operator`/`keyword` присутствуют.
    - Вручную прогнать расширение (или через снимок скриншота), подтвердить, что `<#- if ... -#>` вновь подсвечивается.
    - Обновить `todo.md`/документацию с результатом.
- [ ] Fix whitespace-trim suggestion so diagnostics respect `fte.js-parser` tokens and avoid duplicate `-#>` hints.
- [ ] Ensure the VS Code formatter registers and the client receives edits from the bundled formatter.
