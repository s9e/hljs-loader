hljs-loader is a small (3 KB) script that can be added to any webpage to automatically load and run [highlight.js](https://highlightjs.org/) on all `pre > code` blocks. It automatically loads additional languages specified via the first `lang-*` or `language-*` class name of each code block.


### Usage

Add this anywhere to your HTML page:

```html
<script async src="https://cdn.jsdelivr.net/gh/s9e/hljs-loader@1.0.12/loader.min.js"
        crossorigin="anonymous"
        integrity="sha384-8nvilyI853lFtVdVYU+pX+4cv/6EWFVYP9l52xHJjn2JaUD5ojvrRQyEjB1nuh/v"></script>
```


### Configuration

No configuration is required but a number of options are available and can be set on the `script` element that loads this script.

```html
<script async src="https://cdn.jsdelivr.net/gh/s9e/hljs-loader@1.0.12/loader.min.js"
        crossorigin="anonymous"
        data-hljs-observe="body"
        data-hljs-options='{"tabReplace":"    "}'
        data-hljs-style="github"
        data-hljs-url="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.2/build/"
        integrity="sha384-8nvilyI853lFtVdVYU+pX+4cv/6EWFVYP9l52xHJjn2JaUD5ojvrRQyEjB1nuh/v"></script>
```

<dl>
<dt><code>data-hljs-observe</code></dt>
<dd>The value should be a CSS selector such as <code>body</code> or <code>#content</code>. The first element that matches this selector will be observed for changes via a <a href="https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver">MutationObserver</a> instance and new code blocks will be automatically highlighted.</dd>

<dt><code>data-hljs-options</code></dt>
<dd>The value should be a JSON-encoded object that will be passed to <code>hljs.configure()</code>.</dd>

<dt><code>data-hljs-style</code></dt>
<dd>Name of the highlight.js style to load. If set to <code>none</code>, no style will be loaded. Defaults to <code>default</code>.</dd>

<dt><code>data-hljs-url</code></dt>
<dd>The root URL used for loading highlight.js files. Defaults to jsDelivr's URL.</dd>
</dl>


### API

By default, all code blocks are highlighted when the library is loaded and you do not need to call the library explicitly. However, there may be some situations where you want to manually trigger highlighting or observe a section of the page for new code blocks.

<dl>
<dt><code>hljsLoader.highlightBlocks(element)</code></dt>
<dd>Highlight all blocks in element's subtree. New languages may be loaded and some blocks may be highlighted asynchronously.

```js
hljsLoader.highlightBlocks(document.body);
```
</dd>

<dt><code>hljsLoader.observe(selector)</code></dt>
<dd>Observe the first element that matches given CSS selector and automatically highlight new code blocks.

```js
hljsLoader.observe('#id');
```
</dd>

<dt><code>hljsLoader.disconnect()</code></dt>
<dd>Disconnect the observer and stop looking for new code blocks.</dd>
</dl>
