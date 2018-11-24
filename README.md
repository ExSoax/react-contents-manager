# React Contents Manager

This package allows user to edit visually static contents of react apps.

Have you ever created a webapp with react and then you needed to customize the texts within it with members of the team not related to the world of programming (such as copywriters, ux writers, etc ...)?

This package is the right answer: your teammates can edit contents following the user experience flow of your webapp.

![demo](https://s2.gifyu.com/images/Video.gif "Demo")

## How it works

Every editable block in your app, is identified univocally by a string code and his content is associated with it.

All these value pairs are stored in a file (.js, .json... or as you want) and are statically loaded when the webapp bundle is loaded.

This CMS system is initialized with these values and will assign right contents to every component.

Just open the console of your browser and digit:

```
CMS.isEnabled = true
```

Use your app as you want, and edit all your texts.
Holding __CTRL__ on your keyboard will put in evidence every editable content visible in the page.
Holding __CTRL__ and the pressing __SHIFT__ will focus on the next available editable content.
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

## Usage

### First of all

In the entry point of your webapp, import your contents as you prefer (.json file will be the best) and initialize the CMS with these contents:

```
import { CMS } from 'react-contents-manager';
import contents from 'contents.json';

CMS.init(contents);

```

## Make editable your components' texts

In your react web-app you just need to surround editable texts with the __Inline__ component: 

```
import { Inline } from 'react-contents-manager';

export default function ExampleComponent(){
  return (
    <p>
      <Inline code="Example">
        This is the default text associated with this editale content
      </Inline>
    </p>
  );
}
```

When you export contents with __CMS.export__ function, you will gain a json file with the following:

```
{
  "Example": "Any text you want"
}
```

To identify contents in the right way (and avoid collision between codes), it is possible to group same 'kind' of contents with a __SubCMSContext__   

```
import { Inline } from 'react-contents-manager';

function ExampleComponent({code}){
  return (
    <SubCMSContext code={code}>
      <p>
        {/* Only string can be wrapped with <Inline> component */}
        <Inline code="Example">
          {/* The following will be the default text for this content: */}
          This is the default text associated with this editale content
        </Inline>
      </p>
    </SubCMSContext>
  );
}

export default function App(){
  return (
    <>
      <ExampleComponent code={"First"} />
      <ExampleComponent code={"Second"} />
    </>
  );
}
```

In this case, after editing all texts, the exported result json file will be:

```
{
  "First.Example": "Any text you want",
  "Second.Example": "Any text you want"
}
```

You can also define context, with this higher-order component: __withSubCMSContext__


function ExampleComponent({code}){
  return (
    <SubCMSContext code={code}>
      <p>
        <Inline code="Example">
          This is the default text associated with this editale content
        </Inline>
      </p>
    </SubCMSContext>
  );
}

export default withSubCMSContext(function App(){
  return (
    <>
      <ExampleComponent code={"First"} />
      <ExampleComponent code={"Second"} />
    </>
  );
}, 
// if you doesn't specify this parameter, the name of component's class or function will be taken as code
'App')
```

After the export the result json file will be:

```
{
  "App.First.Example": "Any text you want",
  "App.Second.Example": "Any text you want"
}
```

## License

This project is licensed under the MIT License

