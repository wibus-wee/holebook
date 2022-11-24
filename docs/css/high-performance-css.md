# 如何撰写高性能 CSS

## 前言

其实现在来讲高性能也有点没啥必要，现代浏览器不断在优化、终端配置不断增强，对于增强 CSS 的性能只能靠优化一些边边角角的东西，以及一些加载时间的缩短。但是无论怎么说，可读性和可维护性是第一个需要考虑的。

## 避免使用通配符选择器

层次结构匹配是 CSS 选择器的一种，它可以让你在选择器中使用空格来匹配父子元素。例如：

```css
ul * {
  color: red;
}
```

通配符选择器 `(*)`它会尝试匹配所有的 `ul` 元素的子元素，而不管它们是否在文档中。这种方式会让浏览器做更多的工作，所以不要使用这种方式。

## 从右到左的匹配方向

在 CSS 中，选择器的匹配不同于我们阅读方向，它是从右到左的。例如：

```css
ul > li span[data-index*="1"] {
  color: red;
}
```

这首先将会先解析 `span[data-index*="1"]`，这个第一部分也被称为 “key selector”（关键选择器），然后再解析 `li`，再到 `ul`，这个部分被称为 “context selector”（上下文选择器）。

选择器除非要增强区分度，不然不要过于像 HTML 一样嵌套，比如说 `table tr td`. 很明显，每一个表格里都有一个 `tr`，而每一个 `tr` 里都有一个 `td`，所以这个选择器是多余的，可以简化为 `td`. 解析一个 td 远比解析一个 table tr td 要快。

:::tip
这么做的原因其实想想就知道，在选择器从右到左的匹配时，一旦匹配失败它就会停止，这样一定程度上可以减少工作量。
:::

## 不同选择器的性能

- `#id`：ID 选择器是最快的，因为它是唯一的，所以浏览器不需要去做任何的计算。
- `.class`：类选择器是第二快的，但其实跟 ID 选择器差不多了。
- `element`：元素选择器是第三快的，因为它不需要做任何的计算。
- `general sibling combinator (~)`：通用兄弟选择器是第四快的，因为它只需要匹配同级的元素。
- `child combinator (>)`：子选择器是第五快的，因为它只需要匹配父元素的子元素。
- `descendant combinator ( )`：后代选择器是第六快的，因为它需要匹配所有的后代元素。
- `[attribute]`：属性选择器是第七快的，因为它需要匹配所有的元素。
- `:pseudo-element`：伪元素选择器是最慢的，因为它需要匹配所有的元素。

## 不要做没有必要的标记限定

在 CSS 中，ID 选择器和类选择器是最快的。

```css
ul#nav {
  color: red;
}
```

但是上面的代码就千万别写了，使用 ID 时切勿继续进行标记限定，它已经是最明确的选择器，仅在不可避免的时候使用类的时候才进行标记限定。

比如说 `tag#id` 应该始终是 `#id`，`tag.class` 如果可能的话应该是 `.class`，这意味着所有情况下给定的类只能用相同的标签找到，当然除非特殊情况，但是很少见，所以一般来说，不要。

并且 ID 在所有页面都是唯一的，要求它匹配另外一个唯一元素可能会导致渲染的循环浪费。

## 尽量缩短选择器

从匹配方向来讲，也应该尽可能删除右边 ID 左侧的选择器。比如说 `.class-1 #id-1 nav #id-2 span` 应该是 `#id-2 span` 或者是 `.class-1 #id-2 span`。

选择器越长，它的解析时间就越长。所以尽量缩短选择器，比如说 `#id-1 #id-2 span` 应该是 `#id-2 span`。不仅如此，可读性也会更好。在决定是使用多个子选择器还是删除一个父选择器时，应该优先考虑删除父选择器。

## 参考资料

- https://domhabersack.com/high-performance-css
- https://shauninman.com/archive/2008/05/05/css_qualified_selectors#comment_3942
- https://css-tricks.com/efficiently-rendering-css/
- https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/CSS
- https://blog.zwying.com/archives/70.html