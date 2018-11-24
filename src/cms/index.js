import React, { useState, useEffect, useContext, useRef } from "react";
import { Subject } from "rxjs";

import { CMSContext } from "./context";

const _Enabled = {
  value: false,
  subject: new Subject(),
  set(value) {
    this.value = value;
    this.subject.next(value);
    return value;
  }
};

const _Selection = {
  // Data and methods for components
  componentsSubscriptions: [],
  currentIndex: null,

  /* 
      Reserve an index for a component.
      A reserved index has null value or truly value.
      A free index has undefined value.
  */
  presubscribe() {
    const freeIndex = this.componentsSubscriptions.findIndex(
      value => value === undefined
    );

    // if no free index exists, add a new element to the array
    if (freeIndex === -1) return this.componentsSubscriptions.push(null) - 1;
    else {
      // reserve the index
      this.componentsSubscriptions[freeIndex] = null;
      return freeIndex;
    }
  },

  // subscribe a new handler to specific index or add it automatically
  subscribe(handler, index) {
    if (index) this.componentsSubscriptions[index] = handler;
    else this.componentsSubscriptions.push(handler);
  },

  unsubscribe(index) {
    // this index is free now, can be reserved again
    this.componentsSubscriptions[index] = undefined;
    // if this index is the last, we can delete it
    if (index == this.componentsSubscriptions.length - 1)
      this.componentsSubscriptions = this.componentsSubscriptions.slice(
        0,
        this.componentsSubscriptions.length - 1
      );
  },

  unselect() {
    // unselect previous component
    if (
      this.currentIndex !== null &&
      this.componentsSubscriptions[this.currentIndex] &&
      typeof this.componentsSubscriptions[this.currentIndex] == "function"
    )
      this.componentsSubscriptions[this.currentIndex](false);
  },
  select(handlerOrIndex) {
    const index =
      typeof handlerOrIndex == "number"
        ? handlerOrIndex
        : this.componentsSubscriptions.indexOf(handler);

    if (this.currentIndex == index || index === -1) return;

    this.unselect();

    //change current selected
    this.currentIndex = index;

    // select next component (0 if there is no next)
    if (
      this.componentsSubscriptions.length > 0 &&
      (!this.componentsSubscriptions[this.currentIndex] ||
        typeof this.componentsSubscriptions[this.currentIndex] != "function")
    )
      this.currentIndex = 0;

    // select component if handler is function
    if (
      this.componentsSubscriptions[this.currentIndex] &&
      typeof this.componentsSubscriptions[this.currentIndex] == "function"
    )
      this.componentsSubscriptions[this.currentIndex](true);
  },

  // General data and methods
  keysMap: {},
  keyboardHandler(e) {
    this.keysMap[e.keyCode] = e.type == "keydown";
    // CTRL + SHIFT pressed together
    if (this.keysMap[17] === true && this.keysMap[16] === true) {
      // SHIFT must be re-pressed for changing
      this.keysMap[16] = false;

      this.unselect();
      let nextIndex = this.currentIndex;
      // first time pressing CTRL + SHIFT, we need to select the first component
      if (nextIndex === null) nextIndex = 0;
      // else just select the next
      else nextIndex += 1;

      this.select(nextIndex);

      return false;
    }
  },
  setup() {
    this.keyboardHandler = this.keyboardHandler.bind(this);
    document.addEventListener("keydown", this.keyboardHandler);
    document.addEventListener("keyup", this.keyboardHandler);
  },
  destroy() {
    document.removeEventListener("keydown", this.keyboardHandler);
    document.removeEventListener("keyup", this.keyboardHandler);
  }
};

const _Contents = {
  // contents managament
  data: {},

  get(code) {
    return this.data && this.data[code] != null ? this.data[code] : null;
  },

  set(code, content) {
    this.data[code] = content;
    this.subject.next({ code: code, content: content });
  },

  // data and methods for components
  subject: new Subject()
};

export default class CMS {
  // This static property specify if CMS contents are editable
  static get Enabled(){ return _Enabled; };

  static get isEnabled() {
    return CMS.Enabled.value;
  }

  static set isEnabled(value) {
    if (value) CMS.setup();
    else CMS.destroy();

    return CMS.Enabled.set(value);
  }

  // for managing selection of components
  static get Selection(){ return _Selection; };

  // for managing components' contents
  static get Contents() { return _Contents; };

  static init(contents) {
    CMS.Contents.data = { ...contents };
  }

  static setup() {
    CMS.Selection.setup();

    //confirm exiting from website
    if (typeof window !== "undefined")
      window.onbeforeunload = function() {
        return "Are you sure to leave?";
      };
  }

  static destroy() {
    CMS.Selection.destroy();

    if (typeof window !== "undefined") window.onbeforeunload = function() {};
  }

  // export all data edited with CMS
  static export() {
    function download(filename, text) {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }

    return download("contents.json", JSON.stringify(CMS.Contents.data));
  }
}

// make CMS available globally
if (typeof window !== "undefined") window.CMS = CMS;

// Hooks

/* 
  return CMS.isEnabled and listen for changes

  @return {Boolean} isEnabled
*/
export function useIsEnabled() {
  // Using this state's variable, for refreshing the component when isEnabled.value changes
  const [isEnabled, setEnabled] = useState(CMS.isEnabled);

  // Subscribe/Unsubscribe to update the value of isEnabled state's variable
  useEffect(
    () => {
      const sub = CMS.Enabled.subject.subscribe({
        next: value => {
          setEnabled(value);
        }
      });

      return () => sub.unsubscribe();
    },
    [isEnabled]
  );

  return isEnabled;
}

