# React Contents Manager

This package allows user to edit visually static contents of react apps.

Have you ever created a webapp with react and then you needed to customize the texts within it with members of the team not related to the world of programming (such as copywriters, ux writers, etc ...)?

This package is the right answer: your teammates can edit contents following the user experience flow of your webapp.

![demo](https://media.giphy.com/media/tsTJAClmhO2G0sV5lg/giphy.gif "Demo")

## How it works

Every editable block in your app, is identified univocally by a string code and his content is associated with it.

All these value pairs are stored in a file (.js, .json... or as you want) and are statically loaded when the webapp bundle is loaded.

This CMS system is initialized with these values and will assign right contents to every component.

Just open the console of your browser and digit:

```
CMS.isEnabled = true
```

Use your app as you want, and edit all your texts.
When you have finished just launch from console:

```
CMS.export()
```

This will launch the download of your configuration contents file (.json).

## Installing

Launch in console:

```
npm install react-contents-manager
```

## Documentation

Working on it 💪

## License

This project is licensed under the MIT License

