import React, { useState } from "react";
import PropTypes from "prop-types";

import ContentEditable from "./content-editable";
import { useCMSComponent } from "./index";

/*
  @param {
    code: String <-- needed for identifing univocally the cms content
    contextFree: Boolean <-- CMS' contexts and sub contexts are not applied to the cms-code
    children: String <-- default content for this component    
  } props 
*/

export default function Inline({ code, contextFree, children }) {
  const {
    ref,
    isEnabled,
    isSelected,
    setSelected,
    isHighlighted,
    content,
    setContent
  } = useCMSComponent(code, contextFree, String(children));

  const handleChange = evt => {
    setContent(evt.target.innerHTML);
  };

  // manage focus of this component
  const handleFocus = evt => {
    if (!isSelected) setSelected(true);
  };

  const handleBlur = evt => {
    if (isSelected) setSelected(false);
  };

  if (isEnabled && ref && ref.current) {
    // focus this div if selected by keyboard and not currently focused
    if (isSelected && document.activeElement != ref.current)
      ref.current.focus();
  }

  // render
  return isEnabled ? (
    <ContentEditable
      style={{
        ...(isHighlighted ? { background: "pink" } : {}),
        ...(isSelected ? { border: "2px solid red" } : {})
      }}
      ref={ref}
      html={content}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tagName="span"
    />
  ) : (
    <React.Fragment>{content}</React.Fragment>
  );
}

Inline.propTypes = {
  children: PropTypes.string
};
