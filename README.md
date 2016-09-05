# React Style Sheets
Create cascading style sheets from within your React components

## About

React Style Sheets allows defining styles in your javascript in a similar way to React Native.

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
* Easily extend / override reusable components styles by concatenating classNames
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

## Examples

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

This generates the following style tag and appends it to the head tag

```html
<style type="text/css">
  .myClass_obfus {
    color: red;
  }
</style>
```

```javascript
render: function () {
  return (
    <div className={classNames.myClass + ' ' + this.props.className} />
  );
}
```

```javascript
ReactStyleSheets.createGlobalTagStyles({
  p: {
    margin: '10px auto'
  }
});
```

```javascript
ReactStyleSheets.createUniqueKeyframeAnimation({
  animationName: {
    '0%': {
      opacity: 0;
    },
    '100%': {
      opacity: 1;
    }
  }
});
```

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

```javascript
ReactStyleSheets.createGlobalTagStyles({
  li: {
    before: {
      content: '">"'
    }
  }
});
```

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

```javascript
ReactStyleSheets.createGlobalTagStyles({
  p: {
    margin: [10, 'auto']
  }
});

// Outputs

<style type="text/css">
  p {
    margin: 10px auto;
  }
</style>
```

```javascript
ReactStyleSheets.createGlobalTagStyles({
  p: {
    margin: {
      top: 10,
      bottom: 10
    }
  }
});

// Outputs

<style type="text/css">
  p {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
```
