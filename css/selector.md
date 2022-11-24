# 关于 CSS 的选择器

## 基本语法

选择器的基本语法就是：

```css
element { style properties }
element, element, element { style properties }
```

## Select List 的缺点

当你使用了类似于`element, element, element { style properties }`的写法时，将会有个问题，我下面写的两行代码并不等价

```css
main,
div,
span:maybe-unsupported {
  background: rgb(205, 114, 86);
}
```

```css
main {
  background: rgb(205, 114, 86);
}
div {
  background: rgb(205, 114, 86);
}
span:maybe-unsupported {
  background: rgb(205, 114, 86);
}
```

这里需要解释一下`span:maybe-unsupported`的意思，我的意思是 span 这个元素有可能在 html 中并没有时

两段 CSS 最本质的区别，一个是合在一起写，一个是分开一行一行，合在一起写的就像我上面说的那样，如果这个`<span>`是不被支持的，那么整条 rule 就是废的，它并不会应用，但是下面的呢即使是 span 这个元素不被支持，其他元素还能继续应用

所以我会更希望这样子写

```html
<main class="back"></main>
<div class="back"></div>
<span class="back"></span>
```

```css
.back {
  background: rgb(205, 114, 86);
}
```

这样子就能直接避免因为一个 span 的问题而导致失效了～

> 也许这个问题比较小见，不过在写一些东西的时候你也需要注意比如说你把一个比较少用的`<notice>`这样的标签写进去，就就就你懂得

当然还有一种方法就是用`:is()`，但是这种方法会导致一个问题：优先级计算失效，也就是说这几个的优先级会变得一样，这个:is 会将失效的标签忽视，之后继续应用，比如说

```css
:is(main, div, span:maybe-unsupported) {
  background: rgb(205, 114, 86);
}
```

这样子的话，即使 span 这个失效，这条规则还是能被应用的～

> 可能有些浏览器不支持这个东西，所以你需要想下要不要使用
