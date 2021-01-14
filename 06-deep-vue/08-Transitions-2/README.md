# Transitions-2 | VNodes

В задаче Transitions-1 не получилось сделать инкапсулированные `scoped` стили. Для их реализации требуется установить стили на непосредственно дочерние элементы в `transition-group`, которые переданы через слот. Например, не будет работать следующее правило:

```css
.fade-list > * {
  transition: all 0.3s ease-out;
}
```

Такая запись не сработает в `scoped` стилях, так как к `*` добавится `data` атрибут компонента `fade-transition-group`, которого не будет в содержимом, переданном через слот.

Частично такие проблемы помогает решать `deep` селектор. Но он заменяет вложенный селектор (`a b`), а не дочерний (`a > b`). В случае этого правила свойства будут применены ко всем потомкам, а не только непосредственно дочерним, что нарушает инкапсуляцию стилей. 

Можно установить какой-нибудь специфический класс на все элементы, непосредственно переданные через слот. Например, `fade-list-item`. Тогда, в комбинации с `deep` селектором можно будет установить свойство `transition: all 0.3s ease-out;` только дочерним элементам. 

Но и тут есть проблемы. Шаблон Vue не предоставляет такой функциональности. Чтобы не нарушать инкапсуляцию компонента, установка классов и стилей на `<slot>` не влияет на содержимое, переданное в слот. Т.е. шаблон `<slot class="fade-list-item">` не даст ожидаемого результата. 

Это ограничение можно обойти с помощью render-функций. В render-функции можно взять все непосредственно дочерние узлы (VNode), и явно модифицировать их, добавив им нужные классы.

Требуется вновь реализовать компонент `FadeTransitionGroup`, реализующий `transition-group` с плавным появлением и перемещением, но в этот раз со `Scoped` стилями.

Компонент: 
- Не имеет входных параметров;
- Имеет слот по умолчанию;
- Реализует `TransparentWrapper` обёртку над `transition-group`;
- Имеет инкапсулированные `scoped` стили, работающие за счёт добавления класса `fade-list-item` элементам, переданным через слот, и использования `deep` селектора.

Полезные ссылки:
- Scoped CSS: [https://vue-loader.vuejs.org/guide/scoped-css.html](https://vue-loader.vuejs.org/guide/scoped-css.html);
- Аргументы функции createElement: [https://vuejs.org/v2/guide/render-function.html#createElement-Arguments](https://vuejs.org/v2/guide/render-function.html#createElement-Arguments);
- Интерфейс VNode: [https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js);
- Типы, связанные с VNode: [https://github.com/vuejs/vue/blob/dev/types/vnode.d.ts](https://github.com/vuejs/vue/blob/dev/types/vnode.d.ts).

*Примечание: [рекомендуемым](https://github.com/vuejs/vue/issues/9051) решением для таких задач является использовать `deep` селектор или не использовать `scoped` стили. Прямое манипулирование VNode - это хак, который следует применять только в крайних случаях. Цель этой задачи - попробовать поработать с VNode.*

---

### Инструкция

📝 Для решения задачи отредактируйте файл: `components/FadeTransitionGroup.vue`.

🚀 Команда запуска для ручного тестирования: `npm run serve`;<br>
приложение будет доступно на [http://localhost:8080/06-deep-vue/08-Transitions-2](http://localhost:8080/06-deep-vue/08-Transitions-2).

✅ Доступно автоматическое тестирование: `npm test Transitions2`.
