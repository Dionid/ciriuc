# ciriuc

Helps you with creating react components.

## Stack

This is technologies cli is using with:

1. React
1. classnames ([classnames/bind](https://github.com/JedWatson/classnames#alternate-bind-version-for-css-modules) to be clear)
1. SCSS
1. Flow
1. Redux*

*-optional

## Result

You will get structure like this:

<pre>
<code>
path/to/directory/${ComponentName}
  - ${ComponentName}.js
  - ${ComponentName}.scss
  - package.json
</code>
</pre>

## Base API:

This will create component directory with .js, .scss and package.json

<pre>
<code>
  crc comp path/to/directory/${ComponentName}
</code>
</pre>

## Functional

For functional component use flag -f OR --functional

<pre>
<code>
  crc comp path/to/directory/${ComponentName} -f
</code>
</pre>

## Redux

For Redux connect use flag -r OR --redux

<pre>
<code>
  crc comp path/to/directory/${ComponentName} -r
</code>
</pre>
