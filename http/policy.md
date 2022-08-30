## Referrer-Policy

`Referrer-Policy`用于控制`Referer`请求头中可以包含哪些信息，该策略除了可以作为响应头设置外，还可以在`HTML`文档中设置，比如：

```html
<!-- 设置整个文档的 Referrer Policy -->
<meta name="referrer" content="origin">

<!-- 设置单个元素的 Referrer Policy -->
<a href="https://www.example.com" referrerpolicy="origin"></a>
<img src="http://www.example.com/a.jpg" referrerpolicy="origin" alt="" />
```

### 取值
- no-referrer: 不包含任何referrer信息
- no-referrer-when-downgrade
- origin
- origin-when-cross-origin
- same-origin
- strict-origin
- strict-origin-when-cross-origin: (默认值)
- unsafe-url