/*
  return a bool value: 
  true if the user is pressing the CTRL key of the keyboard 
  but only if isEnabled = true

  @param {Boolean} isEnabled
  @return {Boolean} isHighlighted
*/
export function useIsHighlighted(isEnabled) {
  // Using this state's variable, for highlighting the element
  const [isHighlighted, setHighlight] = useState(false);

  // Subscribe to keyboard's CTRL press event, to highlight the element
  useEffect(
    () => {
      if (isEnabled) {
        const handleKey = e => {
          if (e.type == "keyup") return setHighlight(false);
          //keyCode == 17 is CTRL
          if (e.keyCode == 17 && !isHighlighted && e.type == "keydown")
            setHighlight(true);
        };

        document.addEventListener("keydown", handleKey, false);
        document.addEventListener("keyup", handleKey, false);

        return () => {
          document.removeEventListener("keydown", handleKey, false);
          document.removeEventListener("keyup", handleKey, false);
        };
      }
    },
    // run this effect only if isEnabled changed
    [isEnabled, isHighlighted]
  );

  return isHighlighted;
}

/* 
  this hooks return a value that 
  is true if the current component is selected by keyboard
  but only if isEnabled = true

  @param {Boolean} isEnabled
  @return {
    isSelected: Boolean
    setSelected: Function <-- call this for setting focus on this component
  } 
*/
export function useIsSelected(isEnabled) {
  const [isSelected, setSelected] = useState(false);
  const [reservedIndex, setReservedIndex] = useState(null);

  if (isEnabled && reservedIndex === null) {
    // if no reserved index is setted, take a new one
    setReservedIndex(CMS.Selection.presubscribe());
  }

  useEffect(
    () => {
      if (isEnabled) {
        const handler = value => setSelected(value);
        // subscribe this component to selection, now the component can be selected by keyboard
        CMS.Selection.subscribe(handler, reservedIndex);
      }

      return () => {
        if (reservedIndex) {
          CMS.Selection.unsubscribe(reservedIndex);
          setReservedIndex(null);
        }
      };
    },
    [isEnabled]
  );

  return {
    isSelected,
    setSelected: value => {
      // this will also call 'handler', so setSelected will be called also
      // select with CMS if true
      if (value) CMS.Selection.select(reservedIndex);
      // else deselect globally if current selected is this or deselect locally
      else if (isSelected) {
        if (CMS.Selection.currentIndex == reservedIndex)
          CMS.Selection.unselect();
        else setSelected(false);
      }
    }
  };
}

/*
  return getter and setter for a CMS component's content

  @param {String} code <-- this is the cms code associated with the content
  @param {String} defaultContent <-- if there is no value associated with the cms code, this will be set as default
  @param {Boolean} isEnabled
  @return {content: String, setContent: Function} 
*/
function useContent(code, defaultContent, isEnabled) {
  const [content, setContent] = useState(null);

  if (content === null) {
    const cmsContent = CMS.Contents.get(code);
    setContent(cmsContent !== null ? cmsContent : defaultContent);
  }

  // ⬜ this emojii shows an empty cms content (and it is visible only when CMS is enabled)
  if (content === "" && isEnabled) setContent("⬜");

  /* 
    Subscribe/Unsubscribe to update the value of content state's variable. 
    In a page can be visibile more components with same cms code 
    (so we need to update every instance's content)
  */
  useEffect(() => {
    const sub = CMS.Contents.subject.subscribe({
      next: value => {
        if (value.code == code && content != value.content)
          setContent(value.content === "" ? "⬜" : value.content);
      }
    });

    return () => sub.unsubscribe();
  });

  return {
    content,
    // Set the content for all cms components with this code associated
    setContent: value => {
      // Sanitize input value removing '⬜' (this emojii is present only if the content is empty)
      CMS.Contents.set(code, value.replace("⬜", ""));
    }
  };
}

/* 
  transform a text to a CMS code
  
  @param {String} text
  @return {String} code 
*/
function simplify(text) {
  return text.replace(" ", "_").replace(".", "_");
}

// useCMSComponent is the default hook, for every component based on CMS
export function useCMSComponent(code, contextFree, defaultContent) {
  const ref = useRef(null);
  const [isVisible, setVisible] = useState(false);

  // Checks on element's ref
  useEffect(() => {
    if (ref && ref.current) {
      // Check if the element is visible
      const isVisibleNow = !!ref.current.offsetParent;
      if (isVisibleNow != isVisible) setVisible(isVisibleNow);
    }
  });

  const isEnabled = useIsEnabled();

  // Identificate the cms block which this component is inside
  const currentContext = useContext(CMSContext);
  // Identificate univocally the CMS vocabulo by this cmsCode
  const cmsCode =
    (currentContext && !contextFree ? currentContext + "." : "") +
    (code ? code : simplify(defaultContent));

  const { content, setContent } = useContent(
    cmsCode,
    defaultContent,
    isEnabled
  );

  // CMS's component can be selected or highlighted only if CMS is enabled and the component is visible
  const { isSelected, setSelected } = useIsSelected(isEnabled && isVisible);
  const isHighlighted = useIsHighlighted(isEnabled && isVisible);

  return {
    ref,
    content,
    setContent,
    isEnabled,
    isSelected,
    setSelected,
    isHighlighted
  };
}
