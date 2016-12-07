Forgekit
Easier way to develop and manage component’s features and inject them into the components.
Motivation
recompose had a great influence. It is great library that provide excellent way to lift state into functional wrappers, perform the most common React patterns, optimize rendering performance. Also it is possible to store common functions separately and share them between components.  And as the result — component’s source code become much more easier.
recompose — React utility belt for function components and higher-order components. Think of it like lodash for React.

Little theory. What is component feature?
Wiki: It is an intentional distinguishing characteristic of a component.
Component feature — is the new component functionality. And in most cases it depends and provide new props. For example HighliteFlags feature for <Button/> component - add success, alert and warning bool props and depending on them provide specific styles.
The problem

Usually all such features are developed and stored inside component and this is the reason for next problems:
Component code become more and more complex. Even simple component can grow into complex with large collection of available props.
Hard to develop new features and remove old or not used. To remove feature developer should find and remove large number of lines and then make sure that all other features work correctly.
Hard to find bugs and fix them. Sometimes there are hotfixes that usually push component to become legacy.
A lot of copy-paste code. Especially a lot of duplication across components propTypes.
Hard to share code. Only whole component could be shared with all implemented features. But sometimes needs to share only specific feature between components or even between applications.

Component is simple and it code is beautiful, simple and readable..

Developing new component features. Developing at this stage is like breathe the crystal clear air. Component is still virgin.
Component became complex and it code is much harder and uglier than was before.
DEATH — bugs, legacy code, spaghetti :( Components look like virus or infection.

Solution: develop features separately
Forgekit suggest to develop and store features separately from components. There are a lot of advantages:
Responsibility. Each feature stored at separated file (or module if speak in CommonJS context) and there is code that implements only specific functionality and provide its own propsTypes.
Sharable. Features could be shared between components or applications. And don’t even depends on components library. It could work above it.
Tests. Easy to write tests because Feature is a pure function.
Refactoring. It is more simpler to remove feature import than find and remove large number of related lines of code.
Refactoring. Old feature could be swapped with new features.
Optimization. Use only needed features. Not used features will not be in the build.
Feature customization. Each feature could be customized separately. This is much better that customize whole component.

High-level and low-level props
In most cases feature depends and provide new props. Props could be splitted into low-level and high-level props.
From React DOM Elements documentation:
React implements a browser-independent DOM system for performance and cross-browser compatibility. We took the opportunity to clean up a few rough edges in browser DOM implementations. In React, all DOM properties and attributes (including event handlers) should be camelCased. For example, the HTML attribute tabindex corresponds to the attribute tabIndex in React. The exception is aria-* and data-* attributes, which should be lowercased.
So all DOM attributes and children prop are low-level props. high-level props — are custom props.
In all cases high-level props always affects on low-level props. That is why most features could be implemented by mapping props before render. And it is better than create higher order component for each feature or develop all features inside component.
It is looks like props middlewares (or like props micro services). It does not generate higher order components so it will not affect on performance.
Forgekit feature function
Forgekit feature is a pure functions that:
provide propTypes and defaultProps
takes props as argument and returns new props
provide its own theme structure (more about themes)

Feature = function(props): newProps
Feature.propTypes = {}
Feature.defaultProps = {}
Forgekit feature with lifecycle methods
Forgekit feature also could be defined as object with two attributes:
props — pure function to map props.
hoc — higher order component. Takes Component as argument and return higher order component.

Feature = {
  props: function(props): newProps,
  hoc: function(
          Component: React.Component
       ): React.Component
}
Feature.propTypes = {}
Feature.defaultProps = {}
Forgekit and Recompose
As the developer of the Forgekit I am not happy to develop one more library (one more npm package). At least because most forgekit features could be implemented with:
recompose/mapProps
recompose/withProps
recompose/setDisplayName
recompose/lifecycle

Forgekit and Recompose differences
Forgekit features provide its own propTypes and defaultProps
Forgekit suggest to develop and store features separately from components. Forgekit feature is a pure functions that:
provide propTypes and defaultProps
takes props as argument and returns new props
provide its own theme structure (more about themes)

There are a lot of advantages:
Responsibility. Each feature stored at separated file (or module if speak in CommonJS context) and there is code that implements only specific functionality and provide its own propsTypes.
Sharable. Features could be shared between components or applications. And don’t even depends on components library. It could work above it.
Refactoring. It is more simpler to remove feature import than find and remove large number of related lines of code.
Refactoring. Old feature can be swapped with new features. So propTypes and defaultProps also will be swapped.

More details at features api documentation;
Forgekit merge propTypes and defaultProps
This is important. And this is the critical difference for our development flow. We use React storybook with storybook info addon so it is important to collect all available propTypes and show them in the docs.
But anyway propTypes merging can be implemented with higher order function for recompose.
Forgekit provide tools for component and feature theming
Allows to define theme structure for feature or component. It is used for classNames or style calculating. Support custom themes provided by global CSS or inline styles and other libraries.
Display name
From my point of view — Forgekit provides more readable displayName. Display name is useful for generating error messages and for React chrome developers tools.
Forgekit:
<MaterialButton> ...
Recompose:
<mapProps(mapProps(MaterialButton))> ...
Forgekit and Recompose perfomance tests
Tested components:
Forgekit component gist
Recompose component gist

Tested 20k renders. Used React perf addon
Forgekit advantages
Share common features between components
here are features that does not relate to certain component. They could be added into any component.
Use only needed features
Look at any open source components library — each component has a lot of features and there are a lot of propTypes. For example component <Button/> has features:
Easier to refactor and support clean code
All needed features could be imported from separated modules. This is very helpful when you want to share your component features with another team, another application or just push them to Github and make them open source. Also this provide good way to keep your code cleaner: just create new module and develop new functionality instead of patching existing modules. And same with refactoring — just remove imports if need to clean some old or unused features. This is much easier than remove large number of lines from components code and then make sure that all other features work correctly.
Easy to remove features — just remove feature import. Instead of removing number of lines from the component.
Easy to write and understand code — feature is a simple function
Code responsibility. Each feature — separated module and there is no extra code. Only feature implementation. Very boost code reading and understanding.

Feature customization
Each feature could be customized. Very similar with Redux middleware customization.
Sharing features in open source
If there is any open source component’s library that was built with Forgekit — it is simple to contribute because developers does not need to understand its whole structure and work with all library. Just develop feature function with tests and push it. Or even push to own repository.
Suggested dev. env for component development
Use Forgekit or Recompose. Especially for base components.
User React storybook for documentation.
Write README.md for each component
Use Storybook knobs addon
Use Storybook info addon. Because Forgekit merge features propTypes it work correctly with this addon.
Use Storybook readme addon
Dont forget about Creeping featurism anti-pattern that can ruin your components. With Forgekit it is much more easier to manage comopnents features.

Feedback wanted
Forgekit is still in the early stages and even still be an experimental project. Your are welcome to submit issue or PR if you have suggestions! Or write me on twitter @tuchk4.
