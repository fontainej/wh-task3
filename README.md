# Task 3 - Javascript Coding

## Pre-requisites
- npm

## Instructions
- `**npm install**`

## Building the app

- For debug mode run: `**gulp build:debug**`
    - Source files located /dist/debug/
- For release mode run: `**gulp build:release**`
    - Source files located /dist/release/

## Running the app on a local machine
- `**gulp**`
- `**gulp watch**`

## Task Description

Included in the zip there is a file called menu.json. Use it to complete the following points.

- Create a blank web page and load this JSON with JavaScript
- Use the loaded JSON to create a tree menu taking into consideration this JSON structure description:
    - Id: id of the element
    - Leaf: If true, this is an end-node
    - Description: Text displayed in the menu
    - Link: Not applicable
    - Content Explained later
    - CssClass: CSS class of the menu element
    - Menu: If available contains the submenu nodes
- Include the following attributes in each menu element: id, cssClass. Also the description has to be displayed as the menu text.
- When you click on a menu it should display any nested sub navigation, displaying the content on the page.

# Requirements
- Use Object Oriented JavaScript for the implementation; **do not use a framework for this task, it should be plain Javascript.**
- Make the code the most adaptable possible.