# React Style Sheets
Create cascading style sheets from within your React components

## About

React Style Sheets allows defining styles in your javascript in a similar way to React Native, but with a huge host of additional benefits

```javascript
// Define your styles

var classNames = ReactStyleSheets.createUniqueClassStyles({
  myClass: {
    color: 'red'
  }
});

// You can then use this in your React components

<div className={classNames.myClass}>
  Hello, World!
</div>
```

## Benefits

Unlike React Native (or libraries like [Radium](https://github.com/FormidableLabs/radium) / [React Style](https://github.com/js-next/react-style)), it has the following benefits:

* Styles are only generated once, when the script is first loaded
* The styles are not inlined, instead they are added in a style tag and either available globally, or accessed by a unique class name (see examples)
* No need to manually implement hover, active, etc states in javascript
* You can still use inline styles without the need for complex extending of styles
* Easily extend / override reusable components styles by concatenating class names
* You can add global styles for all HTML elements (by tag name)
* You can create and utilize CSS keyframe animations
* You can use advanced selectors like hover, active, disabled, firstChild, etc
* You can use selectors for pseudo elements like before, after, and selection
* You can nest selectors
* You can easily define styles with our intuitive API (automatically adds units, joins arrays, and allows breaking up styles with nested objects)

Benefits of React Style Sheets over using CSS, and CSS pre/post-processors include

* Keep your styles, component logic, and markup in the same file
* Automatically add vendor prefixes
* Use variables and mixins (functions)
* No additional dependencies - parse and bundle your styles with your chosen javascript build tools
* Class names are unique (and obfuscated by default) preventing accidental style inheritance
* No need to invalidate CSS cache

## Examples

### Obfuscated class names

```javascript
// Define your styles
var classNames = ReactStyleSheets.createUniqueClassStyles({
  myClass: {
    color: 'red'
  }
});

// And you end up with some classNames like the following
{
  myClass: 'myClass_obfus'
}

// You can then use this in your React components
<div className={classNames.myClass}>
  Hello, World!
</div>
```

This also generates the following style tag and appends it to the head tag

```html
<style type="text/css">
  .myClass_obfus {
    color: red;
  }
</style>
```

### Global tag styles

```javascript
ReactStyleSheets.createGlobalTagStyles({
  p: {
    margin: '10px auto'
  }
});
```

Generates the following styles (available globally)

```html
<style type="text/css">
  p {
    margin: 10px auto;
  }
</style>
```

### Automatically add units and build up style values from arrays

```javascript
ReactStyleSheets.createGlobalTagStyles({
  p: {
    margin: [10, 'auto']
  }
});
```

Generates the following styles

```html
<style type="text/css">
  p {
    margin: 10px auto;
  }
</style>
```

### Break up style definitions with nesting

```javascript
ReactStyleSheets.createGlobalTagStyles({
  p: {
    margin: {
      top: 10,
      bottom: 10
    }
  }
});
```

Generates the following styles

```html
<style type="text/css">
  p {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
```

### Utilize CSS keyframe animations

```javascript
var animations = ReactStyleSheets.createUniqueKeyframeAnimation({
  myAnimation: {
    '0%': {
      opacity: 0;
    },
    '100%': {
      opacity: 1;
    }
  }
});

var classNames = ReactStyleSheets.createUniqueClassStyles({
  myClass: {
    animation: animations.myAnimation
  }
})
```

### Extend styles easily in reusable components

```javascript
render: function () {
  return (
    <div className={classNames.myClass + ' ' + this.props.className} />
  );
}
```

### Use state selectors like hover, active, disabled, firstChild, etc

```javascript
ReactStyleSheets.createGlobalTagStyles({
  a: {
    textDecoration: 'none',
    hover: {
      textDecoration: 'underline'
    }
  }
});
```

### Use pseudo element selectors like before, after and selection

```javascript
ReactStyleSheets.createGlobalTagStyles({
  li: {
    before: {
      content: '">"'
    }
  }
});
```

### Nest state / pseudo element selectors

```javascript
ReactStyleSheets.createGlobalTagStyles({
  li: {
    firstChild: {
      before: {
        content: '">"'
      }
    }
  }
});
```

### Automatically prefix styles with vendor prefixes

```javascript
ReactStyleSheets.setOptions({
  vendorPrefixes: {
    transform: ['webkit', 'moz', 'ms', 'o']
  }
});

var classNames = React.createUniqueClassStyles({
  myClass: {
    transform: 'rotate(45deg)'
  }
});
```

Generates the following styles

```html
<style type="text/css">
  .myClass_obfus {
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
  }
</style>
```
